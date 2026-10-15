import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { HEALTH, mockApi, renderRoute } from '../../test/render';

const USER = {
  id: 'u1',
  email: 'amelia@example.com',
  displayName: 'Amelia',
  roles: ['USER'],
  preferences: { currency: 'USD', cabin: 'economy', locale: 'en', maxStops: null, preferredAirlines: [] },
  createdAt: '2026-09-01T00:00:00.000Z',
};

const TRAVELER = {
  id: '11111111-1111-4111-8111-111111111111',
  title: 'ms',
  givenName: 'Amelia',
  middleName: null,
  familyName: 'Earhart',
  dateOfBirth: '1990-07-24',
  gender: null,
  nationality: 'US',
  loyaltyAccounts: [],
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

const signIn = () =>
  sessionStorage.setItem(
    'aeronova.session',
    JSON.stringify({ accessToken: 'token-abc', expiresAt: Date.now() + 3_600_000, user: USER }),
  );

const failure = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

afterEach(() => sessionStorage.clear());

describe('saved travellers', () => {
  it('adds a traveller and sends what the form collected', async () => {
    signIn();
    let stored: unknown[] = [];
    const fetchMock = mockApi({
      '/health': () => HEALTH,
      '/api/v1/travelers': (_url, init) => {
        if (init?.method === 'POST') {
          stored = [TRAVELER];
          return TRAVELER;
        }
        return stored;
      },
    });
    renderRoute('/account/travelers');
    const user = userEvent.setup();

    expect(await screen.findByText('No saved travellers yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add traveller' }));
    await user.type(screen.getByLabelText('First name'), 'Amelia');
    await user.type(screen.getByLabelText('Last name'), 'Earhart');
    await user.type(screen.getByLabelText('Date of birth'), '1990-07-24');
    await user.type(screen.getByLabelText('Nationality (2-letter code)'), 'us');
    await user.click(screen.getByRole('button', { name: 'Save traveller' }));

    await waitFor(() => expect(screen.getByText('Amelia Earhart')).toBeInTheDocument());
    const post = fetchMock.mock.calls.find((c) => c[1]?.method === 'POST');
    expect(JSON.parse(String(post?.[1]?.body))).toMatchObject({
      givenName: 'Amelia',
      familyName: 'Earhart',
      dateOfBirth: '1990-07-24',
      nationality: 'US',
    });
    // The form never offers to store identity documents.
    expect(screen.queryByLabelText(/passport/i)).not.toBeInTheDocument();
  });

  it('shows the field message from the server when details are rejected', async () => {
    signIn();
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/travelers': (_url, init) =>
        init?.method === 'POST'
          ? failure(400, {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Some details need attention.',
                requestId: 'r1',
                issues: [{ path: 'dateOfBirth', message: 'Date of birth is in the future.' }],
              },
            })
          : [],
    });
    renderRoute('/account/travelers');
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: 'Add traveller' }));
    await user.type(screen.getByLabelText('First name'), 'Future');
    await user.type(screen.getByLabelText('Last name'), 'Person');
    await user.type(screen.getByLabelText('Date of birth'), '2099-01-01');
    await user.click(screen.getByRole('button', { name: 'Save traveller' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Date of birth is in the future.');
    // The form stays open with what was typed, so nothing has to be re-entered.
    expect(screen.getByLabelText('First name')).toHaveValue('Future');
  });

  it('removes a traveller and refreshes the list', async () => {
    signIn();
    let list = [TRAVELER];
    mockApi({
      '/health': () => HEALTH,
      '/api/v1/travelers': (_url, init) => {
        if (init?.method === 'DELETE') {
          list = [];
          return new Response(null, { status: 204 });
        }
        return list;
      },
    });
    renderRoute('/account/travelers');
    const user = userEvent.setup();
    const row = (await screen.findByText('Amelia Earhart')).closest('li') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: 'Remove' }));
    // Removal asks for confirmation in the page, not in a browser dialog.
    expect(within(row).getByText('Remove Amelia Earhart from saved travellers?')).toBeInTheDocument();
    await user.click(within(row).getByRole('button', { name: 'Remove traveller' }));
    await waitFor(() => expect(screen.getByText('No saved travellers yet.')).toBeInTheDocument());
  });
});

describe('profile preferences', () => {
  it('saves preferences and keeps the signed-in name in step', async () => {
    signIn();
    const fetchMock = mockApi({
      '/health': () => HEALTH,
      '/api/v1/users/me': (_url, init) =>
        init?.method === 'PATCH'
          ? {
              ...USER,
              displayName: 'Amelia E',
              preferences: { ...USER.preferences, currency: 'BDT', maxStops: 1 },
            }
          : USER,
    });
    renderRoute('/account');
    const user = userEvent.setup();

    const name = await screen.findByLabelText('Name');
    await user.clear(name);
    await user.type(name, 'Amelia E');
    await user.selectOptions(screen.getByLabelText('Currency'), 'BDT');
    await user.selectOptions(screen.getByLabelText('Maximum stops'), 'Up to 1 stop');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Preferences saved.')).toBeInTheDocument();
    const patch = fetchMock.mock.calls.find((c) => c[1]?.method === 'PATCH');
    expect(JSON.parse(String(patch?.[1]?.body))).toEqual({
      displayName: 'Amelia E',
      preferences: { currency: 'BDT', cabin: 'economy', maxStops: 1 },
    });
  });
});
