import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../lib/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('is a keyboard-operable radio group that applies and remembers the theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByRole('group', { name: 'Colour theme' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Match system' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'Night' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('aeronova.theme')).toBe('dark');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Match system' })).toBeChecked();
    expect(localStorage.getItem('aeronova.theme')).toBeNull();
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
