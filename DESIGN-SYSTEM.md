# Cinemo design system

## Tokens

The dark room uses `#12110F` for the page, `#1B1916` for elevated surfaces, `#F5F0E7` for warm ivory text, `#9C968C` for muted text, `#34302A` for dividers, and `#C18735` for bronze actions. The light room uses `#F7F3EB`, `#FFFCF6`, `#211F1B`, and the same semantic bronze family. Errors use muted red rather than neon red.

## Type and layout

Playfair Display is reserved for expressive editorial headlines. DM Sans handles product UI. DM Mono handles labels, scores, dates, and progress. The spacing scale is based on 4px increments, with 18px mobile gutters and 56px desktop content gutters. Posters keep a 2:3 ratio. The application uses dividers and open sections; cards are reserved for actual film objects or result objects.

## Surfaces and controls

Corners are square or subtly rounded only where interaction requires it. No glass panels or decorative gradients are used in the product body. Focus states use a visible bronze outline. Buttons have distinct primary, text, active, disabled, and danger states. Loading and failure states remain textual and actionable.

## Motion

The opening camera push is scroll-linked over one pinned section, with a cubic-bezier settle. InfiniteMenu uses short tile transitions and pauses while hovered. BlurText runs once on view. CountUp runs once when its genuine score enters view. Reduced motion removes scale, blur, and counting while preserving the final layout and value.

## Responsive rules

Desktop keeps the rail and wide poster compositions. Tablet reduces the rail and grid density. Mobile removes the rail, uses a compact header, turns the discovery reel into a touchable horizontal stage, and removes the precise camera push in favor of a stable poster-led entry.

## Completion states

Library statistics are rendered only from saved local entries. Empty shelves distinguish no saved data from no filter match. Provider-backed film metadata is visually separate from user status and notes. Rating controls expose ten half-star hit targets while preserving the editorial single-line treatment.
