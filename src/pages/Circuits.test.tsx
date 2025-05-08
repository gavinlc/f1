import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Circuits } from './Circuits';
import type { CircuitsResponseMRData, F1ApiResponse } from '../types/f1';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getCircuitsForSeason: vi.fn(),
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

const mockCircuits: F1ApiResponse<CircuitsResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/circuits',
    limit: '30',
    offset: '0',
    total: '1',
    CircuitTable: {
      Circuits: [
        {
          circuitId: 'monaco',
          circuitName: 'Circuit de Monaco',
          url: 'http://en.wikipedia.org/wiki/Circuit_de_Monaco',
          Location: {
            locality: 'Monte-Carlo',
            country: 'Monaco',
            lat: '43.7347',
            long: '7.42056',
          },
        },
      ],
    },
  },
};

const mockEmptyCircuits: F1ApiResponse<CircuitsResponseMRData> = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024/circuits',
    limit: '30',
    offset: '0',
    total: '0',
    CircuitTable: {
      Circuits: [],
    },
  },
};

describe('Circuits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getCircuitsForSeason).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProviders(<Circuits />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  test('renders circuit list when data is loaded', async () => {
    // Mock the API response
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(mockCircuits);

    renderWithProviders(<Circuits />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the circuit details are rendered
    expect(screen.getByText('Circuit de Monaco')).toBeDefined();
    expect(screen.getByText('Monte-Carlo, Monaco')).toBeDefined();
  });

  test('handles empty circuit list', async () => {
    // Mock empty API response
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(
      mockEmptyCircuits,
    );

    renderWithProviders(<Circuits />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Verify no circuits are rendered
    expect(screen.queryByText(/Circuit de Monaco/)).toBeNull();
  });
});
