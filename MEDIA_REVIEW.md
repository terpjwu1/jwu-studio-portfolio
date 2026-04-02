# Media Review

This folder now has two media layers:

1. `chapters/`
   These are the curated assets currently used by the live site.
2. `pieces/`
   These are the finer cuts from the source film, split by major background-color changes so they can be reviewed and approved one by one.

## Source

- Original source video:
  [`/Users/jwu/Documents/FioraStudioLab/portfolio/media-source/animation-kinetic-typography-and-shape-exploration.mp4`](/Users/jwu/Documents/FioraStudioLab/portfolio/media-source/animation-kinetic-typography-and-shape-exploration.mp4)

## Structure

```text
portfolio/
├── media-source/
│   └── animation-kinetic-typography-and-shape-exploration.mp4
└── public/
    └── media/
        ├── chapters/
        │   ├── 01-letterform-mutation/
        │   ├── 02-language-fields/
        │   ├── 03-ink-bloom-forms/
        │   ├── 04-balance-systems/
        │   ├── 05-halftone-memory/
        │   └── 06-eye-orbit/
        ├── pieces/
        │   ├── 01-black-letter-a/
        │   ├── 02-gray-type-morph/
        │   ├── 04-black-zero-rhythm/
        │   ├── 05-black-yellow-drum/
        │   ├── 06-white-language-fields/
        │   ├── 07-cyan-swimming/
        │   ├── 08-yellow-monday-field/
        │   ├── 09-black-matrix-rain/
        │   ├── 10-white-ink-bloom/
        │   ├── 11-white-work-life-balance/
        │   ├── 12-black-wave-lattice/
        │   ├── 13-white-balance-diagrams/
        │   ├── 14-mona-lisa-portrait-in-space/
        │   ├── 15-the-moving-false-mirror-rene-magritte-1929/
        │   └── _merged-into-02/
        └── stills/
            ├── 01-zero-rhythm.jpg
            ├── 02-matrix-veil.jpg
            └── 03-wave-lattice.jpg
```

## Chapter Assets In Use

These are the folders wired into the live React app:

1. `01-letterform-mutation`
   folder: `/public/media/chapters/01-letterform-mutation/`
2. `02-language-fields`
   folder: `/public/media/chapters/02-language-fields/`
   note: poster and clip were regenerated from the cleaner white-language-fields section.
3. `03-ink-bloom-forms`
   folder: `/public/media/chapters/03-ink-bloom-forms/`
4. `04-balance-systems`
   folder: `/public/media/chapters/04-balance-systems/`
5. `05-halftone-memory`
   folder: `/public/media/chapters/05-halftone-memory/`
   note: keeps both `clip-approved.mp4` and `clip-alt-original.mp4`
6. `06-eye-orbit`
   folder: `/public/media/chapters/06-eye-orbit/`
   note: keeps both `clip-approved.mp4` and `clip-alt-original.mp4`

## Fine Cuts By Background Shift

These are the finer review pieces exported from the source film. Most folders contain `clip.mp4` and `poster.jpg`. The `04-black-zero-rhythm` and `13-white-balance-diagrams` folders are now split into explicit review clips.

1. `01-black-letter-a`
   time: `0.0s - 2.4s`
   folder: `/public/media/pieces/01-black-letter-a/`
   read: black field, white letterform
2. `02-gray-type-morph`
   time: `3.4s - 12.1s`
   folder: `/public/media/pieces/02-gray-type-morph/`
   read: trimmed gray-to-black type work, with the former `03` segment merged in
3. `03-black-letter-b`
   status: merged into `02-gray-type-morph`
   archived folder: `/public/media/pieces/_merged-into-02/03-black-letter-b/`
4. `04-black-zero-rhythm`
   time: `12.1s - 23.0s`
   folder: `/public/media/pieces/04-black-zero-rhythm/`
   review clips:
   `clip-a-opening.mp4` = `12.1s - 15.1s`
   `clip-b-isolated-piece.mp4` = `15.1s - 18.1s`
   `clip-c-tail.mp4` = `18.1s - 23.0s`
   read: black field, repeating white zero forms split into approval-ready sub-pieces
5. `05-black-yellow-drum`
   time: `23.0s - 33.0s`
   folder: `/public/media/pieces/05-black-yellow-drum/`
   read: black field, vibrating yellow text
6. `06-white-language-fields`
   time: `33.0s - 37.2s`
   folder: `/public/media/pieces/06-white-language-fields/`
   read: white field, drifting text fragments
7. `07-cyan-swimming`
   time: `37.2s - 41.3s`
   folder: `/public/media/pieces/07-cyan-swimming/`
   read: cyan field, red `JUST KEEP SWIMMING`
8. `08-yellow-monday-field`
   time: `41.3s - 44.8s`
   folder: `/public/media/pieces/08-yellow-monday-field/`
   read: yellow field, repeated `MONDAY`
9. `09-black-matrix-rain`
   time: `44.8s - 60.5s`
   folder: `/public/media/pieces/09-black-matrix-rain/`
   read: black field, green code rain
10. `10-white-ink-bloom`
   time: `60.5s - 77.5s`
   folder: `/public/media/pieces/10-white-ink-bloom/`
   read: white field, black pressure forms
11. `11-white-work-life-balance`
   time: `77.5s - 95.0s`
   folder: `/public/media/pieces/11-white-work-life-balance/`
   read: white field, balance studies
12. `12-black-wave-lattice`
   time: `95.0s - 104.8s`
   folder: `/public/media/pieces/12-black-wave-lattice/`
   read: black field, white structural wave
13. `13-white-balance-diagrams`
   time: `104.8s - 118.0s`
   folder: `/public/media/pieces/13-white-balance-diagrams/`
   review clips:
   `clip-a-opening.mp4` = prior piece `00:01 - 00:04`
   `clip-b-lissajous-circle.mp4` = prior piece `00:05 - 00:13`
   read: white field, diagram studies with a separate `lissajous circle` subsection
14. `14-mona-lisa-portrait-in-space`
   time: source slice `119.0s - 145.0s`
   folder: `/public/media/pieces/14-mona-lisa-portrait-in-space/`
   playback: rendered at `4x` speed
   read: Mona Lisa portrait decay in space, using the `00:01 - 00:27` portion of the previous cut
15. `15-the-moving-false-mirror-rene-magritte-1929`
   time: `151.0s - 157.862s`
   folder: `/public/media/pieces/15-the-moving-false-mirror-rene-magritte-1929/`
   title: `The Moving False Mirror by Rene Magritte, 1929`
   read: trimmed eye and sky closing image using the final `00:06 - 00:13` portion of the previous cut

## Review Guidance

- If a piece still feels like it contains two backgrounds, that is the one to split next.
- `02-language-fields` in the live site now points to the white text-field material, not the black `talkin' drum` section.
- The `pieces/` folders are the best place to review the dissection before we decide which ones should surface on the homepage.
