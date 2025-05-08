import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Drivers } from './Drivers';
import type { DriversResponseMRData, F1ApiResponse } from '../types/f1';

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

const mockDrivers: F1ApiResponse<DriversResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/drivers',
    limit: '30',
    offset: '0',
    total: '1',
    DriverTable: {
      Drivers: [
        {
          driverId: 'hamilton',
          permanentNumber: '44',
          code: 'HAM',
          url: 'http://en.wikipedia.org/wiki/Lewis_Hamilton',
          givenName: 'Lewis',
          familyName: 'Hamilton',
          dateOfBirth: '1985-01-07',
          nationality: 'British',
        },
      ],
    },
  },
};

const mockEmptyDrivers: F1ApiResponse<DriversResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/drivers',
    limit: '30',
    offset: '0',
    total: '0',
    DriverTable: {
      Drivers: [],
    },
  },
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
    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockDrivers);

    renderWithProviders(<Drivers />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Check if the driver details are rendered
    expect(screen.getByText('Lewis Hamilton (HAM)')).toBeDefined();
    expect(screen.getByText(/British/)).toBeDefined();
    expect(screen.getByText(/26/)).toBeDefined(); // Age from mocked useAge hook
    expect(screen.getByText(/HAM/)).toBeDefined();
  });

  test('handles empty driver list', async () => {
    // Mock empty API response
    vi.mocked(f1Api.getDrivers).mockResolvedValueOnce(mockEmptyDrivers);

    renderWithProviders(<Drivers />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    // Verify no drivers are rendered
    expect(screen.queryByText(/Hamilton/)).toBeNull();
  });
});
