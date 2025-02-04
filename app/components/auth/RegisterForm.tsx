'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          email: formData.get('email'),
          password: formData.get('password'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/account');
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label htmlFor="first_name">Prénom</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="last_name">Nom</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
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
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        S'inscrire
      </Button>
    </form>
  );
} 