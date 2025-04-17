import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Drivers } from './Drivers';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getDrivers: vi.fn(),
  },
}));

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    href,
    children,
    to,
    className,
  }: {
    href?: string;
    to?: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href || to} className={className} role="link">
      {children}
    </a>
  ),
}));

// Mock the useAge hook
vi.mock('../hooks/useAge', () => ({
  useAge: () => 26,
}));

// Mock the pageTitleStore
vi.mock('../stores/pageTitleStore', () => ({
  pageTitleStore: {
    getState: vi.fn().mockReturnValue({
      setPageTitle: vi.fn(),
    }),
  },
}));

// Mock the useStore hook
vi.mock('@tanstack/react-store', () => ({
  useStore: vi.fn().mockReturnValue(vi.fn()),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe('Drivers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getDrivers).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Drivers />);

    expect(screen.getByTestId('skeleton')).toBeDefined();
  });

  test('renders driver list when data is loaded', async () => {
    // Mock the API response
    const mockDrivers = {
      MRData: {
        DriverTable: {
          Drivers: [
            {
              driverId: 'max_verstappen',
              permanentNumber: '1',
              code: 'VER',
              url: 'http://example.com/verstappen',
              givenName: 'Max',
              familyName: 'Verstappen',
              dateOfBirth: '1997-09-30',
              nationality: 'Dutch',
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers);

    renderWithProviders(<Drivers />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Check if the driver details are rendered
    expect(screen.getByText('Max Verstappen (VER)')).toBeDefined();
    expect(screen.getByText(/Dutch/)).toBeDefined();
    expect(screen.getByText(/26/)).toBeDefined(); // Age from mocked useAge hook
    expect(screen.getByText(/VER/)).toBeDefined();
  });

  test('handles empty driver list', async () => {
    // Mock empty API response
    const mockDrivers = {
      MRData: {
        DriverTable: {
          Drivers: [],
        },
      },
    };

    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers);

    renderWithProviders(<Drivers />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Verify no drivers are rendered
    expect(screen.queryByText(/Verstappen/)).toBeNull();
  });
});
