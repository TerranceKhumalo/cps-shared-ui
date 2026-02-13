# CPS UI Kit — Mode-First Theme Roadmap

This document tracks the migration plan to make **light/dark mode** consistent first, and add **theme packs** later (green/amber/neutral/luxury/etc.) without rework.

## 1) Working model (important)

- **Mode** = light vs dark (contrast, surfaces, readability).
- **Theme** = hue personality (brand family).
- Components should consume **semantic tokens** only (e.g. `--cps-text-primary`, `--cps-accent-primary`, `--cps-border-color`).
- Avoid component-specific light/dark hacks unless there is a known accessibility exception.

## 2) Current state summary

### Good baseline already present

- Semantic token layer exists in:
  - `styles/_colors.scss`
  - `styles/_colors-dark.scss`
- Global primitives already reference semantic variables in:
  - `styles/styles.scss`

### Gaps that block clean mode behavior

1. **Legacy token usage in components** (`--cps-color-*`) still present in multiple files.
2. **Hardcoded colors** (e.g. `#fff`, `rgba(...)`) still present in a few component/service styles.
3. **Color utility fallback is legacy-only** in `src/lib/utils/colors-utils.ts`:
   - `getCSSColor()` resolves unknown values to `var(--cps-color-${val})`.
   - This makes semantic names like `text-primary`, `accent-primary`, etc. fragile unless passed as full CSS values.

## 3) Phase 1 — Mode hardening (now)

Goal: all components should render correctly in both light/dark using semantic tokens only.

### P1.1 Token/utility foundation

- [x] Update `getCSSColor()` to support semantic aliases first (e.g. `text-primary` -> `var(--cps-text-primary)`) and keep legacy compatibility.
- [x] Add/confirm a token naming policy in this file for dynamic color inputs:
  - semantic names (preferred)
  - legacy names (temporary compatibility)
  - full CSS values (`#hex`, `rgb`, `var(...)`, `currentColor`)
- [x] Verify components using `getCSSColor()` still behave after alias support:
  - button, icon, progress, tag, expansion panel, divider, paginator, tab-group, loader, checkbox.

### P1.2 Replace remaining legacy tokens in component SCSS/TS

Track each item as complete once semantic equivalent is used.

- [x] `src/lib/components/cps-button/cps-button.component.scss`
- [x] `src/lib/components/cps-tree-table/cps-tree-table.component.scss`
- [x] `src/lib/components/cps-tree-table/cps-tree-table.component.ts`
- [x] `src/lib/components/cps-menu/cps-menu.component.scss`
- [x] `src/lib/components/cps-select/cps-select.component.scss`
- [x] `src/lib/components/cps-tree-select/cps-tree-select.component.scss`
- [x] `src/lib/components/cps-radio-group/cps-radio-group.component.scss`
- [x] `src/lib/components/cps-file-upload/cps-file-upload.component.scss`
- [x] `src/lib/components/cps-timepicker/cps-timepicker.component.scss`
- [x] `src/lib/components/cps-autocomplete/cps-autocomplete.component.scss`
- [x] `src/lib/components/cps-tree-autocomplete/cps-tree-autocomplete.component.scss`
- [x] `src/lib/components/cps-input/cps-input.component.scss`
- [x] `src/lib/components/cps-textarea/cps-textarea.component.scss`
- [x] `src/lib/components/cps-loader/cps-loader.component.scss`
- [x] `src/lib/components/cps-tab-group/cps-tab-group.component.scss`
- [x] `src/lib/components/cps-scheduler/cps-scheduler.component.scss`
- [x] `src/lib/components/cps-table/components/internal/table-column-filter/table-column-filter.component.ts`
- [x] `src/lib/services/cps-notification/internal/components/cps-toast/cps-toast.component.scss`

### P1.3 Remove hardcoded color values from component styles

- [x] `src/lib/components/cps-tree-table/cps-tree-table.component.scss` (`#ffffff`)
- [x] `src/lib/components/cps-menu/cps-menu.component.scss` (`#0000001f`)
- [x] `src/lib/services/cps-dialog/internal/components/cps-dialog/cps-dialog.component.scss` (`rgba(...)`/shadow literal)
- [x] `src/lib/services/cps-notification/internal/components/cps-notification-container/cps-notification-container.component.scss` (`rgba(...)`)
- [x] `src/lib/services/cps-notification/internal/components/cps-toast/cps-toast.component.scss` (shadow literal)

### P1.4 Consistency and accessibility pass

