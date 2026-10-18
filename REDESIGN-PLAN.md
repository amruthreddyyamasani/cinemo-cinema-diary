# Cinemo redesign implementation plan

## Audit findings

Cinemo is a Vite + React + TypeScript single-page application. The current product already has local persistence for the diary, theme, quiz, and guest session; a real-film catalog; search; film details; watchlist, watched, favourite and rating actions; recommendations; quiz scoring; and the three animation components under `src/components`. There is no configured movie API, server authentication, or database in this repository, so this redesign preserves the current local-first behavior and does not invent a live provider integration.

## Opening experience decision

The two supplied videos were checked for format, duration, composition, and screen suitability. Video A is 1924×1076, 12 seconds, H.264, and shows a centered person at a desk with bright computer screens in a surreal field-and-stars setting. The camera is static, so the transition uses a scroll-linked CSS camera push toward the centered screen rather than pretending there is source-camera movement. Video B is 1920×1080, 6 seconds, HEVC, and contains an eye-to-forest zoom with no laptop or display; it is not suitable for the requested laptop transition.

Video A is therefore used as a remote background video with a local poster fallback. The transition is a short 170vh pinned opening only. Its sticky frame scales toward the central screen as native page scroll progresses, then reveals a small bridge into the existing discovery product. Reduced-motion users receive the static poster and immediate bridge state. Video failure never blocks navigation.

## Interaction research notes

The named Awwwards references were reviewed for technique rather than copied. 0110 Studio is tagged around immersive 3D scroll and an interactive scene; Vincent & Dussault emphasizes a scroll gallery with staged visual pacing; Charles Leclerc uses a centered image-transition/mask idea. Cinemo translates those principles into a restrained, content-bearing screen entry: one pinned section, one scroll-linked scale, a centered visual target, and ordinary document scrolling immediately afterward.

## Catalogue upgrade

The product now has an optional server-side TMDB adapter at `api/tmdb.js`. It supports title search, genre/year filters, provider sorting, page-based loading, stable `tmdb-<id>` identifiers, and provider artwork URLs without exposing credentials in the client bundle. The client merges provider pages by stable ID and exposes a manual “Load more films” action. Abortable debounced searches reset page state when query or filters change.

No TMDB credential is configured in this repository, so the verified runtime uses the eight-record local fallback and labels it as such. This is intentional: the UI does not claim a larger live database when the provider is unavailable. Production deployment should set `TMDB_READ_TOKEN` server-side, review TMDB attribution/terms, and then the same interface will expose the broader provider catalogue.
