# Deploy Cinemo with TMDB on Vercel

Cinemo uses the Vercel serverless function at `api/tmdb.js`. The TMDB credential is read only on the server from `process.env.TMDB_API_KEY` (or `TMDB_READ_TOKEN` if that is the configured credential). It is not prefixed with `VITE_` and is never imported into browser code.

## Vercel dashboard

1. Open the Cinemo project in Vercel and confirm the project root is the repository root.
2. In **Settings → Environment Variables**, add or verify `TMDB_API_KEY` for the environments you deploy: **Production**, **Preview**, and optionally **Development**. Keep the value encrypted and do not add it to `.env` files committed to Git.
3. In **Settings → General**, use the existing Vite defaults: install `npm install`, build `npm run build`, and output directory `dist`.
4. Trigger a new deployment after saving the variable. Environment-variable changes do not retroactively update an already-built deployment.

## Vercel CLI alternative

From a clean checkout with the Vercel project already linked:

```bash
vercel env add TMDB_API_KEY production
vercel env add TMDB_API_KEY preview
vercel --prod
```

Enter the value only in the Vercel CLI prompt. Do not paste it into a shell command, commit it, or expose it as a `VITE_` variable.

## Verification after deployment

Replace `https://your-deployment.vercel.app` with the deployed URL:

```bash
curl -sS 'https://your-deployment.vercel.app/api/tmdb?query=Parasite&page=1' \
  -H 'Accept: application/json'
```

A working response has `configured: true`, `source: "TMDB"`, a `films` array, and `hasMore`. It must not contain the API key. Then verify detail enrichment using a returned `tmdb-<id>` value:

```bash
curl -sS 'https://your-deployment.vercel.app/api/tmdb?id=tmdb-496243' \
  -H 'Accept: application/json'
```

The detail response should contain `film.runtime`, `film.director`, `film.cast`, `film.genres`, poster/backdrop URLs, and `source: "TMDB"`.

In the browser, open **Discover** and confirm the status changes from **LOCAL CURATED FALLBACK** to **TMDB LIVE**. Search, change the genre/year/sort controls, use **Load more films**, open a returned film, and confirm its modal shows provider-enriched runtime, director, and cast. The footer contains the required TMDB logo and notice:

> This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.

If the function returns `503`, the variable is missing from that Vercel environment. If it returns `401` or `403`, the credential is present but invalid or not authorized. If it returns `429`, wait and retry; Cinemo keeps its local catalogue fallback available.
