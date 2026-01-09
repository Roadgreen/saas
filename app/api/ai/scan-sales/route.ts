import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { processDailySales } from '@/lib/consumption';

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SALES_SCAN_PROMPT = `Tu es un assistant IA spécialisé dans l'extraction de données de ventes à partir d'images.

L'utilisateur va te montrer une image qui peut être :
- Un papier avec des noms de recettes/produits et des bâtons (||||) pour compter les ventes
- Un écran de caisse ou une machine avec des compteurs
- Un tableau manuscrit avec des noms et des quantités
- Tout autre format de comptage de ventes

Ta tâche : Extraire TOUTES les ventes visibles et retourner un JSON structuré.

IMPORTANT pour les bâtons :
- |||| = 4 ventes (chaque bâton = 1)
- |||| avec une barre diagonale = 5 ventes
- Compte précisément chaque bâton

Retourne UNIQUEMENT ce format JSON :
{
  "sales": [
    {
      "recipeName": "Nom exact de la recette/produit",
      "quantity": 12,
      "confidence": "high"
    }
  ],
  "date": "2025-12-03",
  "notes": "Observations éventuelles sur l'image"
}

RÈGLES :
- "recipeName" : le nom tel qu'écrit sur l'image (on fera le matching après)
- "quantity" : nombre entier de ventes comptées
- "confidence" : "high", "medium", ou "low" selon la lisibilité
- "date" : date du jour si non précisée, sinon la date visible
- Retourne UNIQUEMENT le JSON, pas de texte autour
- Si tu ne peux rien extraire, retourne {"sales": [], "error": "description du problème"}`;

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { business: true },
    });

    if (!user?.business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const autoSave = formData.get('autoSave') === 'true';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        // Get all recipes for this business (for matching)
        const recipes = await prisma.recipe.findMany({
            where: { businessId: user.business.id },
            select: { id: true, name: true },
        });

        // Call OpenAI Vision
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SALES_SCAN_PROMPT },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Voici les recettes existantes dans le système : ${recipes.map(r => r.name).join(', ')}. 
                            
Analyse cette image et extrait les ventes. Essaie de matcher les noms avec les recettes existantes si possible.`,
                        },
                        {
                            type: 'image_url',
                            image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                        },
                    ],
                },
            ],
            max_tokens: 1500,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsedData = JSON.parse(cleanedContent);

        if (parsedData.error) {
            return NextResponse.json({ error: parsedData.error, raw: parsedData }, { status: 400 });
        }

        // Match recipes and prepare results
        const results = [];
        for (const sale of parsedData.sales) {
            // Try to find matching recipe (case insensitive, partial match)
            const matchedRecipe = recipes.find(
                (r) =>
                    r.name.toLowerCase() === sale.recipeName.toLowerCase() ||
                    r.name.toLowerCase().includes(sale.recipeName.toLowerCase()) ||
                    sale.recipeName.toLowerCase().includes(r.name.toLowerCase())
            );

            const resultItem: any = {
                scannedName: sale.recipeName,
                quantity: sale.quantity,
                confidence: sale.confidence,
                matched: !!matchedRecipe,
                recipe: matchedRecipe || null,
            };

            // Auto-save if requested and recipe matched
            if (autoSave && matchedRecipe) {
                const salesRecord = await prisma.dailySales.create({
                    data: {
                        recipeId: matchedRecipe.id,
                        quantity: sale.quantity,
                        date: parsedData.date ? new Date(parsedData.date) : new Date(),
                    },
                });

                // Process stock consumption
                const consumption = await processDailySales(matchedRecipe.id, sale.quantity);

                resultItem.saved = true;
                resultItem.salesRecord = salesRecord;
                resultItem.consumption = consumption;
            }

            results.push(resultItem);
        }

        return NextResponse.json({
            success: true,
            date: parsedData.date,
            notes: parsedData.notes,
            sales: results,
            summary: {
                total: results.length,
                matched: results.filter((r) => r.matched).length,
                saved: results.filter((r) => r.saved).length,
                totalQuantity: results.reduce((sum, r) => sum + r.quantity, 0),
            },
        });
    } catch (error: any) {
        console.error('Sales scan error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
