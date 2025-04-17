import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { useMatches } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { Header } from './Header';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useMatches: vi.fn().mockReturnValue([{ pathname: '/somepage' }]),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock the store hook
vi.mock('@tanstack/react-store', () => ({
  useStore: vi.fn().mockReturnValue(''),
}));

// Mock the page title store
vi.mock('../stores/pageTitleStore', () => {
  return {
    pageTitleStore: {
      getState: vi.fn().mockReturnValue({ detailsPageTitle: '' }),
      setState: vi.fn(),
      setDetailsPageTitle: vi.fn(),
    },
  };
});

// Mock the sidebar trigger
vi.mock('./ui/sidebar', () => ({
  SidebarTrigger: () => <button>Toggle Sidebar</button>,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test('renders with details page title when available', () => {
    // Mock the useStore hook to return a title
    vi.mocked(useStore).mockReturnValue('Test Title');

    render(<Header />);

    // Check that the title is displayed
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeDefined();
  });

  test('renders correctly on home page', () => {
    // Mock the router to return home page
    vi.mocked(useMatches).mockReturnValue([{ pathname: '/' }] as any);

    render(<Header />);

    // On home page, "Home" should be a page, not a link
    const homeElement = screen.getByText('Home');
    expect(homeElement.tagName).not.toBe('A');
  });

  test('renders correctly on a section page', () => {
    // Mock the router to return a section page
    vi.mocked(useMatches).mockReturnValue([{ pathname: '/circuits' }] as any);

    render(<Header />);

    // Should show "Circuits" as a page
    const circuitsElement = screen.getByText('Circuits');
    expect(circuitsElement.tagName).not.toBe('A');
  });

  test('renders correctly on a detail page', () => {
    // Mock the router to return a detail page
    vi.mocked(useMatches).mockReturnValue([
      { pathname: '/circuits/monaco' },
    ] as any);

    render(<Header />);

    // Should show "Circuits" as a link
    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    expect(circuitsLink).toBeDefined();
    expect(circuitsLink.getAttribute('href')).toBe('/circuits');
  });
});
