'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Loader2, MapPin, Plus, Minus, ShoppingCart, Trash2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCurrentPosition, getDistanceFromLatLonInKm } from '@/lib/geolocation';
import { useHaptic } from '@/hooks/useHaptic';

interface Recipe {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

interface CartItem {
  recipe: Recipe;
  quantity: number;
}

interface QuickSalesGridProps {
  recipes: Recipe[];
}

export function QuickSalesGrid({ recipes }: QuickSalesGridProps) {
  const t = useTranslations('QuickSales');
  const router = useRouter();
  const { impact, notification } = useHaptic();
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      const res = await fetch('/api/locations');
      if (!res.ok) return;
      const locations: Location[] = await res.json();

      const coords = await getCurrentPosition();

      let nearest: Location | null = null;
      let minDistance = Infinity;

      locations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          const dist = getDistanceFromLatLonInKm(
            coords.latitude, 
            coords.longitude, 
            loc.latitude, 
            loc.longitude
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearest = loc;
          }
        }
      });

      if (minDistance < 1 && nearest) {
        setCurrentLocation(nearest);
        fetchWeather(coords.latitude, coords.longitude);
      }
    } catch (error) {
      // Location detection failed or denied — silently ignore
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (error) {
      console.error("Weather error", error);
    }
  };

  const addToCart = (recipe: Recipe) => {
    impact('light');
    setCart(prev => {
      const newCart = new Map(prev);
      const existing = newCart.get(recipe.id);
      if (existing) {
        newCart.set(recipe.id, { ...existing, quantity: existing.quantity + 1 });
      } else {
        newCart.set(recipe.id, { recipe, quantity: 1 });
      }
      return newCart;
    });
  };

  const updateQuantity = (recipeId: string, delta: number) => {
    setCart(prev => {
      const newCart = new Map(prev);
      const existing = newCart.get(recipeId);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          newCart.delete(recipeId);
        } else {
          newCart.set(recipeId, { ...existing, quantity: newQty });
        }
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart(new Map());
  };

  const getTotalItems = () => {
    let total = 0;
    cart.forEach(item => total += item.quantity);
    return total;
  };

  const submitOrder = async () => {
    if (cart.size === 0) return;

    setIsSubmitting(true);
    try {
      const items = Array.from(cart.values()).map(item => ({
        recipeId: item.recipe.id,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        date: new Date().toISOString().split('T')[0],
        locationId: currentLocation?.id,
        weatherSnapshot: weather,
      };

      const response = await fetch('/api/sales/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save order');

      notification('success');
      toast.success(t('orderSaved'));
      clearCart();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartItems = Array.from(cart.values());

  return (
    <Card className="dash-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            {t('title')}
          </div>
          <div className="flex items-center gap-2">
            {currentLocation && (
              <div className="flex items-center gap-1 text-xs font-normal text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">
                <MapPin className="h-3 w-3" />
                {currentLocation.name}
                {weather && <span>• {weather.temp}°C</span>}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {recipes.map((recipe) => {
            const cartItem = cart.get(recipe.id);
            return (
              <Button
                key={recipe.id}
                variant={cartItem ? "default" : "outline"}
                className={`h-24 flex flex-col items-center justify-center gap-1 transition-all relative ${
                  cartItem ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-50 hover:border-gray-200'
                }`}
                onClick={() => addToCart(recipe)}
              >
                <span className="text-2xl">🍔</span>
                <span className="font-medium text-wrap text-center leading-tight text-xs">
                  {recipe.name}
                </span>
                {cartItem && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItem.quantity}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShoppingCart className="h-4 w-4" />
                {t('cart')} ({t('items', { count: getTotalItems() })})
              </div>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-1" />
                {t('clear')}
              </Button>
            </div>

            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.recipe.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="font-medium">{item.recipe.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-7 sm:w-7"
                      onClick={() => updateQuantity(item.recipe.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-7 sm:w-7"
                      onClick={() => updateQuantity(item.recipe.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={submitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {t('validate')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
