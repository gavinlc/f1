import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Header } from './Header';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useMatches: () => [{ pathname: '/' }],
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock the store
vi.mock('@tanstack/react-store', () => ({
  useStore: () => '',
}));

// Mock the sidebar trigger
vi.mock('./ui/sidebar', () => ({
  SidebarTrigger: () => <button>Toggle Sidebar</button>,
}));

describe('Header', () => {
  test('renders header with home breadcrumb', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeDefined();
  });

  test('breadcrumb links have correct hrefs', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  test('should have no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
