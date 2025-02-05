'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).every(value => value.trim() !== '');
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (formData: FormData): boolean => {
    const errors: FormErrors = {};
    const fields = ['first_name', 'last_name', 'email', 'password'];
    
    fields.forEach(field => {
      const value = formData[field as keyof FormData]?.toString().trim();
      if (!value) {
        errors[field as keyof FormErrors] = 'Ce champ est requis';
      }
    });

    // Validation spécifique pour l'email
    const email = formData.email?.toString().trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email invalide';
    }

    // Validation spécifique pour le mot de passe
    const password = formData.password?.toString();
    if (password && password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
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
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className={formErrors.first_name ? "border-red-500" : ""}
        />
        {formErrors.first_name && (
          <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className={formErrors.last_name ? "border-red-500" : ""}
        />
        {formErrors.last_name && (
          <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && (
          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={formErrors.password ? "border-red-500" : ""}
        />
        {formErrors.password && (
          <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid}
      >
        S'inscrire
      </Button>
    </form>
  );
} 