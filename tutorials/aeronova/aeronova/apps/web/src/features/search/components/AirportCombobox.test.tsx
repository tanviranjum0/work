import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, renderWithProviders } from '../../../test/render';
import { AirportCombobox } from './AirportCombobox';

const SUGGESTIONS = [
  {
    kind: 'city',
    code: 'LON',
    name: 'London (all airports)',
    cityName: 'London',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    timeZone: 'Europe/London',
    airportCodes: ['LHR', 'LGW'],
  },
  {
    kind: 'airport',
    code: 'LHR',
    name: 'Heathrow Airport',
    cityName: 'London',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    timeZone: 'Europe/London',
    airportCodes: ['LHR'],
  },
];

const Harness = () => {
  const [code, setCode] = useState('');
  return (
    <>
      <AirportCombobox label="To" value={code} onChange={setCode} />
      <output data-testid="code">{code}</output>
    </>
  );
};

describe('AirportCombobox', () => {
  it('debounces, needs two characters, and selects with the keyboard', async () => {
    const fetchMock = mockApi({ '/api/v1/airports/search': () => SUGGESTIONS });
    // Only airport searches count: the app shell also loads public client config on mount.
    const searches = () =>
      fetchMock.mock.calls.filter((c) => String(c[0]).includes('/api/v1/airports/search'));
    const user = userEvent.setup();
    renderWithProviders(<Harness />);
    const input = screen.getByRole('combobox', { name: 'To' });

    await user.type(input, 'l');
    await new Promise((r) => setTimeout(r, 400));
    expect(searches()).toHaveLength(0);

    await user.type(input, 'on');
    expect(await screen.findByRole('option', { name: /Heathrow Airport/ })).toBeInTheDocument();
    expect(searches()).toHaveLength(1);
    expect(String(searches()[0]?.[0])).toContain('q=lon');
    expect(input).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(screen.getAllByRole('option')[1]?.id);
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('code')).toHaveTextContent('LHR');
    expect(input).toHaveValue('London (LHR)');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('announces no matches and clears with Escape', async () => {
    mockApi({ '/api/v1/airports/search': () => [] });
    const user = userEvent.setup();
    renderWithProviders(<Harness />);
    const input = screen.getByRole('combobox', { name: 'To' });
    await user.type(input, 'zzz');
    expect(await screen.findByText('No airports match “zzz”.')).toHaveAttribute('role', 'status');
    await user.keyboard('{Escape}{Escape}');
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
