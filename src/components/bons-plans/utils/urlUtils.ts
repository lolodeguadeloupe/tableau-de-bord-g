
const BASE_URL = "https://demonstration.clubcreole.fr/"

export const getFullUrl = (url: string | null): string | null => {
  if (!url) return null
  
  // Si l'URL commence déjà par http/https, la retourner telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Sinon, combiner avec la base URL
  return BASE_URL + (url.startsWith('/') ? url.slice(1) : url)
}
