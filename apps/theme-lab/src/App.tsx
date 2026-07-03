import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Layers3,
  Palette,
  ReceiptText,
  Search,
  Sparkles,
  WalletCards,
  X
} from 'lucide-react';
import { useTheme } from '@pior-labs/design-system';
import { tokenGroups, tokens, type TokenDefinition, type TokenGroupId } from './generated/token-manifest';

type TokenValueMap = Record<string, string>;

const contrastPairs = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['muted-foreground', 'muted'],
  ['primary-foreground', 'primary'],
  ['accent-foreground', 'accent-soft']
] as const;

const financeRows = [
  { merchant: 'Cedar Market', category: 'Groceries', status: 'Matched', amount: '$84.20', tone: 'good' },
  { merchant: 'Northline Transit', category: 'Transport', status: 'Review', amount: '$12.50', tone: 'warn' },
  { merchant: 'Studio Invoice', category: 'Income', status: 'New', amount: '+$1,240.00', tone: 'primary' }
];

const primitiveBadges = ['Default', 'Muted', 'Warning', 'Success', 'Danger'];

function useTokenValues(theme: string): TokenValueMap {
  const [values, setValues] = useState<TokenValueMap>({});

  useEffect(() => {
    const styles = window.getComputedStyle(document.documentElement);
    const nextValues = Object.fromEntries(tokens.map((token) => [token.name, styles.getPropertyValue(token.cssVar).trim()]));
    setValues(nextValues);
  }, [theme]);

  return values;
}

function resolveTokenValue(name: string, values: TokenValueMap, seen = new Set<string>()): string {
  const value = values[name] ?? '';
  const variableMatch = value.match(/^var\(--([a-zA-Z0-9-]+)\)$/);
  if (!variableMatch || seen.has(name)) return value;

  seen.add(name);
  return resolveTokenValue(variableMatch[1], values, seen);
}

function parseColor(value: string): [number, number, number] | null {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return [
      Number.parseInt(trimmed.slice(1, 3), 16),
      Number.parseInt(trimmed.slice(3, 5), 16),
      Number.parseInt(trimmed.slice(5, 7), 16)
    ];
  }

  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  return null;
}

