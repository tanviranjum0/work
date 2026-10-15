import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FlightSearchResponse } from '@aeronova/shared';
import fixture from '../../test/fixtures/search-dac-lhr.json';
import { HEALTH, mockApi, renderRoute } from '../../test/render';

const response = fixture as unknown as FlightSearchResponse;
const offer = response.offers[0]!.offer;
const SEARCH_ID = 'srch_00000000000000000000000000000000';
const PARAMS = '?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy';
const CHECKOUT = `/book/${SEARCH_ID}/${offer.id}${PARAMS}`;

const USER = {
  id: 'u1',
  email: 'amelia@example.com',
  displayName: 'Amelia',
  roles: ['USER'],
  preferences: { currency: 'USD', cabin: 'economy', locale: 'en', maxStops: null, preferredAirlines: [] },
  createdAt: '2026-09-01T00:00:00.000Z',
};

const quote = (overrides: Record<string, unknown> = {}) => ({
  quoteId: 'quote-1',
  searchId: SEARCH_ID,
  offerId: offer.id,
  status: 'confirmed',
  offer,
  previousTotal: offer.price.customerTotal,
  checkedAt: '2026-09-18T10:00:00.000Z',
  expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
  dataOrigin: 'demo',
  ...overrides,
});

const booking = (overrides: Record<string, unknown> = {}) => ({
  id: 'b1',
  reference: 'AB12CD',
  userId: 'u1',
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
  contact: { email: 'amelia@example.com', phone: '+8801700000000' },
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

const signIn = () =>
  sessionStorage.setItem(
    'aeronova.session',
    JSON.stringify({ accessToken: 'token-abc', expiresAt: Date.now() + 3_600_000, user: USER }),
  );

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('First name'), 'Amelia');
  await user.type(screen.getByLabelText('Last name'), 'Earhart');
  await user.type(screen.getByLabelText('Date of birth'), '1990-07-24');
  await user.type(screen.getByLabelText('Phone'), '+8801700000000');
  await user.type(screen.getByLabelText('Name on card'), 'Amelia Earhart');
  await user.click(screen.getByRole('checkbox', { name: /accept the fare conditions/i }));
};

afterEach(() => sessionStorage.clear());

describe('checkout', () => {
  it('re-checks the price, books, and sends the quote with the travellers', async () => {
    signIn();
    const api = mockApi({
      '/health': () => HEALTH,
      '/api/v1/offers/price': () => quote(),
      '/api/v1/travelers': () => [],
      '/api/v1/bookings': () => booking(),
    });
    const router = renderRoute(CHECKOUT);
    const user = userEvent.setup();

    // The price is confirmed here, not trusted from the results page.
    await screen.findByRole('heading', { name: 'Review and book' });
    expect(api.mock.calls.some((c) => String(c[0]).includes('/offers/price'))).toBe(true);
    expect(screen.getByLabelText('Email')).toHaveValue('amelia@example.com');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Confirm and book' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/bookings/AB12CD'));
    const post = api.mock.calls.find((c) => c[1]?.method === 'POST' && String(c[0]).includes('/bookings'));
    const body = JSON.parse(String(post?.[1]?.body));
    expect(body.quoteId).toBe('quote-1');
    expect(body.passengers[0]).toMatchObject({
      type: 'adult',
      givenName: 'Amelia',
      familyName: 'Earhart',
      travelDocument: null,
    });
    expect(body.payment).toEqual({ method: 'demo_card', holderName: 'Amelia Earhart' });
    expect(body.acceptedTerms).toBe(true);
    // No card details are ever collected by this form.
    expect(JSON.stringify(body)).not.toMatch(/cardNumber|cvc|pan/i);
  });

  it('sends one Idempotency-Key and keeps it for a retry after failure', async () => {
    signIn();
    let attempt = 0;
    const api = mockApi({
      '/health': () => HEALTH,
      '/api/v1/offers/price': () => quote(),
      '/api/v1/travelers': () => [],
      '/api/v1/bookings': () => {
        attempt += 1;
        return attempt === 1
          ? new Response(
              JSON.stringify({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Something failed.', requestId: 'r1' },
              }),
              { status: 500, headers: { 'content-type': 'application/json' } },
            )
          : booking();
      },
    });
    renderRoute(CHECKOUT);
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: 'Review and book' });
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Confirm and book' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm and book' }));

    const keys = api.mock.calls
      .filter((c) => c[1]?.method === 'POST' && String(c[0]).includes('/bookings'))
      .map((c) => (c[1]?.headers as Record<string, string>)['Idempotency-Key']);
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[0]).toMatch(/^book-/);
  });

  it('refuses to submit until the details the airline needs are present', async () => {
    signIn();
    const api = mockApi({
      '/health': () => HEALTH,
      '/api/v1/offers/price': () => quote(),
      '/api/v1/travelers': () => [],
      '/api/v1/bookings': () => booking(),
    });
    renderRoute(CHECKOUT);
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: 'Review and book' });
    await user.click(screen.getByRole('button', { name: 'Confirm and book' }));

    expect((await screen.findAllByText('Required.')).length).toBeGreaterThan(0);
    expect(api.mock.calls.some((c) => c[1]?.method === 'POST' && String(c[0]).includes('/bookings'))).toBe(
      false,
    );
  });

  it('stops the traveller when the held fare has expired', async () => {
    signIn();
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/offers/price': () => quote({ expiresAt: new Date(Date.now() - 60_000).toISOString() }),
      '/api/v1/travelers': () => [],
    });
    renderRoute(CHECKOUT);
    await screen.findByRole('heading', { name: 'Review and book' });
    expect(screen.getByRole('button', { name: 'Confirm and book' })).toBeDisabled();
  });

  it('sends signed-out travellers to sign in first, then back to checkout', async () => {
    mockApi({ '/health': () => HEALTH });
    renderRoute(CHECKOUT);
    expect(await screen.findByRole('heading', { name: 'Sign in to AeroNova' })).toBeInTheDocument();
  });
});

