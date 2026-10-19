create table if not exists public.movie_metadata (
  movie_id text primary key,
  metadata jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.diary_entries (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  movie_id text not null references public.movie_metadata(movie_id) on delete cascade,
  watched boolean not null default false,
  watchlist boolean not null default false,
  favourite boolean not null default false,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5 and (rating * 2) = trunc(rating * 2)),
  review text not null default '' check (char_length(review) <= 1000),
  logged_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);

create table if not exists public.dismissed_recommendations (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  movie_id text not null references public.movie_metadata(movie_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);

create index if not exists diary_entries_user_watched_idx on public.diary_entries(user_id, watched);
create index if not exists diary_entries_user_updated_idx on public.diary_entries(user_id, updated_at desc);
create index if not exists dismissed_recommendations_user_idx on public.dismissed_recommendations(user_id);

alter table public.movie_metadata enable row level security;
alter table public.diary_entries enable row level security;
alter table public.dismissed_recommendations enable row level security;

drop policy if exists "Authenticated users can read movie metadata" on public.movie_metadata;
create policy "Authenticated users can read movie metadata" on public.movie_metadata for select to authenticated using (true);
drop policy if exists "Authenticated users can insert movie metadata" on public.movie_metadata;
create policy "Authenticated users can insert movie metadata" on public.movie_metadata for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update movie metadata" on public.movie_metadata;
create policy "Authenticated users can update movie metadata" on public.movie_metadata for update to authenticated using (true) with check (true);

drop policy if exists "Users read their own diary" on public.diary_entries;
create policy "Users read their own diary" on public.diary_entries for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users insert their own diary" on public.diary_entries;
create policy "Users insert their own diary" on public.diary_entries for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Users update their own diary" on public.diary_entries;
create policy "Users update their own diary" on public.diary_entries for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Users delete their own diary" on public.diary_entries;
create policy "Users delete their own diary" on public.diary_entries for delete to authenticated using (user_id = auth.uid());

drop policy if exists "Users read their own dismissals" on public.dismissed_recommendations;
create policy "Users read their own dismissals" on public.dismissed_recommendations for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users insert their own dismissals" on public.dismissed_recommendations;
create policy "Users insert their own dismissals" on public.dismissed_recommendations for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Users delete their own dismissals" on public.dismissed_recommendations;
create policy "Users delete their own dismissals" on public.dismissed_recommendations for delete to authenticated using (user_id = auth.uid());
