export type ThemeId = 'bloom' | 'slate';
export interface ThemeOption {
    id: ThemeId;
    name: string;
    hint: string;
    swatch: [string, string, string];
}
export declare const THEMES: ThemeOption[];
export declare const DEFAULT_THEME: ThemeId;
export declare const DEFAULT_STORAGE_KEY = "pior-theme";
export declare function readStoredTheme(storageKey?: string): ThemeId;
interface ThemeContextValue {
    theme: ThemeId;
    setTheme: (theme: ThemeId) => void;
    themes: ThemeOption[];
}
interface ThemeProviderProps {
    children: React.ReactNode;
    storageKey?: string;
}
export declare function ThemeProvider({ children, storageKey }: ThemeProviderProps): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=index.d.ts.map