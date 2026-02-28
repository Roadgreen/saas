'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Save,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  name: string;
}

interface SumUpMappingPanelProps {
  onClose?: () => void;
}

export function SumUpMappingPanel({ onClose }: SumUpMappingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recentProducts, setRecentProducts] = useState<string[]>([]);

  // recipeMappings: recipeId → SumUp product name
  const [recipeMappings, setRecipeMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/sumup/mappings')
      .then((r) => r.json())
      .then((data) => {
        const loadedRecipes: Recipe[] = data.recipes ?? [];
        setRecipes(loadedRecipes);
        setRecentProducts(data.recentProducts ?? []);

        // Invert stored mappings: { productName → recipeId } → { recipeId → productName }
        const storedMappings: Record<string, string> = data.mappings ?? {};
        const reversed: Record<string, string> = {};
        for (const [productName, recipeId] of Object.entries(storedMappings)) {
          reversed[recipeId] = productName;
        }

        // For recipes with no mapping, default to the recipe name
        const initial: Record<string, string> = {};
        for (const recipe of loadedRecipes) {
          initial[recipe.id] = reversed[recipe.id] ?? recipe.name;
        }
        setRecipeMappings(initial);
      })
      .catch((err) => toast.error(err.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    // Convert back to { productName → recipeId }
    const forwardMappings: Record<string, string> = {};
    for (const [recipeId, productName] of Object.entries(recipeMappings)) {
      if (productName.trim()) {
        forwardMappings[productName.trim()] = recipeId;
      }
    }

    setSaving(true);
    try {
      const res = await fetch('/api/sumup/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings: forwardMappings, replace: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const extra = data.rematched > 0
        ? ` · ${data.rematched} transaction${data.rematched > 1 ? 's' : ''} mise${data.rematched > 1 ? 's' : ''} à jour`
        : '';
      toast.success(`Correspondances sauvegardées${extra}`);
      onClose?.();
    } catch (err: any) {
      toast.error(err.message ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Find any detected SumUp product names that aren't matched to a recipe
  const unmappedProducts = recentProducts.filter(
    (p) => !Object.values(recipeMappings).some((v) => v.trim() === p)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 py-6 text-center space-y-1">
        <AlertCircle className="h-4 w-4 mx-auto text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Aucune recette trouvée.</p>
        <p className="text-[11px] text-muted-foreground/70">
          Crée d&apos;abord des recettes dans FoodTracks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Naming guidelines */}
      <div className="rounded-lg border border-blue-200/60 bg-blue-50/60 p-3 space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-medium text-xs">
          <Lightbulb className="h-3.5 w-3.5 shrink-0" />
          Conseil pour un matching automatique parfait
        </div>
        <ul className="text-xs text-blue-600 space-y-1 pl-5 list-disc">
          <li>
            Dans SumUp, nomme tes produits <strong>exactement</strong> comme tes recettes
            FoodTracks (même casse, mêmes accents).
          </li>
          <li>
            Si les noms diffèrent, modifie le champ ci-dessous pour qu&apos;il corresponde
            au <strong>nom exact du produit dans SumUp</strong>.
          </li>
        </ul>
      </div>

      {/* Recipes → SumUp product name */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recette FoodTracks → Nom du produit dans SumUp
        </p>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {recipes.map((recipe) => {
            const productName = recipeMappings[recipe.id] ?? '';
            const exactMatch = productName.trim() === recipe.name;
            const detectedMatch = recentProducts.includes(productName.trim());

            return (
              <div key={recipe.id} className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
                {/* Recipe name (fixed) */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium truncate" title={recipe.name}>
                    {recipe.name}
                  </span>
                </div>

                {/* SumUp product name (editable) */}
                <div className="flex-1 min-w-0 relative">
                  <Input
                    value={productName}
                    onChange={(e) =>
                      setRecipeMappings((prev) => ({ ...prev, [recipe.id]: e.target.value }))
                    }
                    placeholder="Nom du produit SumUp..."
                    className="h-7 text-xs font-mono pr-6"
                    list={`suggestions-${recipe.id}`}
                  />
                  {/* Datalist suggestions from detected products */}
                  <datalist id={`suggestions-${recipe.id}`}>
                    {recentProducts.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>

                {/* Status indicator */}
                {detectedMatch ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : exactMatch ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unrecognized SumUp products (from transactions, not yet mapped) */}
      {unmappedProducts.length > 0 && (
        <div className="rounded-lg border border-amber-200/60 bg-amber-50/60 p-3 space-y-1.5">
          <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Produits SumUp détectés sans correspondance ({unmappedProducts.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {unmappedProducts.map((p) => (
              <code key={p} className="text-[11px] bg-amber-100 text-amber-800 rounded px-1.5 py-0.5 font-mono">
                {p}
              </code>
            ))}
          </div>
          <p className="text-[11px] text-amber-600">
            Copie l&apos;un de ces noms dans le champ de la recette correspondante.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1 border-t border-border">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Fermer
          </Button>
        )}
        <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs">
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
          ) : (
            <Save className="h-3 w-3 mr-1.5" />
          )}
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
