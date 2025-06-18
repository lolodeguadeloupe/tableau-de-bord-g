
// Fonction utilitaire pour formater une date au format YYYY-MM-DD
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ""
  
  // Si la date est déjà au bon format (YYYY-MM-DD), la retourner telle quelle
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Sinon, essayer de parser et formater la date
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error)
    return ""
  }
}
