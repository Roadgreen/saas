import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminErrorsDashboard from '@/components/admin/AdminErrorsDashboard';

const ADMIN_EMAIL = 'foodtracksio@gmail.com';

export default async function AdminErrorsPage({
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
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminErrorsDashboard />
      </div>
    </div>
  );
}
