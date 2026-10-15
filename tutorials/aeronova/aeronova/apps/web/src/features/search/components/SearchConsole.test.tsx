import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HEALTH, mockApi, renderRoute } from '../../../test/render';

describe('SearchConsole on the landing page', () => {
  it('shows field errors instead of searching when the form is incomplete', async () => {
    mockApi({ '/health': () => HEALTH });
    const router = renderRoute('/');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Search flights' }));
    expect(await screen.findByText(/Fix \d+ fields to search/)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('switches trip types and adds multi-city flights', async () => {
    mockApi({ '/health': () => HEALTH });
    renderRoute('/');
    const user = userEvent.setup();
    expect(screen.getByLabelText('Return')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'One way' }));
    expect(screen.queryByLabelText('Return')).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Multi-city' }));
    expect(screen.getAllByRole('combobox', { name: 'From' })).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Add another flight' }));
    expect(screen.getAllByRole('combobox', { name: 'From' })).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Remove flight 3' }));
    await waitFor(() => expect(screen.getAllByRole('combobox', { name: 'From' })).toHaveLength(2));
  });
});
