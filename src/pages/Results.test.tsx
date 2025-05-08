import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';
import { Results } from './Results';
import type { F1ApiResponse, RacesResponseMRData } from '../types/f1';

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
    const mockRaces: F1ApiResponse<RacesResponseMRData> = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2024/results',
        limit: '30',
        offset: '0',
        total: '1',
        RaceTable: {
          Races: [
            {
              season: '2024',
              round: '1',
              url: 'http://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
              raceName: 'Bahrain Grand Prix',
              Circuit: {
                circuitId: 'bahrain',
                url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
                circuitName: 'Bahrain International Circuit',
                Location: {
                  locality: 'Sakhir',
                  country: 'Bahrain',
                  lat: '26.0325',
                  long: '50.5106',
                },
              },
              date: '2024-03-02',
              time: '15:00:00Z',
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
