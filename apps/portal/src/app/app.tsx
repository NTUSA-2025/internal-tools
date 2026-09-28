import { Button } from '@internal-tools/ui';
import { tools, type ToolDefinition } from '@internal-tools/tool-registry';
import {
  ArrowRight,
  FileText,
  Lock,
  LogIn,
  QrCode,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import ntusaLogo from '../assets/ntusa-logo.png';
import { DocumentGeneratorTool } from '../tools/document-generator';
import { PdfTools } from '../tools/pdf-tools';
import { QrcodeTool } from '../tools/qrcode';
import { ShortUrlTool } from '../tools/short-url';

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; email: string }
  | { status: 'anonymous' };

const toolRoutes: Record<ToolDefinition['id'], ReactNode> = {
  qrcode: <QrcodeTool />,
  'short-url': <ShortUrlTool />,
  'document-generator': <DocumentGeneratorTool />,
  'pdf-tools': <PdfTools />,
};

const iconByTool: Record<ToolDefinition['id'], ReactNode> = {
  qrcode: <QrCode aria-hidden="true" />,
  'short-url': <ArrowRight aria-hidden="true" />,
  'document-generator': <FileText aria-hidden="true" />,
  'pdf-tools': <Wand2 aria-hidden="true" />,
};

export function App() {
  const auth = useAuth();

  return (
    <div className="min-h-dvh bg-[var(--surface)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg border border-[var(--line)] bg-white">
              <img
                src={ntusaLogo}
                alt=""
                className="size-9 object-contain"
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-semibold">
                NTUSA Internal Tools
              </span>
              <span className="block truncate text-sm text-[var(--muted)]">
                qrcode, short url, documents, pdf
              </span>
            </span>
          </Link>
          <AuthStatus auth={auth} />
        </div>
        <nav
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-3"
          aria-label="Tools"
        >
          {tools.map((tool) => (
            <NavLink
              key={tool.id}
              to={tool.path}
              className={({ isActive }) =>
                [
                  'inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]',
                ].join(' ')
              }
            >
              <span className="size-4">{iconByTool[tool.id]}</span>
              {tool.title}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <Routes>
          <Route path="/" element={<ToolHome />} />
          {tools.map((tool) => (
            <Route
              key={tool.id}
              path={tool.path}
              element={
                <ToolGate auth={auth} tool={tool}>
                  {toolRoutes[tool.id]}
                </ToolGate>
              }
            />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;

function ToolHome() {
  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">
          Internal tool portal
        </h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Shared shell for NTUSA utilities, Cloudflare Pages Functions, Google
          SSO, and a single D1 database.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.id} to={tool.path} className="tool-card group">
            <span className="tool-card-icon">{iconByTool[tool.id]}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-semibold">{tool.title}</span>
                {tool.auth === 'required' ? (
                  <span className="badge badge-auth">
                    <Lock size={12} aria-hidden="true" />
                    Login
                  </span>
                ) : (
                  <span className="badge badge-public">Public</span>
                )}
              </span>
              <span className="mt-2 block text-sm text-[var(--muted)]">
                {tool.description}
              </span>
            </span>
            <ArrowRight
              className="size-4 text-[var(--muted)] transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

function ToolGate({
  auth,
  children,
  tool,
}: {
  auth: AuthState;
  children: ReactNode;
  tool: ToolDefinition;
}) {
  if (tool.auth === 'public') {
    return children;
  }

  if (auth.status === 'loading') {
    return <ToolShell title={tool.title} eyebrow="Checking session" />;
  }

  if (auth.status === 'authenticated') {
    return children;
  }

  return <LoginRequired tool={tool} />;
}

function LoginRequired({ tool }: { tool: ToolDefinition }) {
  const location = useLocation();
  const startUrl = useMemo(() => {
    const returnTo = `${location.pathname}${location.search}`;
    return `/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`;
  }, [location.pathname, location.search]);

  return (
    <ToolShell
      title={tool.title}
      eyebrow="Login required"
      actions={
        <Button asChild>
          <a href={startUrl}>
            <LogIn size={16} aria-hidden="true" />
            Sign in with Google
          </a>
        </Button>
      }
    >
      <p className="max-w-xl text-[var(--muted)]">
        This tool is available to Google accounts in the ntusa.ntu.edu.tw
        domain.
      </p>
    </ToolShell>
  );
}

export function ToolShell({
  actions,
  children,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="grid gap-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            {title}
          </h1>
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
      {children ? <div className="tool-panel">{children}</div> : null}
    </section>
  );
}

function AuthStatus({ auth }: { auth: AuthState }) {
  if (auth.status === 'authenticated') {
    return (
      <span className="hidden items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] sm:inline-flex">
        <ShieldCheck size={16} aria-hidden="true" />
        {auth.email}
      </span>
    );
  }

  return (
    <span className="hidden items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] sm:inline-flex">
      <Lock size={16} aria-hidden="true" />
      {auth.status === 'loading' ? 'Checking session' : 'Not signed in'}
    </span>
  );
}

function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/auth/me', {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          setAuth({ status: 'anonymous' });
          return;
        }

        const body = (await response.json()) as { user?: { email?: string } };
        if (body.user?.email) {
          setAuth({ status: 'authenticated', email: body.user.email });
          return;
        }

        setAuth({ status: 'anonymous' });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setAuth({ status: 'anonymous' });
      });

    return () => controller.abort();
  }, []);

  return auth;
}
