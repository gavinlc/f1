import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Circuits } from './Circuits';

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
    const mockCircuits = {
      MRData: {
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'bahrain',
              circuitName: 'Bahrain International Circuit',
              url: 'http://example.com/bahrain',
              Location: {
                locality: 'Sakhir',
                country: 'Bahrain',
                lat: '26.0325',
                long: '50.5106',
              },
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(mockCircuits);

    renderWithProviders(<Circuits />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the circuit details are rendered
    expect(screen.getByText('Bahrain International Circuit')).toBeDefined();
    expect(screen.getByText('Sakhir, Bahrain')).toBeDefined();
  });

  test('handles empty circuit list', async () => {
    // Mock empty API response
    const mockCircuits = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(mockCircuits);

    renderWithProviders(<Circuits />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Verify no circuits are rendered
    expect(screen.queryByText(/Bahrain/)).toBeNull();
  });
});
