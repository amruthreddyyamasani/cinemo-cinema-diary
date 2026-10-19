# Cinemo cloud setup

Cinemo uses Supabase Auth plus PostgreSQL tables protected by Row Level Security. The browser only receives the Supabase project URL and publishable key. No service-role key is used in the frontend.

## Required Vercel variables

Add these to Production, Preview, and Development as appropriate:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-or-anon-key>
TMDB_API_KEY=<server-only TMDB key>
```

`VITE_` values are intentionally public browser configuration. Never put the Supabase service-role key or TMDB key in a `VITE_` variable.

## Supabase approval/setup actions

1. Create or select a Supabase project.
2. In SQL Editor, run [`supabase/migrations/202610190001_cinemo_cloud.sql`](supabase/migrations/202610190001_cinemo_cloud.sql).
3. In Authentication settings, choose the email-confirmation behavior you want. The UI handles the confirmation-required response without creating a local fake session.
4. Copy the project URL and publishable/anon key into Vercel environment variables.
5. Redeploy Vercel after saving variables.

The schema uses stable `tmdb-<id>` movie keys for provider films and keeps metadata in `movie_metadata`, separate from private user diary rows. `diary_entries` and `dismissed_recommendations` derive `user_id` from `auth.uid()` by default. Every read, insert, update, and delete policy checks the authenticated user. Review text is stored only in `diary_entries`, which has no public policy.

## Migration behavior

After sign-in, Cinemo loads the authenticated user's cloud state first. If local diary data exists on the device, it offers an import prompt. Import is idempotent: existing `(user_id, movie_id)` rows and dismissals are skipped, so newer cloud records are never overwritten by older local state. Local storage is not cleared on failure. A migration marker is stored per authenticated user only after a successful or explicit skipped decision.

## Verification checklist

Use two separate accounts and browser profiles:

1. Sign up Account A, confirm email if enabled, sign in, mark a film watched, add a half-star rating and private note, then refresh.
2. Sign out and confirm the previous diary disappears from the UI.
3. Sign up Account B and verify Account A's diary, note, and dismissed recommendations are absent.
4. In Supabase Table Editor or SQL Editor, verify direct anonymous reads fail and authenticated users can only query rows where `user_id = auth.uid()`.
5. Retry local import and verify no duplicate rows are created and cloud values are not overwritten.
6. Verify Vercel's client bundle contains neither `TMDB_API_KEY` nor a service-role key.

The repository includes the schema and client implementation, but cloud authentication, RLS, and cross-device behavior are not claimed live until you configure the project and run this checklist.
