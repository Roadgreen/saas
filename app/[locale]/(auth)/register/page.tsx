import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <AuthForm type="register" />
    </div>
  );
}
