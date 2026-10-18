const GENRES = { 12:'Adventure', 16:'Animation', 18:'Drama', 27:'Horror', 28:'Action', 35:'Comedy', 36:'History', 37:'Western', 53:'Thriller', 80:'Crime', 99:'Documentary', 10749:'Romance', 878:'Science Fiction', 9648:'Mystery', 10402:'Music', 10751:'Family', 10752:'War', 10770:'TV Movie' }

function filmFromResult(movie) {
  const year = Number(String(movie.release_date || '').slice(0, 4)) || 0
  return { id:`tmdb-${movie.id}`, title:movie.title || movie.original_title || 'Untitled film', year, runtime:0, genres:(movie.genre_ids || []).map(id => GENRES[id]).filter(Boolean), director:'', cast:[], language:movie.original_language || '', country:'', synopsis:movie.overview || 'No synopsis supplied by the provider.', poster:movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '', backdrop:movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '', source:'TMDB', providerId:String(movie.id), releaseDate:movie.release_date || '', voteAverage:movie.vote_average }
}

function filmFromDetail(movie) {
  const crew = movie.credits?.crew || []
  const director = crew.find(person => person.job === 'Director')?.name || ''
  return { ...filmFromResult({ ...movie, genre_ids:[], release_date:movie.release_date }), id:`tmdb-${movie.id}`, runtime:movie.runtime || 0, genres:(movie.genres || []).map(genre => genre.name).filter(Boolean), director, cast:(movie.credits?.cast || []).slice(0, 6).map(person => person.name), country:(movie.production_countries || []).map(country => country.name).join(' · '), language:movie.spoken_languages?.[0]?.english_name || movie.original_language || '', providerId:String(movie.id), releaseDate:movie.release_date || '', voteAverage:movie.vote_average }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error:'Use GET for movie discovery.' })
  const token = process.env.TMDB_READ_TOKEN
  const apiKey = process.env.TMDB_API_KEY
  if (!token && !apiKey) return res.status(503).json({ configured:false, error:'TMDB is not configured. Cinemo is showing its local catalogue.' })
  const params = new URLSearchParams({ page:String(Math.max(1, Math.min(500, Number(req.query?.page || 1)))) })
  const detailId = String(req.query?.id || '').replace(/^tmdb-/, '')
  const query = String(req.query?.query || '').trim()
  const genre = String(req.query?.genre || '').trim()
  const year = String(req.query?.year || '').trim()
  const sort = String(req.query?.sort || 'popularity.desc').trim()
  if (detailId && /^\d+$/.test(detailId)) {
    const detailUrl = `https://api.themoviedb.org/3/movie/${detailId}?append_to_response=credits&language=en-US${apiKey ? `&api_key=${encodeURIComponent(apiKey)}` : ''}`
    try {
      const upstream = await fetch(detailUrl, { headers: token ? { Authorization:`Bearer ${token}`, Accept:'application/json' } : { Accept:'application/json' } })
      const data = await upstream.json().catch(() => ({}))
      if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : upstream.status === 404 ? 404 : 502).json({ error:data.status_message || 'TMDB detail request failed.' })
      return res.status(200).json({ configured:true, film:filmFromDetail(data), source:'TMDB' })
    } catch (error) { return res.status(502).json({ error:error instanceof Error ? error.message : 'TMDB detail request failed.' }) }
  }
  const endpoint = query ? '/search/movie' : '/discover/movie'
  if (query) params.set('query', query)
  else { params.set('sort_by', ['popularity.desc','vote_average.desc','primary_release_date.desc'].includes(sort) ? sort : 'popularity.desc'); if (genre) params.set('with_genres', genre); if (/^\d{4}$/.test(year)) params.set('primary_release_year', year); params.set('include_adult','false'); params.set('language','en-US') }
  const url = `https://api.themoviedb.org/3${endpoint}?${params.toString()}${apiKey ? `&api_key=${encodeURIComponent(apiKey)}` : ''}`
  try {
    const upstream = await fetch(url, { headers: token ? { Authorization:`Bearer ${token}`, Accept:'application/json' } : { Accept:'application/json' } })
    const data = await upstream.json().catch(() => ({}))
    if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : 502).json({ error:data.status_message || 'TMDB request failed.' })
    const films = (data.results || []).filter(movie => movie && movie.id).map(filmFromResult)
    return res.status(200).json({ configured:true, films, page:data.page || 1, totalPages:data.total_pages || 1, hasMore:(data.page || 1) < (data.total_pages || 1), source:'TMDB' })
  } catch (error) { return res.status(502).json({ error:error instanceof Error ? error.message : 'TMDB request failed.' }) }
}
