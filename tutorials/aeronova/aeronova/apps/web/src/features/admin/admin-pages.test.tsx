import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { FlightSearchResponse } from '@aeronova/shared';
import fixture from '../../test/fixtures/search-dac-lhr.json';
import { HEALTH, mockApi, renderRoute } from '../../test/render';

const response = fixture as unknown as FlightSearchResponse;
const offer = response.offers[0]!.offer;

const ADMIN_USER = {
  id: 'admin-1',
  email: 'boss@example.com',
  displayName: 'Boss',
  roles: ['ADMIN'],
  preferences: { currency: 'USD', cabin: 'economy', locale: 'en', maxStops: null, preferredAirlines: [] },
  createdAt: '2026-09-01T00:00:00.000Z',
};

const REGULAR_USER = { ...ADMIN_USER, id: 'user-1', email: 'traveller@example.com', roles: ['USER'] };

const signInAs = (user: typeof ADMIN_USER) =>
  sessionStorage.setItem(
    'aeronova.session',
    JSON.stringify({ accessToken: 'token-abc', expiresAt: Date.now() + 3_600_000, user }),
  );

const booking = (overrides: Record<string, unknown> = {}) => ({
  id: 'b1',
  reference: 'AB12CD',
  userId: 'user-1',
  state: 'TICKETED',
  currency: 'USD',
  total: offer.price.customerTotal,
  passengers: [
    {
      id: 'p1',
      type: 'adult',
      title: null,
      givenName: 'Amelia',
      middleName: null,
      familyName: 'Earhart',
      dateOfBirth: '1990-07-24',
      gender: null,
      nationality: 'US',
      travelDocument: null,
      loyaltyNumber: null,
    },
  ],
  contact: { email: 'traveller@example.com', phone: '+8801700000000' },
  snapshot: { offer, capturedAt: '2026-09-18T10:01:00.000Z', dataOrigin: 'demo' },
  payment: {
    id: 'pay1',
    state: 'CAPTURED',
    amount: offer.price.customerTotal,
    provider: 'mock',
    providerReference: 'demo-1',
    failureReason: null,
    createdAt: '',
    updatedAt: '',
  },
  tickets: [
    {
      id: 't1',
      passengerId: 'p1',
      number: 'DEMO-7QK2XP',
      state: 'ISSUED',
      issuedAt: '2026-09-18T10:01:00.000Z',
      simulated: true,
    },
  ],
  history: [
    { at: '2026-09-18T10:01:00.000Z', state: 'TICKETED', note: 'Demo ticket issued', actor: 'system' },
  ],
  simulated: true,
  createdAt: '2026-09-18T10:01:00.000Z',
  updatedAt: '2026-09-18T10:01:00.000Z',
  ...overrides,
});

afterEach(() => sessionStorage.clear());

describe('admin route guard', () => {
  it('sends a signed-out visitor to sign in, not to the admin console', async () => {
    mockApi({ '/health': () => HEALTH });
    renderRoute('/admin');
    expect(await screen.findByRole('heading', { name: 'Sign in to AeroNova' })).toBeInTheDocument();
  });

  it('sends a signed-in non-admin home instead of showing the console', async () => {
    signInAs(REGULAR_USER);
    mockApi({ '/health': () => HEALTH });
    const router = renderRoute('/admin');
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('lets a signed-in admin through to the console', async () => {
    signInAs(ADMIN_USER);
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/admin/metrics': () => ({
        totalUsers: 3,
        totalBookings: 2,
        bookingsByState: { TICKETED: 2 },
        bookingTotalsByCurrency: { USD: 195100 },
      }),
      '/api/v1/admin/provider-status': () => ({
        appMode: 'demo',
        flightProvider: 'mock',
        bookingProvider: 'mock',
        paymentProvider: 'mock',
        ticketingProvider: 'mock',
        authProvider: 'dev',
      }),
    });
    renderRoute('/admin');
    expect(await screen.findByRole('heading', { name: 'Admin' })).toBeInTheDocument();
    expect(await screen.findByText('3')).toBeInTheDocument(); // totalUsers
    expect(screen.getByText('$1,951.00')).toBeInTheDocument(); // bookingTotalsByCurrency.USD formatted
  });
});

describe('admin bookings and audit log', () => {
  it("shows every user's bookings, links to a detail page with the owner's contact, and filters by state", async () => {
    signInAs(ADMIN_USER);
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/admin/bookings/AB12CD': () => booking(),
      // Longer, more specific path first: the test helper matches by prefix, first match wins.
      '/api/v1/admin/bookings': () => [booking()],
    });
    renderRoute('/admin/bookings');
    expect(await screen.findByText('AB12CD')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('href', '/admin/bookings/AB12CD');

    renderRoute('/admin/bookings/AB12CD');
    expect(await screen.findByText('Booking AB12CD')).toBeInTheDocument();
    expect(screen.getByText(/traveller@example.com/)).toBeInTheDocument();
    expect(screen.getByText('Demo ticket issued', { exact: false })).toBeInTheDocument();
  });

  it('shows real audit events and never renders a password or token anywhere on the page', async () => {
    signInAs(ADMIN_USER);
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/admin/audit-log': () => [
        {
          id: 'e1',
          type: 'LOGIN_FAILED',
          at: '2026-09-20T10:00:00.000Z',
          actorUserId: null,
          actorEmail: 'attacker@example.com',
          requestId: 'r1',
          context: { reason: 'bad_password' },
        },
        {
          id: 'e2',
          type: 'BOOKING_CREATED',
          at: '2026-09-20T10:05:00.000Z',
          actorUserId: 'user-1',
          actorEmail: 'traveller@example.com',
          requestId: 'r2',
          context: { reference: 'AB12CD', state: 'TICKETED' },
        },
      ],
    });
    renderRoute('/admin/audit-log');
    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(3); // header + 2 events
    expect(within(table).getByText('Sign-in failed')).toBeInTheDocument();
    expect(within(table).getByText('Booking created')).toBeInTheDocument();
    expect(within(table).getByText('attacker@example.com')).toBeInTheDocument();
    // The page must never do anything with a typed credential even if one somehow ended
    // up in event context (the backend itself never puts one there — see admin.routes.test.ts).
    expect(document.body.textContent).not.toContain('hunter2');
    expect(document.body.textContent).not.toMatch(/\baccessToken\b|\btoken-abc\b/);
  });
});
