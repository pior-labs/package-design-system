# Pior Labs Design System

Shared Tailwind v4 and shadcn-compatible design system tokens for Pior Labs apps.

## Repo layout

```txt
packages/
  themes/        # published theme package
apps/
  theme-lab/     # SPA playground for building and validating themes
```

Only `packages/themes` is intended to be consumed by other apps. The theme lab is a private workspace app, so its future dependencies do not bloat consuming applications.

## Install from GitHub Packages

Configure the GitHub Packages npm registry for the `@pior-labs` scope in the
consumer app:

```ini
@pior-labs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Install the package from GitHub Packages:

```sh
pnpm add @pior-labs/design-system@^1.0.0
```

In `package.json` this resolves to a normal version range:

```jsonc
"@pior-labs/design-system": "^1.0.0"
```

The package publishes from `packages/themes` via
[`.github/workflows/publish-package.yml`](.github/workflows/publish-package.yml)
when a `v*` tag is pushed or when the workflow is run manually. The package is
published to GitHub Packages with the `@pior-labs/design-system` name.

### Temporary pkg branch fallback

The legacy `pkg` branch workflow remains in place while consumer apps are
verified. Consumers that still need the branch fallback can install it with:

```sh
pnpm add github:pior-labs/package-design-system#pkg
```

Because lockfiles pin the resolved commit, run
`pnpm update @pior-labs/design-system` in a consumer to pull the latest branch
fallback build. Do not use `#main` or a `#path:` fragment — `#main` resolves to
the workspace root and the `#path:` syntax is not supported by pnpm.

## Usage

Import the theme CSS after Tailwind in your app stylesheet:

```css
@import "tailwindcss";
@import "@pior-labs/design-system/styles.css";
```

Apps that want the shared effect helpers can opt in separately:

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

## Development

```sh
pnpm install
pnpm build
pnpm typecheck
```

The root scripts target the published theme package. The private lab can be developed with:

```sh
pnpm dev:theme-lab
```
