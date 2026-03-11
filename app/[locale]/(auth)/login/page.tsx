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
    <div className="flex items-center justify-center min-h-screen relative" style={{ backgroundColor: '#0D0905' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 w-full px-4 py-12 flex items-center justify-center">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
