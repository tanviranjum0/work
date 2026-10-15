import type { FlightSearchResponse } from '@aeronova/shared';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import fixture from '../../../test/fixtures/search-dac-lhr.json';
import { itineraryAnchor, NO_FILTERS, shapeResults } from '../results-model';
import { PriceTimeChart } from './PriceTimeChart';

const { groups } = shapeResults(fixture as unknown as FlightSearchResponse, {
  filters: NO_FILTERS,
  sort: 'recommended',
  priority: 'balanced',
});

describe('PriceTimeChart', () => {
  it('renders one keyboard-reachable point per itinerary with a spoken label', () => {
    render(<PriceTimeChart groups={groups} />);
    const chart = screen.getByRole('group', { name: 'Price vs travel time' });
    const points = within(chart).getAllByRole('link');
    expect(points).toHaveLength(groups.length);
    expect(points[0]).toHaveAccessibleName(/^.+, \$[\d,]+, \d+h/);
  });

  it('offers the same data as a table, sorted by travel time', () => {
    render(<PriceTimeChart groups={groups} />);
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(groups.length);
    const times = rows.map((r) => within(r).getAllByRole('cell')[0]!.textContent ?? '');
    const toMin = (s: string) => {
      const [, h = '0', m = '0'] = /(\d+)h(?:\s(\d+)m)?/.exec(s.replace(/\u00a0/g, ' ')) ?? [];
      return Number(h) * 60 + Number(m);
    };
    expect(times.map(toMin)).toEqual([...times.map(toMin)].sort((a, b) => a - b));
  });

  it('moves focus to the chosen card and lets a sheet close first', async () => {
    const onPointSelect = vi.fn();
    const target = groups[1]!;
    render(
      <>
        <PriceTimeChart groups={groups} onPointSelect={onPointSelect} />
        <div id={itineraryAnchor(target.lead.offer.itineraryKey)}>
          <article tabIndex={-1} aria-label="target card" />
        </div>
      </>,
    );
    Element.prototype.scrollIntoView = vi.fn();
    const points = within(screen.getByRole('group', { name: 'Price vs travel time' })).getAllByRole('link');
    const link = points.find(
      (a) => a.getAttribute('href') === `#${itineraryAnchor(target.lead.offer.itineraryKey)}`,
    )!;
    await userEvent.click(link);
    expect(onPointSelect).toHaveBeenCalled();
    await vi.waitFor(() => expect(screen.getByRole('article', { name: 'target card' })).toHaveFocus());
  });

  it('renders nothing for fewer than two itineraries', () => {
    const { container } = render(<PriceTimeChart groups={groups.slice(0, 1)} />);
    expect(container).toBeEmptyDOMElement();
  });
});
