import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HEALTH, mockApi, renderRoute } from '../../test/render';

const USER = {
  id: 'u1',
  email: 'amelia@example.com',
  displayName: 'Amelia',
  roles: ['USER'],
  preferences: { currency: 'USD', cabin: 'economy', locale: 'en', maxStops: null, preferredAirlines: [] },
  createdAt: '2026-09-01T00:00:00.000Z',
};

const session = (expiresInSeconds = 3600) => ({
  accessToken: 'token-abc',
  tokenType: 'Bearer',
  expiresInSeconds,
  user: USER,
});

const signedIn = () =>
  sessionStorage.setItem(
    'aeronova.session',
    JSON.stringify({ accessToken: 'token-abc', expiresAt: Date.now() + 3_600_000, user: USER }),
  );

afterEach(() => sessionStorage.clear());

describe('sign in', () => {
  it('signs in, returns to the page that asked for it, and sends the token', async () => {
    const fetchMock = mockApi({
      '/health': () => HEALTH,
      '/api/v1/auth/login': () => session(),
      '/api/v1/travelers': () => [],
    });
    renderRoute('/account/travelers');
    const user = userEvent.setup();

    // The protected page redirects to sign in, remembering where we were going.
    expect(await screen.findByRole('heading', { name: 'Sign in to AeroNova' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Email'), 'amelia@example.com');
    await user.type(screen.getByLabelText('Password'), 'a-long-enough-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('heading', { name: 'Saved travellers' })).toBeInTheDocument();
    // The heading renders as soon as the route mounts, independent of the
    // travellers query, so wait for the request itself rather than assuming
    // it already landed by the time the heading appears.
    const travelerCall = await vi.waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => String(c[0]).includes('/api/v1/travelers'));
      if (!call) throw new Error('travelers request not sent yet');
      return call;
    });
    expect((travelerCall[1]?.headers as Record<string, string>).Authorization).toBe('Bearer token-abc');
    const loginBody = JSON.parse(
      String(fetchMock.mock.calls.find((c) => String(c[0]).includes('/login'))?.[1]?.body),
    );
    expect(loginBody).toEqual({ email: 'amelia@example.com', password: 'a-long-enough-password' });
  });

  it('shows the API message when credentials are wrong, without clearing the email', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/auth/login': () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Email or password is incorrect.', requestId: 'r1' },
          }),
          { status: 401, headers: { 'content-type': 'application/json' } },
        ),
    });
    renderRoute('/signin');
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText('Email'), 'amelia@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong-but-long-enough');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
    expect(screen.getByLabelText('Email')).toHaveValue('amelia@example.com');
  });

  it('never follows an off-site redirect supplied in the URL', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/auth/login': () => session(),
      '/api/v1/users/me': () => USER,
    });
    const router = renderRoute(`/signin?next=${encodeURIComponent('https://evil.example/steal')}`);
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText('Email'), 'amelia@example.com');
    await user.type(screen.getByLabelText('Password'), 'a-long-enough-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/account'));
  });

  it('ignores a stored session that has already expired', async () => {
    sessionStorage.setItem(
      'aeronova.session',
      JSON.stringify({ accessToken: 'stale', expiresAt: Date.now() - 1000, user: USER }),
    );
    const fetchMock = mockApi({ '/health': () => HEALTH });
    renderRoute('/account');
    expect(await screen.findByRole('heading', { name: 'Sign in to AeroNova' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.every((c) => !String(c[0]).includes('/api/v1/users/me'))).toBe(true);
  });

  it('signs out, forgets the session and stops sending the token', async () => {
    signedIn();
    const fetchMock = mockApi({ '/health': () => HEALTH, '/api/v1/travelers': () => [] });
    renderRoute('/account/travelers');
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: 'Saved travellers' });

    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Sign out' }));

    await waitFor(() => expect(sessionStorage.getItem('aeronova.session')).toBeNull());
    fetchMock.mockClear();
    expect(await screen.findByRole('heading', { name: 'Sign in to AeroNova' })).toBeInTheDocument();
  });
});

describe('saving a search', () => {
  it('asks signed-out travellers to sign in, keeping the search in the link', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () => ({
        offers: [],
        totalOffers: 0,
        places: {},
        searchId: 'srch',
        query: {},
        dataOrigin: 'demo',
        currency: 'USD',
        conversion: 'none',
        generatedAt: '',
        expiresAt: '',
        truncated: false,
      }),
    });
    renderRoute('/search?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy&sort=cheapest');
    const link = await screen.findByRole('link', { name: /Sign in to save/i });
    expect(link.getAttribute('href')).toContain('next=%2Fsearch%3Ftrip%3Doneway');
  });

  it('saves only the search itself, not filters or sort', async () => {
    signedIn();
    const fetchMock = mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () => ({
        offers: [],
        totalOffers: 0,
        places: {},
        searchId: 'srch',
        query: {},
        dataOrigin: 'demo',
        currency: 'USD',
        conversion: 'none',
        generatedAt: '',
        expiresAt: '',
        truncated: false,
      }),
      '/api/v1/saved-searches': () => ({ id: 's1', label: 'DAC – LHR', params: {}, createdAt: '' }),
    });
    renderRoute(
      '/search?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy&sort=cheapest&stops=0',
    );
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: 'Save search' }));

    await waitFor(() => expect(screen.getByText('Search saved')).toBeInTheDocument());
    const body = JSON.parse(
      String(fetchMock.mock.calls.find((c) => String(c[0]).includes('/saved-searches'))?.[1]?.body),
    );
    expect(body.params).toEqual({
      trip: 'oneway',
      from: 'DAC',
      to: 'LHR',
      depart: '2026-12-22',
      adults: '1',
      cabin: 'economy',
    });
    expect(body.params).not.toHaveProperty('sort');
    expect(body.params).not.toHaveProperty('stops');
  });
});
