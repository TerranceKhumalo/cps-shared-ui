# CPS UI Kit — Mode-First Theme Roadmap

This document is the working tracker for completing **mode-first theming** in `cps-ui-kit`.

Use this as the single source of truth:

- If work is complete, tick it.
- If blocked, mark it and add a short note.
- If scope changes, update this file in the same PR.

---

## 1) Working model (locked)

- **Mode** = light vs dark behavior (contrast, surfaces, readability).
- **Theme** = hue personality (brand family).
- Components consume semantic tokens only (example: `--cps-text-primary`, `--cps-accent-primary`, `--cps-border-color`).
- No component-specific mode hacks unless there is a documented accessibility exception.

---

## 2) Snapshot (2026-02-13)

### Completed

- [x] Semantic color token layer exists in `styles/_colors.scss` and `styles/_colors-dark.scss`.
- [x] Global primitives already use semantic variables in `styles/styles.scss`.
- [x] Core mode-hardening batches from P1.1–P1.4 completed.
- [x] Build gate passes (`npm run build cps-ui-kit`).

### Still missing (high confidence)

- [ ] Manual visual review of touched components in light + dark (composition app pages).
- [ ] AXE pass for changed areas is still open.
- [ ] Resolve `icon` route AXE navigation timeout and confirm stable pass.
- [ ] Finish cleanup of non-tokenized **radius** values so radius is fully centralized.
- [ ] Create migration artifacts (legacy token mapping + deprecation timeline).

---

## 3) Active tracker — Mode hardening (P1)

Goal: all components render correctly in light/dark using semantic tokens and shared design primitives.

### P1.1 Foundation

- [x] `getCSSColor()` supports semantic aliases first and keeps legacy compatibility.
- [x] Dynamic color input policy documented (semantic, legacy compat, raw CSS values).
- [x] Existing `getCSSColor()` consumers verified.

### P1.2 Legacy color token cleanup

- [x] Initial replacement batch complete across listed component SCSS/TS files.
- [ ] Repo-wide re-scan for any remaining `--cps-color-*` usage in component implementation files.
- [ ] For each remaining usage: replace with semantic token or document as temporary compat.

### P1.3 Hardcoded color literal cleanup

- [x] Initial hardcoded color cleanup batch complete.
- [ ] Repo-wide re-scan for `#`, `rgb`, `rgba` in component/service styles.
- [ ] Replace remaining literals with semantic/elevation tokens where applicable.

### P1.4 Radius standardization (new explicit track)

Status: **partially centralized**.

- [x] Shared radius tokens exist (`--cps-radius-*`) with backward-compatible aliases (`--cps-border-radius-*`).
- [ ] Replace hardcoded radius values in component styles with radius tokens where shape is not intentionally special.
- [ ] Keep intentional exceptions documented (e.g. full circles `50%`, forced square corners `0`).
- [ ] Ensure global primitives also consume tokens (e.g. scrollbar/tooltip radius).

### P1.5 Validation gates

- [x] Build passes: `npm run build cps-ui-kit`
- [ ] Visual checks pass in both modes for all touched areas.
- [ ] AXE checks pass for changed areas (contrast/focus-visible and critical flows).

#### P1.5 execution log

- Build (`npm run build cps-ui-kit`): ✅ pass
- Visual checks: ⏳ pending manual review
- AXE baseline (`pa11y-ci`, WCAG2AA, 33 URLs): ❌ previously failing baseline (`332` total issues)
- Focused re-check (`icon` + `autocomplete`): improved; `autocomplete` clear, `icon` still has navigation timeout (non-rule failure)

---

## 4) Theme packs (P2, after P1 gates are green)

Goal: add hue families without changing component logic.

### P2.1 Architecture

- [ ] Add theme switch mechanism independent of mode.
- [ ] Lock token layering model:
  - base semantic roles
  - mode overrides
  - hue/theme overrides
- [ ] Avoid duplicate component CSS per theme.

### P2.2 Token packs

- [ ] Add first 2 packs (suggested: `neutral`, `luxury`) to validate approach.
- [ ] Include minimum role token set:
  - accent primary/secondary + on-accent
  - highlights
  - focus ring
  - state tokens (info/success/warn/error)

### P2.3 QA

- [ ] Confirm components work with no component-level theme conditionals.
- [ ] Verify contrast in both modes for each pack.

---

## 5) Short-term execution queue (do next)

Tick these in order:

- [x] Run repo-wide grep pass for remaining legacy color tokens and literals; create a short hit list.
- [x] Complete radius token cleanup pass (component + global style stragglers).
- [ ] Run visual checks in composition app for all touched components (light + dark).
- [ ] Re-run AXE/pa11y and capture new totals in this file.
- [ ] Open follow-up task(s) for any remaining AXE timeout/non-rule failures.

