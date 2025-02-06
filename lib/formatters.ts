export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: Date) => {
  return new Date(date).toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (duration: number) => {
  return duration > 1 ? `${duration} heures` : `${duration} heure`;
}; 