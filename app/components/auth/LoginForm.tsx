'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (result?.error) {
      setError('Email ou mot de passe incorrect');
    } else {
      router.push('/activities');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && <div className="text-red-500">{error}</div>}

      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <Button
        type="submit"
        className="w-fit text-white px-6 rounded"
      >
        Se connecter
      </Button>
    </form>
  );
} 