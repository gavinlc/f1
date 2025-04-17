import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { axe } from 'vitest-axe';
import { router } from '../router';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getDriverStandings: vi.fn(),
    getConstructorStandings: vi.fn(),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock responses
    const defaultMockStandings = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2025/driverstandings.json',
        limit: '30',
        offset: '0',
        total: '20',
        StandingsTable: {
          season: '2025',
          round: '1',
          StandingsLists: [
            {
              season: '2025',
              round: '1',
              DriverStandings: [],
              ConstructorStandings: [],
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getDriverStandings).mockResolvedValue(defaultMockStandings);
    vi.mocked(f1Api.getConstructorStandings).mockResolvedValue(
      defaultMockStandings,
    );
  });

  test('renders welcome header', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    expect(screen.getByText('Welcome to F1 Browser')).toBeDefined();
    expect(
      screen.getByText(
        'Explore Formula 1 data from the Ergast API. Browse through circuits, drivers, constructors, and race results.',
      ),
    ).toBeDefined();
  });

  test('renders loading skeletons initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getDriverStandings).mockImplementation(
      () => new Promise(() => {}),
    );
    vi.mocked(f1Api.getConstructorStandings).mockImplementation(
      () => new Promise(() => {}),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Check for skeleton elements
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(4); // 2 titles + 2 tables
  });

  test('renders error states when API calls fail', async () => {
    // Mock API errors
    vi.mocked(f1Api.getDriverStandings).mockRejectedValue(
      new Error('Driver standings error'),
    );
    vi.mocked(f1Api.getConstructorStandings).mockRejectedValue(
      new Error('Constructor standings error'),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    expect(screen.getByText('Failed to load driver standings')).toBeDefined();
    expect(
      screen.getByText('Failed to load constructor standings'),
    ).toBeDefined();
  });

  test('renders standings tables when data is loaded', async () => {
    // Mock successful API responses with sample data
    const mockStandings = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2025/driverstandings.json',
        limit: '30',
        offset: '0',
        total: '20',
        StandingsTable: {
          season: '2025',
          round: '1',
          StandingsLists: [
            {
              season: '2025',
              round: '1',
              DriverStandings: [
                {
                  position: '1',
                  positionText: '1',
                  points: '100',
                  wins: '5',
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
                  Constructors: [
                    {
                      constructorId: 'red_bull',
                      url: 'http://example.com/red-bull',
                      name: 'Red Bull Racing',
                      nationality: 'Austrian',
                    },
                  ],
                },
              ],
              ConstructorStandings: [
                {
                  position: '1',
                  positionText: '1',
                  points: '200',
                  wins: '10',
                  Constructor: {
                    constructorId: 'red_bull',
                    url: 'http://example.com/red-bull',
                    name: 'Red Bull Racing',
                    nationality: 'Austrian',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getDriverStandings).mockResolvedValue(mockStandings);
    vi.mocked(f1Api.getConstructorStandings).mockResolvedValue(mockStandings);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Check for standings titles
    expect(screen.getByText('Driver Standings')).toBeDefined();
    expect(screen.getByText('Constructor Standings')).toBeDefined();

    // Check for driver data
    expect(screen.getByText('Max Verstappen')).toBeDefined();
    expect(screen.getByText('Red Bull Racing')).toBeDefined();
  });

  test('renders navigation cards', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Check card titles using test IDs
    expect(screen.getByTestId('2025 results-card-title')).toHaveTextContent(
      '2025 Results',
    );
    expect(screen.getByTestId('2025 circuits-card-title')).toHaveTextContent(
      '2025 Circuits',
    );
    expect(screen.getByTestId('2025 drivers-card-title')).toHaveTextContent(
      '2025 Drivers',
    );
    expect(
      screen.getByTestId('2025 constructors-card-title'),
    ).toHaveTextContent('2025 Constructors');

    // Check card descriptions
    expect(
      screen.getByText('View race results and standings for the 2025 season'),
    ).toBeDefined();
    expect(
      screen.getByText('Browse Formula 1 circuits used in the 2025 season'),
    ).toBeDefined();
    expect(
      screen.getByText('View current Formula 1 drivers and their information'),
    ).toBeDefined();
    expect(
      screen.getByText('Explore Formula 1 teams and their details'),
    ).toBeDefined();
  });

  test('should have no accessibility violations', async () => {
    const { container } = renderWithProviders(
      <RouterProvider router={router} />,
    );
    await act(async () => {
      // Wait for any state updates to complete
    });
    const results = await axe(container);

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log(
        'Accessibility violations:',
        JSON.stringify(results.violations, null, 2),
      );
    }

    expect(results.violations).toHaveLength(0);
  });
});
