import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
export const THEMES = [
    { id: 'bloom', name: 'Bloom', hint: 'Warm light', swatch: ['#fdf9f0', '#f8d7c0', '#c5704a'] },
    { id: 'slate', name: 'Slate', hint: 'Cool neutral', swatch: ['#eef1f6', '#ffffff', '#3b6ea5'] }
];
export const DEFAULT_THEME = 'bloom';
export const DEFAULT_STORAGE_KEY = 'pior-theme';
function isThemeId(value) {
    return typeof value === 'string' && THEMES.some((theme) => theme.id === value);
}
export function readStoredTheme(storageKey = DEFAULT_STORAGE_KEY) {
    try {
        const stored = window.localStorage.getItem(storageKey);
        if (isThemeId(stored))
            return stored;
    }
    catch {
        /* localStorage unavailable (private mode, SSR) - use default */
    }
    return DEFAULT_THEME;
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children, storageKey = DEFAULT_STORAGE_KEY }) {
    const [theme, setThemeState] = useState(() => readStoredTheme(storageKey));
    useEffect(() => {
        applyTheme(theme);
        try {
            window.localStorage.setItem(storageKey, theme);
        }
        catch {
            /* ignore persistence failures */
        }
    }, [storageKey, theme]);
    const setTheme = useCallback((next) => setThemeState(next), []);
    const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme, setTheme]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return context;
}
//# sourceMappingURL=index.js.map