- [x] Verify state contrast for text/background/border in both modes (normal, hover, active, disabled).
- [x] Verify overlay components (menu, datepicker, dialog, notification) share semantic surface/elevation behavior.
- [x] Verify table + tree-table selected/hover/striping parity in both modes.
- [x] Ensure buttons/chips/tags use consistent readable on-color strategy in dark mode.

### P1.5 Validation gates

- [x] Build passes: `npm run build cps-ui-kit`
- [ ] Story/sandbox visual checks in light + dark for all touched components
- [ ] AXE checks for contrast/focus-visible in changed areas

#### P1.5 Execution log (latest)

- Build (`npm run build cps-ui-kit`): ✅ Pass
- Visual checks (light/dark): ⏳ Pending manual review in composition app pages
- AXE/pa11y (`pa11y-ci`, WCAG2AA across 33 component URLs): ❌ Failing baseline
  - Total URLs tested: `33`
  - Passed: `0/33`
  - Total errors found: `332`
  - Highest-error components: `icon (91)`, `autocomplete (26)`, `timepicker (25)`, `scheduler (19)`, `tree-autocomplete (19)`, `tab-group (18)`, `button (17)`, `tree-table (13)`, `table (11)`, `switch (10)`
  - Notes: AXE run was executed in-container after installing required headless Chromium runtime libraries.

- Focused AXE remediation batch (`icon` + `autocomplete`): ✅ Significant reduction, still open
  - Before: `115` total (`icon: 90`, `autocomplete: 25`)
  - Latest: `0` AXE rule violations (`icon: timeout only`, `autocomplete: 0`)
  - Remaining issues:
    - `icon`: navigation timeout (non-rule failure)
    - `autocomplete`: ✅ no remaining focused AXE rule violations

## 4) Phase 2 — Theme packs (later)

Goal: introduce hue families without changing component logic.

### P2.1 Theme architecture

- [ ] Add a theme switch mechanism independent of mode (e.g. `data-theme="green"` + mode attribute).
- [ ] Define token layering strategy:
  - base semantic roles
  - mode overrides (light/dark)
  - theme hue overrides (green/amber/neutral/luxury)
- [ ] Avoid duplicate component CSS per theme.

### P2.2 Theme token packs

- [ ] Create first 2 packs (suggest: `neutral`, `luxury`) to validate model.
- [ ] Include role tokens at minimum:
  - accent primary/secondary + on-accent
  - highlights
  - focus ring
  - state colors (info/success/warn/error)

### P2.3 Theme QA

- [ ] Confirm all components work with no component-level theme conditionals.
- [ ] Verify contrast in both modes for each theme pack.

## 5) Definition of done

Mode-first work is done when:

- No component depends on hardcoded color literals for UI states.
- Legacy `--cps-color-*` usage is removed from component implementation files (or documented as intentional temporary compatibility).
- Dynamic color props resolve semantic names reliably.
- Light/dark differences are token-driven, not component-override driven.

## 6) Parking lot (capture “don’t forget” items)

Use this section continuously as we discover issues.

- [ ] Confirm whether to preserve old public color names in API docs for backward compatibility.
- [ ] Decide timeline for deprecating legacy color names in inputs.
- [ ] Add a migration guide mapping old token names -> semantic token names.
- [ ] Add visual regression snapshots for mode switch on key components.

## 7) Change log for this plan

- 2026-02-12: Initial mode-first roadmap created.
- 2026-02-12: Completed first mode-first batch (utility semantic color resolution + button/menu/tree-table token cleanup).
- 2026-02-12: Completed error-token cluster (select, autocomplete, tree-autocomplete, tree-select, radio-group, timepicker, input, textarea).
- 2026-02-12: Completed remaining P1.2/P1.3 cleanup batch (file-upload, loader, tab-group, scheduler, tree-table.ts, table-column-filter.ts, toast/dialog/notification overlay literals).
- 2026-02-12: Improved button dark-mode readability while preserving accent identity for outlined/borderless variants; marked buttons/chips/tags readability item complete.
- 2026-02-12: Completed code-level P1.4 verification for state/overlay/table parity and confirmed getCSSColor consumer compatibility after semantic alias support.
- 2026-02-12: Started P1.5 execution tracking with real run evidence; AXE baseline currently failing (332 issues across 33 routes).
- 2026-02-12: Focused re-check confirms autocomplete route has zero AXE rule violations; icon route still reports a non-rule navigation timeout.