function getLuminance([red, green, blue]: [number, number, number]): number {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(foreground: string, background: string): number | null {
  const foregroundRgb = parseColor(foreground);
  const backgroundRgb = parseColor(background);
  if (!foregroundRgb || !backgroundRgb) return null;

  const light = Math.max(getLuminance(foregroundRgb), getLuminance(backgroundRgb));
  const dark = Math.min(getLuminance(foregroundRgb), getLuminance(backgroundRgb));
  return (light + 0.05) / (dark + 0.05);
}

function isColorToken(token: TokenDefinition): boolean {
  if (token.name.includes('rgb') || token.name.includes('opacity')) return false;
  return ['core', 'semantic', 'surface', 'atmosphere', 'tailwind'].includes(token.group);
}

function ThemeDock() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <aside className="theme-dock" aria-label="Theme controls">
      <div>
        <p className="eyebrow">Theme Lab</p>
        <h1>Build themes with every token in the room.</h1>
      </div>

      <div className="theme-options" role="group" aria-label="Theme">
        {themes.map((option) => (
          <button
            key={option.id}
            type="button"
            className="theme-option"
            data-active={option.id === theme}
            onClick={() => setTheme(option.id)}
          >
            <span className="theme-swatch" style={{ background: option.swatch[0] }}>
              <span style={{ background: option.swatch[1] }} />
              <span style={{ background: option.swatch[2] }} />
            </span>
            <span>
              <strong>{option.name}</strong>
              <small>{option.hint}</small>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="lab-section">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TokenInventory({ values }: { values: TokenValueMap }) {
  const tokensByGroup = useMemo(
    () =>
      tokens.reduce<Record<TokenGroupId, TokenDefinition[]>>(
        (groups, token) => {
          groups[token.group].push(token);
          return groups;
        },
        {
          core: [],
          semantic: [],
          surface: [],
          atmosphere: [],
          shape: [],
          effects: [],
          tailwind: [],
          legacy: [],
          other: []
        }
      ),
    []
  );

  return (
    <Section eyebrow={`${tokens.length} generated tokens`} title="Token inventory">
      <div className="token-groups">
        {(Object.keys(tokenGroups) as TokenGroupId[]).map((group) => {
          const groupTokens = tokensByGroup[group];
          if (groupTokens.length === 0) return null;

          return (
            <div className="token-group" key={group}>
              <h3>{tokenGroups[group]}</h3>
              <div className="token-grid">
                {groupTokens.map((token) => {
                  const resolved = resolveTokenValue(token.name, values);
                  const preview = isColorToken(token) ? resolved : undefined;

                  return (
                    <article className="token-card" key={token.name}>
                      <span className="token-preview" style={preview ? { background: `var(${token.cssVar})` } : undefined}>
                        {!preview && <Layers3 size={16} aria-hidden="true" />}
                      </span>
                      <span className="token-copy">
                        <code>{token.cssVar}</code>
                        <small>{resolved || 'unresolved'}</small>
                      </span>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ContrastMatrix({ values }: { values: TokenValueMap }) {
  return (
    <Section eyebrow="AA sanity pass" title="Foreground and surface pairs">
      <div className="contrast-grid">
        {contrastPairs.map(([foreground, background]) => {
          const foregroundValue = resolveTokenValue(foreground, values);
          const backgroundValue = resolveTokenValue(background, values);
          const ratio = getContrastRatio(foregroundValue, backgroundValue);
          const pass = ratio !== null && ratio >= 4.5;

          return (
            <article
              className="contrast-card"
              key={`${foreground}-${background}`}
              style={{ color: `var(--${foreground})`, background: `var(--${background})` }}
            >
              <strong>{foreground}</strong>
              <span>on {background}</span>
              <b>{ratio ? `${ratio.toFixed(2)}:1` : 'n/a'}</b>
              <small data-pass={pass}>{pass ? 'AA pass' : 'Needs review'}</small>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function PrimitiveGallery() {
  return (
    <Section eyebrow="Generic UI" title="Primitive gallery">
      <div className="primitive-grid">
        <article className="preview-panel">
          <h3>Buttons and badges</h3>
          <div className="button-row">
            <button className="button primary">Primary action</button>
            <button className="button secondary">Secondary</button>
            <button className="button ghost">Ghost</button>
            <button className="button danger">Destructive</button>
          </div>
          <div className="badge-row">
            {primitiveBadges.map((badge) => (
              <span className={`badge ${badge.toLowerCase()}`} key={badge}>
                {badge}
              </span>
            ))}
          </div>
        </article>

        <article className="preview-panel">
          <h3>Form field set</h3>
          <label className="field-label" htmlFor="theme-search">
            Search token
          </label>
          <div className="input-shell">
            <Search size={16} aria-hidden="true" />
            <input id="theme-search" value="primary-foreground" readOnly />
          </div>
          <button className="select-shell" type="button">
            <span>Monthly report</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </article>

        <article className="preview-panel">
          <h3>Alerts and progress</h3>
          <div className="alert warning">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>Muted and warning tones stay legible together.</span>
          </div>
          <div className="alert success">
            <BadgeCheck size={18} aria-hidden="true" />
            <span>Success color has a matching soft surface.</span>
          </div>
          <div className="progress-track">
            <span />
          </div>
        </article>

        <article className="preview-panel modal-demo">
          <div className="scrim-card theme-overlay-anim">
            <button className="close-button" type="button" aria-label="Close preview">
              <X size={14} />
            </button>
            <Bell size={18} aria-hidden="true" />
            <h3>Modal and toast motion</h3>
            <p>Overlay, scrim, radius, shadow, and foreground tokens sharing one tiny stage.</p>
          </div>
          <div className="toast-demo">
            <Check size={16} aria-hidden="true" />
            Theme preview saved locally
          </div>
        </article>
      </div>
    </Section>
  );
}

function FinanceGallery() {
  return (
    <Section eyebrow="Product density" title="Finance preview">
      <div className="finance-grid">
        <article className="metric-card tone-card-1">
          <CircleDollarSign size={22} aria-hidden="true" />
          <span>Monthly spend</span>
          <strong>$4,820</strong>
          <small>
            <ArrowDownRight size={14} aria-hidden="true" />
            8.4% below plan
          </small>
        </article>
        <article className="metric-card tone-card-2">
          <WalletCards size={22} aria-hidden="true" />
          <span>Cash flow</span>
          <strong>+$1,104</strong>
          <small>
            <ArrowUpRight size={14} aria-hidden="true" />
            Strong month
          </small>
        </article>
        <article className="metric-card tone-card-3">
          <ReceiptText size={22} aria-hidden="true" />
          <span>Needs review</span>
          <strong>12</strong>
          <small>Uncategorized transactions</small>
        </article>
      </div>

      <article className="transaction-panel">
        <div className="panel-title">
          <h3>Transaction table</h3>
          <span className="badge muted">Live density check</span>
        </div>
        <div className="transaction-table">
          {financeRows.map((row) => (
            <div className="transaction-row" key={row.merchant}>
              <CreditCard size={18} aria-hidden="true" />
              <strong>{row.merchant}</strong>
              <span>{row.category}</span>
              <span className={`badge ${row.tone}`}>{row.status}</span>
              <b>{row.amount}</b>
            </div>
          ))}
        </div>
      </article>

      <div className="state-grid">
        <article className="state-card empty">
          <Sparkles size={20} aria-hidden="true" />
          <strong>Empty state</strong>
          <span>No transactions need your attention.</span>
        </article>
        <article className="state-card loading">
          <span className="pulse-dot" />
          <strong>Loading state</strong>
          <span>Soft surfaces should still feel active.</span>
        </article>
        <article className="state-card error">
          <AlertTriangle size={20} aria-hidden="true" />
          <strong>Error state</strong>
          <span>Destructive tones need readable contrast.</span>
        </article>
      </div>
    </Section>
  );
}

function AtmosphereGallery() {
  return (
    <Section eyebrow="Helpers" title="Atmosphere and effects">
      <div className="atmosphere-grid">
        <article className="effect-panel mesh-preview">
          <div className="mini-mesh" aria-hidden="true">
            <span className="theme-blob b1" />
            <span className="theme-blob b2" />
            <span className="theme-blob b3" />
          </div>
          <h3>Mesh blobs</h3>
          <p>Uses blob colors, blend mode, opacity, and motion tokens.</p>
        </article>

        <article className="effect-panel theme-glass">
          <h3>Glass surface</h3>
          <p>Exercises glass background, border, frost RGB, and shadow tokens.</p>
        </article>

        <article className="effect-panel">
          <h3>Hand detail</h3>
          <div className="bars">
            <span className="theme-bar-fill" />
            <span className="theme-bar-fill-good" />
          </div>
        </article>

        <article className="effect-panel action-preview">
          <span className="theme-action-bg all-caught" aria-hidden="true" />
          <h3>Action background</h3>
          <p>Checks radial accents against foreground content.</p>
        </article>
      </div>
    </Section>
  );
}

export function App() {
  const { theme } = useTheme();
  const values = useTokenValues(theme);

  return (
    <div className="theme-lab-shell">
      <div className="theme-mesh" aria-hidden="true">
        <span className="theme-blob b1" />
        <span className="theme-blob b2" />
        <span className="theme-blob b3" />
        <span className="theme-blob b4" />
        <span className="theme-blob b5" />
      </div>
      <div className="theme-grain" aria-hidden="true" />

      <ThemeDock />

      <main className="lab-main">
        <TokenInventory values={values} />
        <ContrastMatrix values={values} />
        <PrimitiveGallery />
        <FinanceGallery />
        <AtmosphereGallery />
      </main>
    </div>
  );
}
