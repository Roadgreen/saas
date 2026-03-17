import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminErrorsDashboard from '@/components/admin/AdminErrorsDashboard';

const ADMIN_EMAIL = 'foodtracksio@gmail.com';

export const metadata: Metadata = {
  title: 'Error Monitoring - Admin',
  robots: { index: false, follow: false },
};

export default async function DashboardAdminErrorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email === ADMIN_EMAIL;

  if (!session?.user?.email || !isAdmin) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="flex-1 space-y-6">
      <AdminErrorsDashboard />
    </div>
  );
}
