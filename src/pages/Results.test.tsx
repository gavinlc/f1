import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from '../router';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getRaceResults: vi.fn(),
    getSingleRaceResult: vi.fn(),
    getSprintResults: vi.fn(),
  },
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

    // Default mock response for all tests
    const defaultMockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValue(defaultMockRaces);
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValue(defaultMockRaces);
    vi.mocked(f1Api.getSprintResults).mockResolvedValue(defaultMockRaces);
  });

  test('renders page title', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const resultsLink = screen.getByRole('link', { name: 'Results' });
    await act(async () => {
      fireEvent.click(resultsLink);
    });

    expect(await screen.findByText('2025 F1 Race Results')).toBeDefined();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getRaceResults).mockImplementation(
      () => new Promise(() => {}),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const resultsLink = screen.getByRole('link', { name: 'Results' });
    await act(async () => {
      fireEvent.click(resultsLink);
    });

    expect(await screen.findByText('Loading...')).toBeDefined();
  });

  test('renders race list with sprint and grand prix results when data is loaded', async () => {
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
              Results: [], // Empty results for basic race info
            },
          ],
        },
      },
    };

    // Mock the API response for detailed race results
    const mockRaceResults = {
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
              Results: [
                {
                  number: '1',
                  position: '1',
                  positionText: '1',
                  points: '25',
                  Driver: {
                    driverId: 'max_verstappen',
                    permanentNumber: '1',
                    code: 'VER',
                    url: 'http://example.com/verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    dateOfBirth: '1997-09-30',
                    nationality: 'Dutch',
                  },
                  Constructor: {
                    constructorId: 'red_bull',
                    url: 'http://example.com/red-bull',
                    name: 'Red Bull Racing',
                    nationality: 'Austrian',
                  },
                  grid: '1',
                  laps: '57',
                  status: 'Finished',
                  Time: {
                    millis: '5412000',
                    time: '1:30:12.000',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    // Mock the API response for sprint results
    const mockSprintResults = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2025',
              round: '1',
              raceName: 'Bahrain Sprint',
              date: '2025-03-02',
              time: '10:00:00Z',
              url: 'http://example.com/bahrain-sprint',
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
              Results: [
                {
                  number: '1',
                  position: '1',
                  positionText: '1',
                  points: '8',
                  Driver: {
                    driverId: 'max_verstappen',
                    permanentNumber: '1',
                    code: 'VER',
                    url: 'http://example.com/verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    dateOfBirth: '1997-09-30',
                    nationality: 'Dutch',
                  },
                  Constructor: {
                    constructorId: 'red_bull',
                    url: 'http://example.com/red-bull',
                    name: 'Red Bull Racing',
                    nationality: 'Austrian',
                  },
                  grid: '1',
                  laps: '24',
                  status: 'Finished',
                  Time: {
                    millis: '2280000',
                    time: '38:00.000',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces);
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValueOnce(mockRaceResults);
    vi.mocked(f1Api.getSprintResults).mockResolvedValueOnce(mockSprintResults);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const resultsLink = screen.getByRole('link', { name: 'Results' });
    await act(async () => {
      fireEvent.click(resultsLink);
    });

    // Wait for race data to load
    const raceName = await screen.findByText('Bahrain Grand Prix');
    expect(raceName).toBeDefined();

    // Check race details
    expect(screen.getByText('Bahrain International Circuit')).toBeDefined();

    // Check toggle is present
    expect(screen.getByText('Showing Grand Prix Results')).toBeDefined();

    // Initially shows Grand Prix results
    expect(screen.getByText('Grand Prix Results')).toBeDefined();
    expect(screen.getByText('Max Verstappen')).toBeDefined();
    expect(screen.getByText('Red Bull Racing')).toBeDefined();
    expect(screen.getByText('1:30:12.000')).toBeDefined();
    expect(screen.getByText('25')).toBeDefined();

    // Sprint results should not be visible initially
    expect(screen.queryByText('Sprint Race Results')).toBeNull();

    // Toggle to sprint results
    const toggle = screen.getByRole('switch');
    await act(async () => {
      fireEvent.click(toggle);
    });

    // Now sprint results should be visible
    expect(screen.getByText('Sprint Race Results')).toBeDefined();
    expect(screen.getByText('Max Verstappen')).toBeDefined();
    expect(screen.getByText('Red Bull Racing')).toBeDefined();
    expect(screen.getByText('38:00.000')).toBeDefined();
    expect(screen.getByText('8')).toBeDefined();

    // Grand Prix results should not be visible
    expect(screen.queryByText('Grand Prix Results')).toBeNull();
  });

  test('handles empty race list', async () => {
    // Mock empty API response
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces);
    vi.mocked(f1Api.getSingleRaceResult).mockResolvedValueOnce(mockRaces);
    vi.mocked(f1Api.getSprintResults).mockResolvedValueOnce(mockRaces);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const resultsLink = screen.getByRole('link', { name: 'Results' });
    await act(async () => {
      fireEvent.click(resultsLink);
    });

    // Wait for loading to finish
    const title = await screen.findByText('2025 F1 Race Results');
    expect(title).toBeDefined();

    // Verify no races are rendered
    expect(
      screen.getByText('No race results available yet for the 2025 season.'),
    ).toBeDefined();
  });
});
