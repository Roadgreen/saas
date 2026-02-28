import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Connexion' : 'Sign In',
    description: isFr
      ? 'Connectez-vous à votre compte FoodTracks pour gérer vos stocks et suivre vos ventes.'
      : 'Sign in to your FoodTracks account to manage inventory and track sales.',
    robots: { index: false, follow: false },
  };
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <AuthForm type="login" />
    </div>
  );
}
