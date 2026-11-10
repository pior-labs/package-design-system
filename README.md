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
pnpm add --save-exact @pior-labs/design-system@1.0.1
```

In `package.json` this resolves to an exact version:

```jsonc
"@pior-labs/design-system": "1.0.1"
```

## Releases

GitHub Packages is the only supported distribution method. Consumers install
explicit versions and commit their lockfiles; each application adopts and deploys
updates independently. Publishing a package does not update running applications.

1. Open a PR with the package changes and an appropriate version bump in
   `packages/themes/package.json`. CI typechecks and builds the package and playground.
2. After merge, push a matching `v<version>` tag on that main-branch commit.
3. `publish-package.yml` validates the tag/version and main ancestry, checks both
   workspaces, and publishes the package to GitHub Packages.
4. Update each consumer with `pnpm add --save-exact @pior-labs/design-system@<version>`
   from its frontend package directory, commit its manifest and lockfile, and run
   that application's checks before deployment.

Manual publication is available by selecting the existing version tag in the
workflow dispatch UI. Branch dispatches are rejected. Fix a released package by
publishing a new version rather than replacing an existing release.

Use patch versions for compatible fixes, minor versions for compatible additions,
and major versions for breaking changes to exports, React support, or styling
contracts. Review visual changes in the playground and affected applications.

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

The root build and typecheck scripts check both the published package and playground. The private lab can be developed with:

```sh
pnpm dev:theme-lab
```
