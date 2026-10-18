# Cinemo delivery TODO

- [x] Replace Trace branding with Cinemo identity, product copy, editorial dark/light themes, responsive navigation and functional footer.
- [x] Build the first-use journey so a visitor can search or browse real films, open details, save a film, mark it watched, and skip setup.
- [x] Implement sign-up, sign-in, sign-out, validation, session persistence and protected diary actions using local persistence without exposing secrets.
- [x] Implement movie search by title, empty results, clear loading feedback, accurate title/year associations, duplicate prevention and keyboard-friendly controls.
- [x] Implement film details with poster, synopsis, runtime, genres, director, cast, source label, personal rating/review, watched/watchlist/favourite actions and related recommendations.
- [x] Implement library views for watched, watchlist and favourites, sorting, editing half-star ratings and notes, status changes, removal and empty states.
- [x] Implement explainable cold-start and taste-based recommendations, dismiss/save controls, and exclusion of watched/dismissed items.
- [x] Implement the dedicated cinema knowledge quiz with question selection, answer submission, explanations, percentage scoring and result history.
- [x] Implement meaningful personal stats only from local user data and settings for theme, recommendation preference and library reset.
- [x] Integrate restrained in-project InfiniteMenu, BlurText and CountUp behaviors with reduced-motion and accessible fallbacks.
- [x] Maintain route manifest and responsive behavior for desktop and mobile.
- [ ] Replace local persistence with a real auth/database provider when credentials and backend are supplied.

## Anti-AI design audit

- [x] No decorative gradient blobs, purple palette, glassmorphism, fake testimonials, fabricated statistics, or generic SaaS feature-card wall.
- [x] Posters are content-bearing, tied to real catalog entries, and include alt text/fallback behavior.
- [x] Recommendations explain their evidence and cold-start state instead of pretending to understand a new user.
- [x] Quiz score is percentage correct from answered questions, not an arbitrary gamification number.
- [x] Cards are reserved for films and quiz results; navigation and content use open editorial sections and dividers.
- [x] Mobile layouts, reduced motion, keyboard focus, loading, empty, error and recovery states are implemented.
