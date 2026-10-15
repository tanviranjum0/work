import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { vi } from 'vitest';
import { AuthProvider } from '../features/auth/auth-context';
import { ThemeProvider } from '../lib/theme';
import { routes } from '../app/router';

type Handler = (url: string, init?: RequestInit) => unknown;

/** Routes fetch calls to handlers by path and wraps the payload in the API envelope. */
export const mockApi = (handlers: Record<string, Handler>) => {
  const defaults: Record<string, Handler> = {
    '/health': () => HEALTH,
    '/api/v1/client-config': () => ({ appMode: 'demo', features: { booking: true } }),
    '/api/v1/search/flexible': () => ({ supported: false, currency: 'USD', dataOrigin: null, cells: [] }),
  };
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const path = new URL(url, 'http://localhost').pathname;
    const entry = Object.entries({ ...defaults, ...handlers })
      .filter(([prefix]) => path.endsWith(prefix))
      .sort(([a], [b]) => b.length - a.length)[0];
    if (!entry) return new Response('not mocked', { status: 599 });
    console.log('fetch', path, 'matched', entry[0]);
    const result = entry[1](url, init);
    if (result instanceof Response) return result;
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { 'content-type': 'application/json', 'x-request-id': 'req-test' },
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const providers = (ui: ReactElement) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export const renderRoute = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(providers(<RouterProvider router={router} />));
  return router;
};

export const renderWithProviders = (ui: ReactElement) => render(providers(ui));

export const HEALTH = { status: 'ok', mode: 'demo', version: 'test' };
