import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockApi, renderRoute } from '../test/render';

const renderAt = (path: string) => {
  mockApi({ '/health': () => ({ status: 'ok', mode: 'demo', version: 'dev' }) });
  renderRoute(path);
};

describe('routing shell', () => {
  it('renders the landing page with a skip link, one h1 and the demo disclosure', async () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('heading', { level: 1, name: 'Find your next horizon.' })).toBeInTheDocument();
    expect(await screen.findByText(/Demo mode\. Flights and prices are sample data/)).toBeInTheDocument();
    expect(screen.getByText(/Demo bookings are not valid for travel/)).toBeInTheDocument();
  });

  it('renders a helpful 404 inside the shell for unknown paths', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { name: "This page isn't on the map." })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
  });
});
