import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function PricingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('Pricing');
  const session = await auth();
  
  let currentTier = 'FREE';

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { business: true },
    });
    if (user?.business) {
        currentTier = user.business.subscriptionTier;
    }
  }

  const plans = [
    {
      key: 'free',
      tier: 'FREE',
      variant: 'outline',
    },
    {
      key: 'pro',
      tier: 'PRO',
      variant: 'default', // Highlighted
    },
    {
      key: 'enterprise',
      tier: 'ENTERPRISE',
      variant: 'outline',
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-stretch">
        {plans.map((plan) => (
          <Card key={plan.key} className={`flex flex-col h-full ${plan.tier === currentTier ? 'border-primary border-2' : ''}`}>
            <CardHeader>
              <CardTitle>{t(`${plan.key}.title`)}</CardTitle>
              <CardDescription>{t(`${plan.key}.description`)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold mb-4">{t(`${plan.key}.price`)}</div>
              <ul className="space-y-2">
                {/* We assume features is an array in the translation file, but next-intl returns a string if not handled carefully. 
                    For simplicity in this demo, we'll hardcode the keys or assume the translation returns an array if configured, 
                    but standard next-intl usage with keys is safer. 
                    Let's use a known number of features or map raw keys if possible. 
                    Actually, let's just use the keys 0, 1, 2, 3... based on the JSON array structure if supported, 
                    or just fetch the array. 
                    Wait, `t.raw` is needed for arrays. */}
                {(t.raw(`${plan.key}.features`) as string[]).map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.variant as "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"} disabled={plan.tier === currentTier}>
                {plan.tier === currentTier ? t('currentPlan') : plan.key === 'enterprise' ? t('contact') : t('subscribe')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
