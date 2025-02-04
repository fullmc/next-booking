'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
          prenom: formData.get('prenom'),
          nom: formData.get('nom'),
          email: formData.get('email'),
          motdepasse: formData.get('motdepasse'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/login');
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
        <label htmlFor="prenom">Prénom</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          name="nom"
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
        <label htmlFor="motdepasse">Mot de passe</label>
        <input
          type="password"
          id="motdepasse"
          name="motdepasse"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        S'inscrire
      </button>
    </form>
  );
} 