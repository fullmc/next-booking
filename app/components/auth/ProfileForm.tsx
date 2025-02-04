'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify({
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          email: formData.get('email'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setMessage('Profil mis à jour avec succès');
        router.refresh();
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      try {
        const res = await fetch('/api/user', {
          method: 'DELETE',
        });

        if (res.ok) {
          signOut({ callbackUrl: '/' });
        } else {
          setError('Erreur lors de la suppression');
        }
      } catch (error) {
        setError('Une erreur est survenue');
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name">Prénom</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            defaultValue={user.first_name}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="last_name">Nom</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            defaultValue={user.last_name}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user.email}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="role">Rôle</label>
          <Badge variant="outline" id="role" className="w-fit">{user.role.toLowerCase()}</Badge>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Mettre à jour
          </Button>

          <Button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Se déconnecter
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Supprimer le compte
          </Button>
        </div>
      </form>
    </div>
  );
} 