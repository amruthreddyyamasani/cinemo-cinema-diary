import type { Film } from '../data'
import type { Entry } from '../diary-types'
import { supabase } from './supabase'

export type CloudState = { entries: Entry[]; dismissed: string[]; films: Film[] }

const movieKey = (film: Film) => film.providerId ? `tmdb-${film.providerId}` : film.id
const toFilm = (row: any): Film | null => row?.metadata ? ({ ...row.metadata, id: row.metadata.legacyId || row.movie_id, providerId: row.metadata.providerId || row.movie_id.replace(/^tmdb-/, '') }) : null

export const isCloudEnabled = () => Boolean(supabase)

export async function signUp(email: string, password: string, name: string) {
  if (!supabase) throw new Error('Cloud authentication is not configured.')
  return supabase.auth.signUp({ email, password, options: { data: { name } } })
}
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Cloud authentication is not configured.')
  return supabase.auth.signInWithPassword({ email, password })
}
export async function signOut() { if (supabase) await supabase.auth.signOut() }

export async function loadCloudState(): Promise<CloudState> {
  if (!supabase) return { entries: [], dismissed: [], films: [] }
  const { data, error } = await supabase.from('diary_entries').select('*, movie_metadata(*)')
  if (error) throw error
  const entries: Entry[] = (data || []).map((row: any) => ({ filmId: row.movie_id, watched: row.watched, watchlist: row.watchlist, favourite: row.favourite, rating: Number(row.rating || 0), review: row.review || '', loggedAt: row.logged_at || row.updated_at }))
  const films = (data || []).map((row: any) => toFilm(row.movie_metadata)).filter(Boolean) as Film[]
  const dismissedResult = await supabase.from('dismissed_recommendations').select('movie_id, movie_metadata(*)')
  if (dismissedResult.error) throw dismissedResult.error
  return { entries, dismissed: (dismissedResult.data || []).map((row: any) => row.movie_metadata?.metadata?.legacyId || row.movie_id), films }
}

export async function saveEntry(film: Film, entry: Entry) {
  if (!supabase) return
  const key = movieKey(film)
  const { error: metadataError } = await supabase.from('movie_metadata').upsert({ movie_id: key, metadata: { ...film, id: key, legacyId: film.id } }, { onConflict: 'movie_id' })
  if (metadataError) throw metadataError
  const { error } = await supabase.from('diary_entries').upsert({ movie_id: key, watched: entry.watched, watchlist: entry.watchlist, favourite: entry.favourite, rating: entry.rating, review: entry.review, logged_at: entry.loggedAt }, { onConflict: 'user_id,movie_id' })
  if (error) throw error
}
export async function deleteEntry(film: Film) {
  if (!supabase) return
  const { error } = await supabase.from('diary_entries').delete().eq('movie_id', movieKey(film))
  if (error) throw error
}
export async function saveDismissed(movieId: string, film?: Film) {
  if (!supabase) return
  if (film) await supabase.from('movie_metadata').upsert({ movie_id: movieKey(film), metadata: { ...film, id: movieKey(film) } }, { onConflict: 'movie_id' })
  const { error } = await supabase.from('dismissed_recommendations').upsert({ movie_id: movieId }, { onConflict: 'user_id,movie_id' })
  if (error) throw error
}
export async function migrateLocalState(entries: Entry[], dismissed: string[], films: Film[]) {
  if (!supabase) throw new Error('Cloud authentication is not configured.')
  const filmById = new Map(films.map(f => [f.id, f]))
  const existingEntries = await supabase.from('diary_entries').select('movie_id')
  if (existingEntries.error) throw existingEntries.error
  const existingMovies = new Set((existingEntries.data || []).map(row => row.movie_id))
  let imported = 0
  for (const entry of entries) {
    const film = filmById.get(entry.filmId)
    if (!film) continue
    const key = movieKey(film)
    if (existingMovies.has(key)) continue
    await saveEntry(film, entry)
    existingMovies.add(key)
    imported += 1
  }
  const existingDismissed = await supabase.from('dismissed_recommendations').select('movie_id')
  if (existingDismissed.error) throw existingDismissed.error
  const dismissedMovies = new Set((existingDismissed.data || []).map(row => row.movie_id))
  for (const id of dismissed) {
    const film = filmById.get(id)
    const key = film?.providerId ? `tmdb-${film.providerId}` : id
    if (dismissedMovies.has(key)) continue
    await saveDismissed(key, film)
    dismissedMovies.add(key)
  }
  return imported
}
