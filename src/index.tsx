import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeId = 'bloom' | 'slate';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  hint: string;
  swatch: [string, string, string];
}

export const THEMES: ThemeOption[] = [
  { id: 'bloom', name: 'Bloom', hint: 'Warm light', swatch: ['#fdf9f0', '#f8d7c0', '#c5704a'] },
  { id: 'slate', name: 'Slate', hint: 'Cool neutral', swatch: ['#eef1f6', '#ffffff', '#3b6ea5'] }
];

export const DEFAULT_THEME: ThemeId = 'bloom';
export const DEFAULT_STORAGE_KEY = 'pior-theme';

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some((theme) => theme.id === value);
}

export function readStoredTheme(storageKey = DEFAULT_STORAGE_KEY): ThemeId {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (isThemeId(stored)) return stored;
  } catch {
    /* localStorage unavailable (private mode, SSR) - use default */
  }
  return DEFAULT_THEME;
}

function applyTheme(theme: ThemeId): void {
  document.documentElement.setAttribute('data-theme', theme);
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

export function ThemeProvider({ children, storageKey = DEFAULT_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(() => readStoredTheme(storageKey));

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore persistence failures */
    }
  }, [storageKey, theme]);

  const setTheme = useCallback((next: ThemeId) => setThemeState(next), []);

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
