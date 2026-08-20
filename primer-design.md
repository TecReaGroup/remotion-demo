# Primer — Design Style Reference

> **Unofficial, community-authored reference.** Compiled by [designsystems.one](https://www.designsystems.one). Not affiliated with, endorsed by, or sponsored by GitHub. "Primer" and related marks belong to their respective owners. This document describes publicly observable style attributes in original words — it contains no copied documentation, logos, icon artwork, or original token files. Always defer to the official source for canonical, current values.

**System:** Primer
**Owner:** GitHub
**Official documentation:** https://primer.style/
**Visual character:** GitHub's developer-native restraint: system fonts, mono accents, functional grays, and color that only speaks when state changes.

---

## Summary

GitHub's open design system — pragmatic, code-first, content-savvy.

_Confidence: high. Values are drawn from well-documented public token references._

## Color tokens

| Color | Value | CSS variable | Role |
| --- | --- | --- | --- |
| Canvas Default | `#ffffff` | `--bgColor-default` | Default page background |
| Canvas Subtle | `#f6f8fa` | `--bgColor-muted` | Subtle surface (headers, code blocks) |
| Foreground Default | `#1f2328` | `--fgColor-default` | Primary text |
| Foreground Muted | `#59636e` | `--fgColor-muted` | Secondary text |
| Accent | `#0969da` | `--fgColor-accent` | Links and primary interactive color |
| Success | `#1a7f37` | `--fgColor-success` | Success (open PRs, checks) |
| Danger | `#cf222e` | `--fgColor-danger` | Errors and destructive actions |
| Attention | `#9a6700` | `--fgColor-attention` | Warnings and pending states |
| Border Default | `#d0d7de` | `--borderColor-default` | Component borders |

## Typography

- **Body:** System stack — weights 400, 500, 600 — `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`
- **Mono:** Monaspace / SFMono — weights 400 — `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace`

## Type scale

| Step | Size | Line height |
| --- | --- | --- |
| title-large | `32px` | `48px` |
| title-medium | `20px` | `32px` |
| subtitle | `20px` | `32px` |
| body-large | `16px` | `24px` |
| body-medium | `14px` | `20px` |
| caption | `12px` | `16px` |

## Spacing

Base unit: `4px`

Scale: `4px` · `8px` · `16px` · `24px` · `32px` · `40px` · `48px`

## Corner radius

| Name | Value |
| --- | --- |
| small | `3px` |
| medium | `6px` |
| large | `12px` |
| full | `9999px` |

## Elevation / shadows

| Name | Value |
| --- | --- |
| shadow-resting | `0 1px 0 rgba(31,35,40,0.04)` |
| shadow-floating | `0 8px 24px rgba(140,149,159,0.2)` |

## Motion

| Name | Value |
| --- | --- |
| duration-fast | `80ms` |
| duration-normal | `200ms` |

## Quick start (CSS)

```css
/* Primer — illustrative tokens, restated as CSS custom properties.
   Unofficial reference by designsystems.one; values are indicative, not
   canonical. Official reference: https://primer.style/ */

:root {
  /* Color */
  --bgColor-default: #ffffff; /* Default page background */
  --bgColor-muted: #f6f8fa; /* Subtle surface (headers, code blocks) */
  --fgColor-default: #1f2328; /* Primary text */
  --fgColor-muted: #59636e; /* Secondary text */
  --fgColor-accent: #0969da; /* Links and primary interactive color */
  --fgColor-success: #1a7f37; /* Success (open PRs, checks) */
  --fgColor-danger: #cf222e; /* Errors and destructive actions */
  --fgColor-attention: #9a6700; /* Warnings and pending states */
  --borderColor-default: #d0d7de; /* Component borders */

  /* Typography */
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;

  /* Type scale */
  --text-title-large: 32px /* line-height 48px */;
  --text-title-medium: 20px /* line-height 32px */;
  --text-subtitle: 20px /* line-height 32px */;
  --text-body-large: 16px /* line-height 24px */;
  --text-body-medium: 14px /* line-height 20px */;
  --text-caption: 12px /* line-height 16px */;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 40px;
  --space-7: 48px;

  /* Radius */
  --radius-small: 3px;
  --radius-medium: 6px;
  --radius-large: 12px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-shadow-resting: 0 1px 0 rgba(31,35,40,0.04);
  --shadow-shadow-floating: 0 8px 24px rgba(140,149,159,0.2);

  /* Motion */
  --motion-duration-fast: 80ms;
  --motion-duration-normal: 200ms;
}
```

## Origin

Primer started as GitHub's internal CSS framework in the mid-2010s and grew into a multi-platform design system covering React, Rails ViewComponents, Figma, and a CSS toolkit. It evolves alongside GitHub itself.

## Governance

GitHub design and engineering teams own the system; public on GitHub with active issue triage. Components ship with strong test coverage and a clear deprecation policy.

## Known for

- Mature accessibility tooling (axe-core integrated, focus management primitives, ARIA patterns).
- Code-first: Primer's design tokens come straight from JSON and are consumed identically by Figma, CSS, and code.
- Excellent content guidelines — Primer's voice is technical, direct, and reusable.

## Underrated

- The ViewComponents library (Rails) is one of the few public examples of a design system that ships first-class server-rendered components.
- Primer's documentation site itself is built with Primer — a useful study object.

## Watch out for

- The visual language is opinionated toward developer tools and code-heavy UIs; not the right fit for consumer marketing.
- Some components evolved organically — adoption requires understanding which patterns are canonical and which are legacy.

## Components worth studying

- **ActionList / ActionMenu** — Composable menu pattern with keyboard navigation and ARIA correctness.
- **Banner** — Status messages with severity, dismissal, and primary-action support.
- **DataTable** — Recently introduced; aligns Primer with patterns Polaris and Carbon already had.

## When to choose Primer

Pick Primer if you're building a developer-facing product or any code-adjacent tool. Pair it with Primer's content guidelines — they are arguably more valuable than the components.

## Apply this style with an AI tool

Paste this into your AI coding assistant as a direction, then iterate:

> Design in the spirit of Primer by GitHub — GitHub's open design system — pragmatic, code-first, content-savvy. Character: GitHub's developer-native restraint: system fonts, mono accents, functional grays, and color that only speaks when state changes. Use a primary colour near #1f2328, the typeface "System stack" (or a close equivalent), corner radius around 3px, a spacing rhythm on a 4px base. Lean into what it's known for: Mature accessibility tooling (axe-core integrated, focus management primitives, ARIA patterns). Match the intent, not the pixels; adapt it to my product rather than cloning it.

## Official references

- [Primer docs](https://primer.style/)
- [Primer React](https://github.com/primer/react)
- [Primer ViewComponents](https://github.com/primer/view_components)

---

_Generated by [designsystems.one](https://www.designsystems.one/design-systems/primer) — a catalogue of public design systems. Style facts are reported for reference and education; adapt them to your own product. Report issues or takedown requests via the site._
