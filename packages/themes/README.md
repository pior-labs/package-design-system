# Pior Labs Design System

Shared Tailwind v4 and shadcn-compatible design system tokens for Pior Labs apps.

## Installation

Configure the GitHub Packages npm registry for the `@pior-labs` scope in your
consumer app:

```ini
@pior-labs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Install the package:

```sh
pnpm add @pior-labs/design-system@^1.0.0
```

## Usage

Import the theme CSS after Tailwind in your app stylesheet:

```css
@import "tailwindcss";
@import "@pior-labs/design-system/styles.css";
```

Import the optional effect helpers only in apps that want shared glass, mesh,
grain, motion, and accent-surface utility classes:

```css
@import "@pior-labs/design-system/effects.css";
```

Wrap your React app with the provider:

```tsx
import { ThemeProvider } from '@pior-labs/design-system';

export function App() {
  return (
    <ThemeProvider>
      {/* app */}
    </ThemeProvider>
  );
}
```

Use the theme hook when you need to render a theme picker:

```tsx
import { useTheme } from '@pior-labs/design-system';

export function ThemePicker() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>
      {themes.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
```

Themes are applied with `data-theme` on the document root.
