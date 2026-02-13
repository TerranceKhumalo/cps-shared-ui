const isSameDomain = (styleSheet: any, _window: Window): boolean => {
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(_window.location.origin) === 0;
};

const isStyleRule = (rule: any): boolean => rule.type === 1;

const SEMANTIC_COLOR_ALIASES: Record<string, string> = {
  'accent-primary': '--cps-accent-primary',
  'accent-secondary': '--cps-accent-secondary',
  'text-primary': '--cps-text-primary',
  'text-secondary': '--cps-text-secondary',
  'text-muted': '--cps-text-muted',
  'text-disabled': '--cps-text-disabled',
  'text-on-accent': '--cps-text-on-accent',
  'surface-body': '--cps-surface-body',
  'surface-highlight': '--cps-surface-highlight',
  'surface-muted': '--cps-surface-muted',
  'surface-elevated': '--cps-surface-elevated',
  'surface-control': '--cps-surface-control',
  'border-color': '--cps-border-color',
  'border-strong': '--cps-border-strong',
  'border-focus': '--cps-border-focus',
  'highlight-hover': '--cps-highlight-hover',
  'highlight-active': '--cps-highlight-active',
  'highlight-selected': '--cps-highlight-selected',
  'state-info': '--cps-state-info',
  'state-success': '--cps-state-success',
  'state-warn': '--cps-state-warn',
  'state-error': '--cps-state-error',
  'ring-color': '--cps-ring-color',
  'background-color': '--cps-background-color',
  'background-disabled': '--cps-background-disabled',
  white: '--cps-text-on-accent',
  black: '--cps-text-primary'
};

const LEGACY_COLOR_ALIASES: Record<string, string> = {
  calm: '--cps-color-calm',
  luxury: '--cps-color-luxury',
  energy: '--cps-color-energy',
  warmth: '--cps-color-warmth',
  passion: '--cps-color-passion',
  surprise: '--cps-color-surprise',
  prepared: '--cps-color-prepared',
  agile: '--cps-color-agile',
  care: '--cps-color-care',
  smile: '--cps-color-smile',
  human: '--cps-color-human',
  grounded: '--cps-color-grounded',
  depth: '--cps-color-depth',
  info: '--cps-color-info',
  success: '--cps-color-success',
  warn: '--cps-color-warn',
  error: '--cps-color-error',
  'text-light': '--cps-color-text-light',
  'text-mild': '--cps-color-text-mild',
  'text-dark': '--cps-color-text-dark',
  'text-darkest': '--cps-color-text-darkest',
  'line-mid': '--cps-color-line-mid',
  'line-dark': '--cps-color-line-dark'
};

const normalizeTokenName = (value: string): string => value.trim().toLowerCase();

const getColorTokenVar = (value: string): string => {
  const normalized = normalizeTokenName(value);

  if (normalized.startsWith('--cps-')) {
    return `var(${normalized})`;
  }

  if (normalized.startsWith('cps-')) {
    return `var(--${normalized})`;
  }

  const semanticAlias = SEMANTIC_COLOR_ALIASES[normalized];
  if (semanticAlias) {
    return `var(${semanticAlias})`;
  }

  const legacyAlias = LEGACY_COLOR_ALIASES[normalized];
  if (legacyAlias) {
    return `var(${legacyAlias})`;
  }

  if (normalized.includes('-')) {
    return `var(--cps-${normalized})`;
  }

  return `var(--cps-color-${normalized})`;
};

const isValidCSSColor = (val: string, _document: Document): boolean => {
  if (val === 'currentColor') return true;
  const element = _document.createElement('div');
  element.style.backgroundColor = val;
  return element && element.style.backgroundColor !== '';
};

const isDark = (color: string): boolean => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (color.match(/^rgb/)) {
    const colorMatched = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    ) as any;
    r = colorMatched[1];
    g = colorMatched[2];
    b = colorMatched[3];
  } else {
    const colorNum = +(
      '0x' + color.slice(1).replace(color.length < 5 && (/./g as any), '$&$&')
    );

    r = colorNum >> 16;
    g = (colorNum >> 8) & 255;
    b = colorNum & 255;
  }

  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp <= 127.5;
};

export const getCpsColors = (_document: Document): [string, string][] =>
  [...(_document.styleSheets as any)]
    .filter((sheet: any) =>
      isSameDomain(sheet, _document.defaultView as Window)
    )
    .reduce(
      (finalArr, sheet) =>
        finalArr.concat(
          [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
            const props = [...rule.style]
              .map((propName) => [
                propName.trim(),
                rule.style.getPropertyValue(propName).trim()
              ])
              .filter(([propName]) => propName.indexOf('--cps-color') === 0);

            return [...propValArr, ...props];
          }, [])
        ),
      []
    );

export const getCSSColor = (val: string, _document: Document): string => {
  if (!val) return '';
  const normalized = val.trim();

  if (normalized.startsWith('var(')) {
    return normalized;
  }

  return isValidCSSColor(normalized, _document)
    ? normalized
    : getColorTokenVar(normalized);
};

export const getTextColor = (backgroundColor: string): string => {
  if (isDark(backgroundColor)) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
};