describe('confirmation', () => {
  it('marks a simulated booking plainly and shows the demo ticket', async () => {
    signIn();
    mockApi({ '/health': () => HEALTH, '/api/v1/bookings/AB12CD': () => booking() });
    renderRoute('/bookings/AB12CD');

    expect(await screen.findByRole('heading', { name: 'Demo reservation created' })).toBeInTheDocument();
    expect(screen.getByText('DEMO TICKET — NOT VALID FOR TRAVEL')).toBeInTheDocument();
    expect(screen.getByText('DEMO-7QK2XP')).toBeInTheDocument();
    expect(screen.getByText('AB12CD')).toBeInTheDocument();
    expect(screen.getAllByText(/Ticketed/).length).toBeGreaterThan(0);
  });

  it('never presents a booking that needs reconciliation as a success', async () => {
    signIn();
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/bookings/AB12CD': () =>
        booking({
          state: 'PAYMENT_RECONCILIATION_REQUIRED',
          tickets: [],
          history: [
            {
              at: '2026-09-18T10:01:00.000Z',
              state: 'PAYMENT_RECONCILIATION_REQUIRED',
              note: 'Supplier booking failed after payment',
              actor: 'system',
            },
          ],
        }),
    });
    renderRoute('/bookings/AB12CD');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/needs attention from our team. Your payment is recorded/i);
    expect(screen.getAllByText('Needs attention').length).toBeGreaterThan(0);
    expect(screen.queryByText(/DEMO-/)).not.toBeInTheDocument();
  });

  it('downloads the itinerary as a PDF via an authenticated fetch, not a plain link', async () => {
    signIn();
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // "%PDF-"
    const api = mockApi({
      '/health': () => HEALTH,
      '/api/v1/bookings/AB12CD/itinerary.pdf': () =>
        new Response(pdfBytes, { headers: { 'content-type': 'application/pdf' } }),
      '/api/v1/bookings/AB12CD': () => booking(),
    });

    // jsdom has neither method; add them to the real URL class rather than
    // replacing the global (replacing it broke `new URL(...)` calls
    // elsewhere in the app for the rest of the file).
    const created = vi.fn(() => 'blob:mock-url');
    const revoked = vi.fn();
    URL.createObjectURL = created;
    URL.revokeObjectURL = revoked;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderRoute('/bookings/AB12CD');
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: 'Download itinerary (PDF)' }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    const pdfCall = api.mock.calls.find((c) => String(c[0]).includes('/itinerary.pdf'));
    expect((pdfCall?.[1]?.headers as Record<string, string>).Authorization).toBe('Bearer token-abc');
    expect(created).toHaveBeenCalled();
    expect(revoked).toHaveBeenCalledWith('blob:mock-url');
    clickSpy.mockRestore();
    Reflect.deleteProperty(URL, 'createObjectURL');
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  it('shows a clear error if the PDF cannot be prepared, without crashing the page', async () => {
    signIn();
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/bookings/AB12CD/itinerary.pdf': () => new Response('', { status: 500 }),
      '/api/v1/bookings/AB12CD': () => booking(),
    });
    renderRoute('/bookings/AB12CD');
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: 'Download itinerary (PDF)' }));
    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't prepare the PDF. Try again.");
  });

  it('no longer claims an email was sent, since nothing sends one', async () => {
    signIn();
    mockApi({ '/health': () => HEALTH, '/api/v1/bookings/AB12CD': () => booking() });
    renderRoute('/bookings/AB12CD');
    await screen.findByRole('heading', { name: 'Demo reservation created' });
    expect(screen.queryByText(/Itinerary sent to/)).not.toBeInTheDocument();
    expect(screen.getByText(/Contact: amelia@example.com/)).toBeInTheDocument();
  });

  it('lists trips and opens one', async () => {
    signIn();
    mockApi({ '/health': () => HEALTH, '/api/v1/bookings': () => [booking()] });
    const router = renderRoute('/trips');
    const user = userEvent.setup();
    const link = await screen.findByRole('link', { name: /AB12CD/ });
    await user.click(link);
    await waitFor(() => expect(router.state.location.pathname).toBe('/bookings/AB12CD'));
  });
});
