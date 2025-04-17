import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { themeStore } from '../stores/themeStore';
import { ThemeToggle } from './ThemeToggle';

// Mock the theme store
vi.mock('../stores/themeStore', () => ({
  themeStore: {
    state: {
      theme: 'light',
      toggleTheme: vi.fn(),
    },
    subscribe: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
}));

describe('ThemeToggle', () => {
  test('renders sun icon in light theme', () => {
    // Mock theme store to return light theme
    vi.mocked(themeStore).state.theme = 'light';

    render(<ThemeToggle />);

    // Check sun icon is rendered
    expect(screen.getByTestId('sun-icon')).toBeDefined();
    expect(screen.queryByTestId('moon-icon')).toBeNull();

    // Check accessibility text
    expect(screen.getByText('Toggle theme')).toBeDefined();
  });

  test('renders moon icon in dark theme', () => {
    // Mock theme store to return dark theme
    vi.mocked(themeStore).state.theme = 'dark';

    render(<ThemeToggle />);

    // Check moon icon is rendered
    expect(screen.getByTestId('moon-icon')).toBeDefined();
    expect(screen.queryByTestId('sun-icon')).toBeNull();

    // Check accessibility text
    expect(screen.getByText('Toggle theme')).toBeDefined();
  });

  test('calls toggleTheme when clicked', () => {
    const toggleTheme = vi.fn();
    vi.mocked(themeStore).state.toggleTheme = toggleTheme;

    render(<ThemeToggle />);

    // Click the button
    fireEvent.click(screen.getByRole('button'));

    // Check if toggleTheme was called
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
