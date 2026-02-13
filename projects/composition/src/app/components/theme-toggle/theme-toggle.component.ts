import { Component, inject } from '@angular/core';
import {
  CpsBaseTheme,
  CpsColorTheme,
  CpsIconComponent,
  CpsRadiusTheme,
  CpsThemeService
} from 'cps-ui-kit';

@Component({
  selector: 'app-theme-toggle',
  imports: [CpsIconComponent],
  template: `
    <div class="theme-controls">
      <label class="theme-label" for="color-theme-select">Theme</label>
      <select
        id="color-theme-select"
        class="theme-select"
        [value]="colorTheme()"
        (change)="onColorThemeChange($event)">
        <option value="neutral">Neutral</option>
        <option value="calm">Calm</option>
        <option value="energy">Energy</option>
        <option value="passion">Passion</option>
      </select>

      <label class="theme-label" for="radius-theme-select">Radius</label>
      <select
        id="radius-theme-select"
        class="theme-select"
        [value]="radiusTheme()"
        (change)="onRadiusThemeChange($event)">
        <option value="default">Default</option>
        <option value="compact">Compact</option>
        <option value="rounded">Rounded</option>
        <option value="pill">Pill</option>
      </select>

      <label class="theme-label" for="base-theme-select">Base</label>
      <select
        id="base-theme-select"
        class="theme-select"
        [value]="baseTheme()"
        (change)="onBaseThemeChange($event)">
        <option value="default">Default</option>
        <option value="graphite">Graphite</option>
        <option value="midnight">Midnight</option>
        <option value="aubergine">Aubergine</option>
      </select>

      <button
        class="theme-toggle-btn"
        (click)="toggleTheme()"
        [attr.aria-label]="
          isDark() ? 'Switch to light mode' : 'Switch to dark mode'
        "
        type="button">
        <cps-icon [icon]="isDark() ? 'sun' : 'moon'" [size]="20"> </cps-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .theme-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .theme-label {
        color: var(--cps-text-secondary);
        font-size: 14px;
        font-family: 'Source Sans Pro', sans-serif;
      }

      .theme-select {
        padding: 8px 10px;
        background: var(--cps-input-background);
        color: var(--cps-input-foreground);
        border: 1px solid var(--cps-border-color);
        border-radius: var(--cps-border-radius-small);
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 14px;

        &:focus-visible {
          outline: 2px solid var(--cps-ring-color);
          outline-offset: 2px;
        }
      }

      .theme-toggle-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: transparent;
        border: 1px solid var(--cps-border-color);
        border-radius: var(--cps-border-radius-small);
        color: var(--cps-text-secondary);
        cursor: pointer;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          background: var(--cps-highlight-hover);
          border-color: var(--cps-border-focus);
        }

        &:active {
          background: var(--cps-highlight-active);
        }

        &:focus-visible {
          outline: 2px solid var(--cps-ring-color);
          outline-offset: 2px;
        }
      }
    `
  ]
})
export class ThemeToggleComponent {
  private themeService = inject(CpsThemeService);

  isDark = this.themeService.isDark;
  colorTheme = this.themeService.colorTheme;
  radiusTheme = this.themeService.radiusTheme;
  baseTheme = this.themeService.baseTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onColorThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value as CpsColorTheme | undefined;

    if (!value) return;

    this.themeService.setColorTheme(value);
  }

  onRadiusThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value as CpsRadiusTheme | undefined;

    if (!value) return;

    this.themeService.setRadiusTheme(value);
  }

  onBaseThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value as CpsBaseTheme | undefined;

    if (!value) return;

    this.themeService.setBaseTheme(value);
  }
}
