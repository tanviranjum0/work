import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import fixture from '../../../test/fixtures/search-dac-lhr.json';
import { HEALTH, mockApi, renderRoute } from '../../../test/render';

const URL = '/search?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy';

describe('ResultsPage', () => {
  it('restores the search from the URL, shows results, and discloses demo data', async () => {
    const fetchMock = mockApi({ '/health': () => HEALTH, '/api/v1/search/flights': () => fixture });
    renderRoute(URL);

    expect(await screen.findByRole('heading', { level: 1, name: 'Dhaka to London' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '5 itineraries' })).toBeInTheDocument();
    expect(screen.getByText(/Sample data for demonstration/)).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);

    const body = JSON.parse(
      String(fetchMock.mock.calls.find((c) => String(c[0]).includes('/search/flights'))?.[1]?.body),
    );
    expect(body.journeys).toEqual([{ origin: 'DAC', destination: 'LHR', departureDate: '2026-12-22' }]);
  });

  it('filters through the URL and reports what is hidden', async () => {
    mockApi({ '/health': () => HEALTH, '/api/v1/search/flights': () => fixture });
    const router = renderRoute(URL);
    await screen.findByRole('heading', { name: '5 itineraries' });
    const user = userEvent.setup();

    const rail = screen.getByRole('complementary', { name: 'Filters' });
    await user.click(within(rail).getByRole('checkbox', { name: /Nonstop/ }));
    await waitFor(() => expect(router.state.location.search).toContain('stops=0'));
    expect(screen.getByRole('heading', { name: '1 of 5 itineraries' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);

    await user.click(within(rail).getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(5));
  });

  it('expands flight details with the timeline and full price breakdown', async () => {
    mockApi({ '/health': () => HEALTH, '/api/v1/search/flights': () => fixture });
    renderRoute(URL);
    const user = userEvent.setup();
    const [first] = await screen.findAllByRole('button', { name: 'Details' });
    await user.click(first!);
    const breakdown = screen.getByRole('region', { name: 'Price breakdown' });
    expect(within(breakdown).getByText('Base fare')).toBeInTheDocument();
    expect(within(breakdown).getByText('Taxes')).toBeInTheDocument();
    expect(within(breakdown).getByText('Total')).toBeInTheDocument();
    expect(within(breakdown).getByText(/^\$[\d,.]+ each$/)).toBeInTheDocument();
  });

  it('shows a specific, retryable error with a support reference', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { code: 'FLIGHT_PROVIDER_TIMEOUT', message: 'x', requestId: 'req-abcdef123' },
          }),
          { status: 502, headers: { 'content-type': 'application/json' } },
        ),
    });
    renderRoute(URL);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Flight search took too long. Your search is saved, so try again.');
    expect(within(alert).getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(within(alert).getByText('req-abcd')).toBeInTheDocument();
  });

  it('offers nearby dates when nothing flies', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () => ({ ...fixture, offers: [], totalOffers: 0 }),
    });
    renderRoute(URL);
    expect(
      await screen.findByRole('heading', { name: 'No flights on this route for these dates.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Search a day later' })).toHaveAttribute(
      'href',
      expect.stringContaining('depart=2026-12-23'),
    );
  });

  it('turns an invalid link into an editable search instead of crashing', async () => {
    const fetchMock = mockApi({ '/health': () => HEALTH });
    renderRoute('/search?trip=oneway&from=DAC&to=DAC&depart=nope');
    expect(
      await screen.findByRole('heading', { name: 'This search link is incomplete.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search flights' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('/search/flights'))).toBe(false);
  });

  it('shows nearby-date prices that keep the current filters', async () => {
    const cell = (offsetDays: number, date: string, status: string, amountMinor: number | null) => ({
      offsetDays,
      departureDates: [date],
      status,
      lowestTotal: amountMinor === null ? null : { amountMinor, currency: 'USD' },
    });
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () => fixture,
      '/api/v1/search/flexible': () => ({
        supported: true,
        currency: 'USD',
        dataOrigin: 'demo',
        cells: [
          cell(-3, '2026-12-19', 'ok', 90000),
          cell(-2, '2026-12-20', 'no_flights', null),
          cell(-1, '2026-12-21', 'unavailable', null),
          cell(0, '2026-12-22', 'ok', 95100),
          cell(1, '2026-12-23', 'ok', 81000),
          cell(2, '2026-12-24', 'ok', 99000),
          cell(3, '2026-12-25', 'ok', 88000),
        ],
      }),
    });
    renderRoute(`${URL}&stops=0`);
    const nav = await screen.findByRole('navigation', { name: 'Nearby dates' });
    await waitFor(() => expect(within(nav).getAllByRole('listitem')).toHaveLength(7));
    expect(within(nav).getByLabelText(/Tue 22 Dec: \$951/)).toHaveAttribute('aria-current', 'page');
    const cheapest = within(nav).getByRole('link', { name: /Wed 23 Dec: \$810, lowest/ });
    expect(cheapest.getAttribute('href')).toContain('depart=2026-12-23');
    expect(cheapest.getAttribute('href')).toContain('stops=0');
    expect(within(nav).getByRole('link', { name: /Sun 20 Dec: No flights/ })).toBeInTheDocument();
  });

  it('hides nearby dates when the supplier does not support them', async () => {
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/search/flights': () => fixture,
      '/api/v1/search/flexible': () => ({ supported: false, currency: 'USD', dataOrigin: null, cells: [] }),
    });
    renderRoute(URL);
    await screen.findByRole('heading', { name: '5 itineraries' });
    await waitFor(() =>
      expect(screen.queryByRole('navigation', { name: 'Nearby dates' })).not.toBeInTheDocument(),
    );
  });
});
