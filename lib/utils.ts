import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tagSeverityMapper = (type: string | undefined): 'success' | 'info' | 'warning' | 'danger' | null => {
  if (!type) return null;
  switch (type.toLowerCase()) {
    case 'soft':
      return 'success';
    case 'realistic':
      return 'info';
    case 'hardcore':
      return 'warning';
    case 'survival':
      return 'danger';
    default:
      return 'info';
  }
};