import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { processDailySales } from '@/lib/consumption';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
    if (!_openai) {
        _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return _openai;
}

const SALES_SCAN_PROMPT = `Tu es un assistant IA specialise dans l'extraction de donnees de ventes a partir d'images.

L'utilisateur va te montrer une image qui peut etre :
- Un papier avec des noms de recettes/produits et des batons (||||) pour compter les ventes
- Un ecran de caisse ou une machine avec des compteurs
- Un tableau manuscrit avec des noms et des quantites
- Tout autre format de comptage de ventes

Ta tache : Extraire TOUTES les ventes visibles et retourner un JSON structure.

IMPORTANT pour les batons :
- |||| = 4 ventes (chaque baton = 1)
- |||| avec une barre diagonale = 5 ventes
- Compte precisement chaque baton

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
  "notes": "Observations eventuelles sur l'image"
}

REGLES :
- "recipeName" : le nom tel qu'ecrit sur l'image (on fera le matching apres)
- "quantity" : nombre entier de ventes comptees
- "confidence" : "high", "medium", ou "low" selon la lisibilite
- "date" : date du jour si non precisee, sinon la date visible
- Retourne UNIQUEMENT le JSON, pas de texte autour
- Si tu ne peux rien extraire, retourne {"sales": [], "error": "description du probleme"}`;

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

    if (user.business.subscriptionTier === 'FREE') {
        return NextResponse.json({ error: 'AI scanner requires a Pro subscription' }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const autoSave = formData.get('autoSave') === 'true';
        const locationId = formData.get('locationId') as string | null;
        const weatherSnapshotStr = formData.get('weatherSnapshot') as string | null;
        const weatherSnapshot = weatherSnapshotStr ? JSON.parse(weatherSnapshotStr) : null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (locationId) {
            const location = await prisma.location.findUnique({
                where: { id: locationId },
                select: { businessId: true },
            });
            if (!location || location.businessId !== user.business.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
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
        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SALES_SCAN_PROMPT },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Voici les recettes existantes dans le systeme : ${recipes.map(r => r.name).join(', ')}.

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
                        locationId: locationId || undefined,
                        weatherSnapshot: weatherSnapshot || undefined,
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
