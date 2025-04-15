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
  },
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

    // Default mock response for all tests
    const defaultMockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValue(defaultMockRaces);
  });

  test('renders page title', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    expect(await screen.findByText('F1 Circuits 2025')).toBeDefined();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getRaceResults).mockImplementation(
      () => new Promise(() => {}),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    expect(await screen.findByText('Loading...')).toBeDefined();
  });

  test('renders circuit list when data is loaded', async () => {
    // Mock the API response
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
            {
              season: '2025',
              round: '2',
              raceName: 'Saudi Arabian Grand Prix',
              date: '2025-03-09',
              time: '20:00:00Z',
              url: 'http://example.com/saudi-gp',
              Circuit: {
                circuitId: 'jeddah',
                circuitName: 'Jeddah Corniche Circuit',
                url: 'http://example.com/jeddah',
                Location: {
                  locality: 'Jeddah',
                  country: 'Saudi Arabia',
                  lat: '21.6319',
                  long: '39.1044',
                },
              },
              Results: [], // Empty results for basic race info
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for circuit data to load
    const circuitName = await screen.findByText(
      'Bahrain International Circuit',
    );
    expect(circuitName).toBeDefined();

    // Check location details
    expect(screen.getByText('Sakhir, Bahrain')).toBeDefined();
    expect(screen.getByText('Jeddah, Saudi Arabia')).toBeDefined();
  });

  test('handles empty circuit list', async () => {
    // Mock empty API response
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [],
        },
      },
    };

    vi.mocked(f1Api.getRaceResults).mockResolvedValueOnce(mockRaces);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for loading to finish
    const title = await screen.findByText('F1 Circuits 2025');
    expect(title).toBeDefined();

    // Verify no circuits are rendered
    expect(screen.queryByText(/Location:/)).toBeNull();
  });
});
