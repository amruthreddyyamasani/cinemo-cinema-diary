import type { Film } from './data'

export type CatalogueResponse = { configured: boolean; films: Film[]; page: number; totalPages: number; hasMore: boolean; source: string; error?: string }

export function mergeFilms(current: Film[], incoming: Film[]) {
  const seen = new Set<string>()
  return [...current, ...incoming].filter(film => {
    if (seen.has(film.id)) return false
    seen.add(film.id)
    return true
  })
}

export async function loadCatalogue(query: string, page: number, filters: { genre?: string; year?: string; sort?: string }, signal?: AbortSignal): Promise<CatalogueResponse> {
  const params = new URLSearchParams({ page: String(page) })
  if (query.trim()) params.set('query', query.trim())
  if (filters.genre) params.set('genre', filters.genre)
  if (filters.year) params.set('year', filters.year)
  if (filters.sort) params.set('sort', filters.sort)
  const response = await fetch(`/api/tmdb?${params.toString()}`, { signal, headers: { Accept: 'application/json' } })
  const body = await response.json().catch(() => ({}))
  if (response.status === 404 || (response.status === 503 && body.configured === false) || (!body.configured && !Array.isArray(body.films))) return { configured: false, films: [], page: 1, totalPages: 1, hasMore: false, source: 'local fallback', error: body.error || 'TMDB is not configured in this environment. Cinemo is showing its local catalogue.' }
  if (!response.ok) throw new Error(body.error || 'Movie provider is temporarily unavailable.')
  return body as CatalogueResponse
}
