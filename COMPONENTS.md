# Cinemo components

`CinematicEntry` owns the short opening transition. It uses a muted video, poster fallback, reduced-motion detection, a requestAnimationFrame-throttled scroll listener, a progress line, and a keyboard-accessible bridge button. It cleans up listeners and frames on unmount.

`BlurText` is the supplied editorial headline treatment. It keeps a screen-reader-only text node, observes viewport entry, supports reduced motion, and renders word pieces with Motion for React.

`InfiniteMenu` is the discovery reel. Its film items are real catalog entries. It supports focus, buttons, pointer dragging, previous/next controls, dots, lazy images, and a poster error treatment. It is supplemental to the conventional search and catalogue interface.

`CountUp` is reserved for the quiz percentage. It observes visibility, animates once, exposes the final value via `aria-label`, and immediately renders the final value when reduced motion is preferred.

`FilmModal`, `Library`, `Discover`, `Quiz`, and `SettingsPage` remain product components rather than animation demos. Their empty, error, and action states are part of their contracts.
