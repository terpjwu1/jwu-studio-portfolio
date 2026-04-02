# Project Memory

Last Updated: 2026-03-31

## Current Product Direction
- The site opens with the live Pretext parametric field as the landing experience.
- The stills section is removed to avoid redundancy.
- The work archive is a horizontal carousel, not a flat gallery grid.

## Approved Archive Behavior
- Visible numbering is sequential and gap-free (`01..N`) based on display order.
- Archive cards have breathing room and are not tightly packed.
- Viewer clarity is prioritized over aggressive cropping.

## Media Framing Rule
- Each work should be fully visible inside the frame.
- Clips use `object-fit: contain` in a `16:9` media window.
- Do not crop artwork by default unless explicitly requested for a specific piece.

## Source of Truth
- Piece media lives under `public/media/pieces/*`.
- Site composition and interaction live in `src/App.tsx` and `src/App.css`.
