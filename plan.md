# Cinemo implementation plan

## Approach
Replace the existing Trace demo surface with a local-first React single-page cinema diary. Keep the existing Vite, TypeScript, Motion and Lucide setup. Use a small curated catalog of real films with provider-linked poster artwork, then persist account, library, ratings, theme and quiz state in localStorage so the core journey works without a backend or secret key.

## Product architecture
- `src/main.tsx`: application shell, navigation, auth, discovery, library, recommendations, film details and quiz flows.
- `src/data.ts`: real-film catalog, quiz questions, recommendation helpers and seed metadata.
- `src/styles.css`: warm editorial theme with responsive layouts, deliberate surfaces and reduced-motion rules.
- `public/manus-routes.json`: route manifest for the SPA entry points.

## Design direction
- **Design movement:** Contemporary editorial cinema journal.
- **Core principles:** poster-led discovery, open layouts over card stacks, evidence-backed recommendations, and quick useful actions.
- **Color philosophy:** obsidian and warm ivory create a quiet screening-room feel; bronze is reserved for meaningful actions and personal taste signals.
- **Layout paradigm:** a persistent rail and asymmetric editorial columns rather than centered SaaS panels.
- **Signature elements:** bronze ticket-stub mark, numbered mono metadata, and the horizontal `InfiniteMenu` discovery strip.
- **Interaction philosophy:** every control changes the diary, opens a real detail view, or explains its effect. Empty states point to a specific next action.
- **Animation:** BlurText is limited to the hero phrase; CountUp is used for genuine watched/quiz values; all animation respects reduced motion.
- **Typography:** serif display headlines, system sans for UI, monospace for metadata and scores.
- **Brand essence:** a sharp personal cinema diary for people who want to remember what they watched and find what deserves the next two hours. Playful, discerning, warm.
- **Brand voice:** concise and cinema-literate. Example lines: “Your taste has a pattern.” “Pick something worth watching.”
- **Wordmark:** CINEMO with an offset ticket-stub square as the O counterform.
- **Signature brand color:** muted bronze `#B7791F`.

## Functional scope
- Landing/discovery view with search, curated film strip, real detail modal, watchlist and watched actions.
- Local sign-up/sign-in/sign-out with validation and session persistence.
- Library tabs for watched, watchlist and favourites; editable half-star ratings and notes.
- Explainable recommendations from genres and highly-rated watched films, with cold-start copy.
- Defensible quiz scoring: percentage correct across 5 questions, with answer explanations and result history.
- Settings for theme, recommendation preference and destructive local-library clearing.
- Loading/empty/error states, responsive navigation and keyboard-accessible controls.

## Honest limitation
This repository has no auth/database provider or supplied React Bits source. Auth and persistence are implemented locally for a functional prototype; the component names and behaviors are implemented in-project rather than imported from unavailable source. The data layer is intentionally modular so a provider API and server auth can replace local storage later.
