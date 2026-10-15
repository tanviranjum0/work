import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { FlightSearchResponse, PricedQuote } from '@aeronova/shared';
import fixture from '../../test/fixtures/search-dac-lhr.json';
import { HEALTH, mockApi, renderRoute } from '../../test/render';

const search = fixture as unknown as FlightSearchResponse;
const SEARCH_ID = search.searchId;
// An itinerary that has more than one fare family.
const itinerary = search.offers.find(
  (r) => search.offers.filter((o) => o.offer.itineraryKey === r.offer.itineraryKey).length === 3,
)!;
const offer = itinerary.offer;
const PARAMS = '?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy';
const PATH = `/flights/${SEARCH_ID}/${offer.id}${PARAMS}`;

const quote = (status: 'confirmed' | 'changed'): PricedQuote => {
  const total = offer.price.customerTotal;
  const next = status === 'changed' ? { ...total, amountMinor: total.amountMinor + 2600 } : total;
  return {
    quoteId: `qt_${status.padEnd(32, '0')}`,
    searchId: SEARCH_ID,
    offerId: offer.id,
    status,
    offer: {
      ...offer,
      price: {
        ...offer.price,
        base: {
          ...offer.price.base,
          amountMinor: offer.price.base.amountMinor + (next.amountMinor - total.amountMinor),
        },
        customerTotal: next,
        supplierTotal: next,
      },
    },
    previousTotal: total,
    checkedAt: '2026-09-15T12:00:00Z',
    expiresAt: '2999-01-01T00:00:00Z',
    dataOrigin: 'demo',
  };
};

const failure = (status: number, code: string) =>
  new Response(JSON.stringify({ success: false, error: { code, message: 'x', requestId: 'req-1' } }), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('FlightDetailPage', () => {
  it('shows the itinerary, fare families, and a confirmed price', async () => {
    const api = mockApi({
      '/health': () => HEALTH,
      [`/api/v1/search/${SEARCH_ID}`]: () => search,
      '/api/v1/offers/price': () => quote('confirmed'),
    });
    renderRoute(PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'Dhaka to London' })).toBeInTheDocument();
    expect(await screen.findByText(/Price checked at/)).toBeInTheDocument();
    const fares = within(screen.getByRole('group', { name: 'Choose a fare' })).getAllByRole('radio');
    expect(fares).toHaveLength(3);
    expect(fares.filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Back to results' })).toHaveAttribute('href', `/search${PARAMS}`);
    // A confirmed price opens checkout, carrying the search so the page can be reloaded.
    expect(screen.getByRole('link', { name: 'Continue to travellers' })).toHaveAttribute(
      'href',
      `/book/${SEARCH_ID}/${offer.id}${PARAMS}`,
    );

    const call = api.mock.calls.find((c) => String(c[0]).includes('/offers/price'));
    expect(JSON.parse(String(call?.[1]?.body))).toEqual({ searchId: SEARCH_ID, offerId: offer.id });
  });

  it('switches fares through the URL', async () => {
    mockApi({
      '/health': () => HEALTH,
      [`/api/v1/search/${SEARCH_ID}`]: () => search,
      '/api/v1/offers/price': () => quote('confirmed'),
    });
    const router = renderRoute(PATH);
    const user = userEvent.setup();
    const group = await screen.findByRole('group', { name: 'Choose a fare' });
    const other = within(group)
      .getAllByRole('radio')
      .find((r) => !(r as HTMLInputElement).checked)!;
    await user.click(other);
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/flights/${SEARCH_ID}/${(other as HTMLInputElement).value}`,
      ),
    );
    expect(router.state.location.search).toBe(PARAMS);
  });

  it('requires the traveller to accept a price change, and never applies it silently', async () => {
    mockApi({
      '/health': () => HEALTH,
      [`/api/v1/search/${SEARCH_ID}`]: () => search,
      '/api/v1/offers/price': () => quote('changed'),
    });
    renderRoute(PATH);
    const user = userEvent.setup();
    const dialog = await screen.findByRole('dialog', { name: 'The price changed' });
    expect(within(dialog).getByText('Was')).toBeInTheDocument();
    expect(within(dialog).getByText('+$26')).toBeInTheDocument();

    const summary = screen.getByRole('complementary', { name: 'Price summary' });
    const oldTotal = within(summary).getByText('Total').nextElementSibling?.textContent;

    await user.click(within(dialog).getByRole('button', { name: 'Choose another fare' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Choose a fare' })).toHaveFocus();
    expect(within(summary).getByText('Total').nextElementSibling?.textContent).toBe(oldTotal);

    await user.click(within(summary).getByRole('button', { name: 'Review the new price' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: /^Continue at/ }));
    expect(await within(summary).findByText(/Price updated at/)).toBeInTheDocument();
    expect(within(summary).getByText('Total').nextElementSibling?.textContent).not.toBe(oldTotal);
  });

  it('explains an expired fare and offers to search again', async () => {
    mockApi({
      '/health': () => HEALTH,
      [`/api/v1/search/${SEARCH_ID}`]: () => search,
      '/api/v1/offers/price': () => failure(410, 'OFFER_EXPIRED'),
    });
    renderRoute(PATH);
    expect(
      await screen.findByRole('heading', { name: 'This fare is no longer available.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See current fares' })).toHaveAttribute(
      'href',
      `/search${PARAMS}`,
    );
  });

  it('turns a link to a forgotten search into a refresh, not a dead end', async () => {
    mockApi({ '/health': () => HEALTH, [`/api/v1/search/${SEARCH_ID}`]: () => failure(404, 'NOT_FOUND') });
    renderRoute(PATH);
    expect(await screen.findByRole('heading', { name: 'This offer may have changed.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See current fares' })).toHaveAttribute(
      'href',
      `/search${PARAMS}`,
    );
  });

  it('keeps retrying in the traveller’s hands when the price check fails', async () => {
    mockApi({
      '/health': () => HEALTH,
      [`/api/v1/search/${SEARCH_ID}`]: () => search,
      '/api/v1/offers/price': () => failure(502, 'FLIGHT_PROVIDER_UNAVAILABLE'),
    });
    renderRoute(PATH);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("We couldn't confirm this price right now.");
    expect(within(alert).getByRole('button', { name: 'Check price again' })).toBeInTheDocument();
  });
});