### 5.1 Repo-wide hit list (2026-02-13 pass)

#### A) Legacy token touchpoints still present

- [ ] `src/lib/utils/colors-utils.ts`
  - `LEGACY_COLOR_ALIASES` still maps legacy names to `--cps-color-*`.
  - Fallback still returns `var(--cps-color-${normalized})`.
  - `getCpsColors()` still filters token names by `--cps-color` prefix.
- [x] `styles/_cps-tooltip-style.scss`
  - Legacy token references replaced with semantic tokens.
- [ ] `src/lib/components/cps-input/cps-input.component.scss`
  - Contains legacy token names in inline comments (non-runtime, cleanup optional).

#### B) Hardcoded color literals still present

- [x] Disabled prefix icon color `#9a9595` in templates:
  - `src/lib/components/cps-autocomplete/cps-autocomplete.component.html`
  - `src/lib/components/cps-select/cps-select.component.html`
  - `src/lib/components/cps-tree-select/cps-tree-select.component.html`
  - `src/lib/components/cps-tree-autocomplete/cps-tree-autocomplete.component.html`
  - `src/lib/components/cps-input/cps-input.component.html`
- [x] `src/lib/services/cps-notification/internal/components/cps-toast/cps-toast.component.html`
  - Filled icon color now uses semantic alias (`text-on-accent`).
- [x] `src/lib/components/cps-tree-table/cps-tree-table.component.ts`
  - Runtime style border color now uses semantic border token.
- [ ] `src/lib/components/cps-loader/cps-loader.component.ts`
  - Uses `rgba(0, 0, 0, x)` string for overlay background.
- [x] `styles/_cps-tooltip-style.scss`
  - Hardcoded background color replaced with semantic popover background token.

#### C) Radius values not tokenized yet

- [x] `src/lib/components/cps-chip/cps-chip.component.scss` (`border-radius: 14px`)
- [x] `src/lib/components/cps-table/cps-table.component.scss` (`border-radius: 2px`)
- [x] `src/lib/components/cps-tree-table/cps-tree-table.component.scss` (`border-radius: 2px`)
- [x] `src/lib/services/cps-dialog/internal/components/cps-dialog/cps-dialog.component.scss` (multiple `4px` radius declarations)
- [x] `src/lib/services/cps-notification/internal/components/cps-notification-container/cps-notification-container.component.scss` (`border-radius: 4px`)
- [x] `styles/_cps-tooltip-style.scss` (`border-radius: 3px`)
- [x] `styles/styles.scss` (`::-webkit-scrollbar-thumb { border-radius: 4px; }`)

#### D) Notes for cleanup execution

- [ ] Keep intentional shape exceptions documented (`50%`, `0`, `unset`) and out of cleanup scope unless design changes.
- [ ] Decide whether legacy alias support in `colors-utils.ts` remains temporary compatibility or starts deprecation in this branch.

---

## 6) Definition of done (mode-first)

Mode-first is complete when all are true:

- [ ] No component depends on hardcoded color literals for UI states.
- [ ] Legacy `--cps-color-*` usage is removed from implementation files (or explicitly documented as temporary compatibility).
- [ ] Dynamic color props resolve semantic names reliably.
- [ ] Light/dark differences are token-driven (not component-level overrides).
- [ ] Radius usage is token-driven except for documented intentional shape exceptions.
- [ ] Build + visual + AXE gates are green.

---

## 7) Parking lot / decisions to close

- [ ] Confirm if old public color names stay in API docs for backward compatibility.
- [ ] Decide deprecation timeline for legacy color input names.
- [ ] Add migration guide mapping legacy token names -> semantic token names.
- [ ] Add visual regression snapshots for key mode-switch components.

---

## 8) Change log

- 2026-02-12: Initial roadmap created.
- 2026-02-12: Completed major P1 token/literal cleanup batches and utility compatibility updates.
- 2026-02-12: Build gate confirmed pass; AXE baseline captured (failing baseline documented).
- 2026-02-12: Focused AXE remediation reduced `autocomplete`; `icon` timeout remained.
- 2026-02-13: Second-pass tracker refactor — added explicit snapshot, execution queue, and dedicated radius-standardization track.
- 2026-02-13: Added repo-wide grep hit list with concrete remaining files for legacy token usage, hardcoded color literals, and non-tokenized radius values.
- 2026-02-13: Completed first implementation pass from hit list (semantic token replacements for template literals, tree-table border tokenization, tooltip semantic cleanup, and radius tokenization including new `--cps-radius-xs`).
