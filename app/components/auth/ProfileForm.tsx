'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDeleteAccount } from '@/components/account/DialogDeleteAccount';

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
        router.refresh();
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}

      <div className="space-y-4">
        <div>
          <Label>Prénom</Label>
          <Input
            type="text"
            value={user.first_name}
            disabled
            className="w-full"
          />
        </div>

        <div>
          <Label>Nom</Label>
          <Input
            type="text"
            value={user.last_name}
            disabled
            className="w-full"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={user.email}
            disabled
            className="w-full"
          />
        </div>

        <div>
          <Label>Rôle</Label>
          <Badge variant="outline" className="w-fit">{user.role.toLowerCase()}</Badge>
        </div>

        <div className="flex gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button>Modifier</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Modifier le profil</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={user.first_name}
                  />
                </div>

                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={user.last_name}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                  />
                </div>

                <Button type="submit">Enregistrer</Button>
              </form>
            </SheetContent>
          </Sheet>

          <Button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
          >
            Se déconnecter
          </Button>

          <DialogDeleteAccount />
        </div>
      </div>
    </div>
  );
} 