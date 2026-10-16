# AeroNova design system

This document records the visual decisions and why they were made, so later
phases extend the system instead of drifting from it.

## Grounding

The product's subject is air navigation, so the visual vocabulary comes from
the real artefacts of that world rather than from generic "futuristic" UI:

| Source in aviation                                                                                                                                             | How it shows up                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **The magenta line.** Flight-management displays draw the active route in magenta.                                                                             | `--course` is reserved for routes, the selected itinerary and the signature course-line visual. It is never a button colour or decoration. |
| **Airport wayfinding type.** Humanist sans faces (the Frutiger lineage was drawn for Charles de Gaulle airport signage) are chosen for legibility at a glance. | Body and UI text use **Source Sans 3**, a humanist sans with true tabular figures.                                                         |
| **Livery and registration lettering.** Wide, confident capitals on fuselages.                                                                                  | Display type uses **Archivo** at an expanded width (`font-stretch: 118%`). Wide display type in sentence case, never tracked-out capitals. |
| **Taxiway signage and cockpit annunciators.** Amber for caution, cyan for selected values.                                                                     | `--warning` is taxiway amber; `--info` is instrument cyan.                                                                                 |
| **Night flight deck / terminal daylight.**                                                                                                                     | Dark theme is a blue night, not black. Light theme is cool concrete and white, not cream.                                                  |

## Palette

Both themes are designed, not inverted. All text tokens were measured: every
text/background pair is ≥ 4.5:1 (WCAG AA) on `bg`, `surface` and
`surface-muted`. `control-border` is ≥ 3:1 against adjacent surfaces for
form-field boundaries (WCAG 1.4.11); `border` is decorative and intentionally soft.

| Token                                     | Night (dark)               | Daylight (light)     | Role                       |
| ----------------------------------------- | -------------------------- | -------------------- | -------------------------- |
| `bg`                                      | `#0F1A2A`                  | `#F1F3F6`            | Page                       |
| `surface`                                 | `#162438`                  | `#FFFFFF`            | Panels, cards              |
| `surface-muted`                           | `#1D2E45`                  | `#E6EAF0`            | Inset areas, hover         |
| `fg`                                      | `#E8EEF6`                  | `#0E1A2B`            | Primary text               |
| `muted`                                   | `#9AA9BF`                  | `#4F5F77`            | Secondary text             |
| `border`                                  | `#2B3F5A`                  | `#CDD5E0`            | Dividers                   |
| `control-border`                          | `#6B82A3`                  | `#7A889C`            | Input boundaries           |
| `primary`                                 | `#8EC2FF`                  | `#1546A6`            | Actions, links, focus ring |
| `course`                                  | `#EC6AD2`                  | `#A8238C`            | Route line, selection only |
| `warning` / `success` / `danger` / `info` | amber / green / red / cyan | darkened equivalents | Status                     |

## Type

| Role                 | Face                                        | Notes                                                                               |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| display, headline    | Archivo, 118% width, 560–640 weight         | Sentence case. `text-wrap: balance`.                                                |
| title, body, caption | Source Sans 3                               | Body is 17px because Source Sans has a small x-height. Line length capped at ~70ch. |
| numeric              | Source Sans 3 / Archivo with `tabular-nums` | Times, prices and durations align in columns.                                       |
| mono                 | system `ui-monospace` stack (no download)   | Booking references and codes only. Never for general labels.                        |

Bangla and Arabic will need script-specific faces (Noto Sans Bengali / Noto
Sans Arabic) loaded per locale when those translations ship.

## Shape, depth, motion

- **Radius has hierarchy, not one value:** controls 6px, panels 10px, sheets 16px, pills only for chips.
- **Depth:** borders separate surfaces in place; shadows are reserved for layers that float (menus, sheets, dialogs).
- **Motion:** one orchestrated moment per page at most (the course line draws on the landing page). Everything else is motion in response to an action. `prefers-reduced-motion` removes non-essential motion globally.
- **Durations:** 120ms (feedback), 200ms (state change), 320ms (spatial change).

## Layout

Left-aligned content on a 12-column grid with a 1320px content max. Numbers
and times right-align in tables. The landing hero pairs a left-aligned
headline with the course-line visual; the search console (Phase 2) spans the
full content width beneath it, sitting on the horizon.

```
┌──────────────────────────────────────────────────────────────┐
│ ◇ AeroNova                                     [theme]       │
├──────────────────────────────────────────────────────────────┤
│ Find your next                         ·  ·  ◇- - - -        │
│ horizon.                          ·  ◇- - -        (course)  │
│ Compare fares by what they cost you…  ─────────── horizon ── │
│ ┌──────────────── search console (Phase 2) ────────────────┐ │
└─┴──────────────────────────────────────────────────────────┴─┘
```

## Deliberately avoided

- Near-black backgrounds with a single neon accent: the night theme is a
  distinct blue, and the one saturated colour (`course`) carries meaning.
- Tracked-out uppercase eyebrow labels, mid-dot meta strings, arrows appended
  to button text, monospace for small labels.
- Uniform rounded cards with identical soft shadows.
- Glassmorphism and decorative gradients.
