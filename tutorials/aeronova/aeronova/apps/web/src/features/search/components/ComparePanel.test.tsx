import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import fixture from '../../../test/fixtures/search-dac-lhr.json';
import { HEALTH, mockApi, renderRoute } from '../../../test/render';

const URL = '/search?trip=oneway&from=DAC&to=LHR&depart=2026-12-22&adults=1&cabin=economy';

describe('flight comparison', () => {
  it('compares up to three itineraries from the URL and marks winners in words', async () => {
    mockApi({ '/health': () => HEALTH, '/api/v1/search/flights': () => fixture });
    const router = renderRoute(URL);
    const user = userEvent.setup();
    await screen.findByRole('heading', { name: '5 itineraries' });

    const boxes = screen.getAllByRole('checkbox', { name: 'Compare' });
    expect(screen.queryByRole('button', { name: /^Compare \(/ })).not.toBeInTheDocument();
    await user.click(boxes[0]!);
    expect(screen.getByRole('button', { name: 'Compare (1)' })).toBeDisabled();
    await user.click(boxes[1]!);
    await user.click(boxes[2]!);
    await waitFor(() => expect(router.state.location.search).toMatch(/compare=itn_[a-z0-9]+%2Citn_/));
    // The fourth is blocked, not silently ignored.
    expect(boxes[3]).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Compare (3)' }));
    const dialog = await screen.findByRole('dialog', { name: 'Compare 3 flights' });
    const table = within(dialog).getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(3);
    expect(within(table).getByRole('rowheader', { name: 'Total price' })).toBeInTheDocument();
    expect(within(table).getAllByText('Best').length).toBeGreaterThan(0);
    expect(within(table).getAllByRole('link', { name: 'View fares' })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/flights\/srch_[a-f0-9]{32}\/off_/),
    );

    await user.click(within(table).getAllByRole('button', { name: /Remove .* from comparison/ })[0]!);
    await waitFor(() => expect(within(dialog).getAllByRole('columnheader')).toHaveLength(2));
  });
});
