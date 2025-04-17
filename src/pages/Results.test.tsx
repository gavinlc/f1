import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Results } from './Results';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getRaceResults: vi.fn(),
    getSingleRaceResult: vi.fn(),
    getSprintResults: vi.fn(),
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

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getRaceResults).mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProviders(<Results />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    vi.mocked(f1Api.getRaceResults).mockRejectedValue(new Error('API Error'));

    renderWithProviders(<Results />);

    // Wait for error message
    const errorMessage = await screen.findByText('Error loading race results');
    expect(errorMessage).toBeDefined();
  });

  test('displays race cards when data is loaded', async () => {
    // Mock the API response for basic race information
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2025',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2025-03-02',
              time: '15:00:00Z',
              url: 'http://example.com/bahrain-gp',
              Circuit: {
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
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces);

    renderWithProviders(<Results />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if race card is rendered
    expect(screen.getByText('Bahrain Grand Prix')).toBeDefined();
  });
});
