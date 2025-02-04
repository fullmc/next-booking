import RegisterForm from '@/app/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
      <RegisterForm />
    </div>
  );
} 