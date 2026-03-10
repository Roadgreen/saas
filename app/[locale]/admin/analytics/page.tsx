import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';

const ADMIN_EMAIL = 'foodtracksio@gmail.com';

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Only allow the admin email — redirect everyone else
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminAnalyticsDashboard />
      </div>
    </div>
  );
}
