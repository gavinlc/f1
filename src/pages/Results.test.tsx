import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

    // Find the Results link in the sidebar menu
    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const resultsLink = within(sidebar).getByRole('link', { name: 'Results' });

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

    // Find the Results link in the sidebar menu
    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const resultsLink = within(sidebar).getByRole('link', { name: 'Results' });

    await act(async () => {
      fireEvent.click(resultsLink);
    });

    expect(await screen.findByText('Loading...')).toBeDefined();
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    vi.mocked(f1Api.getRaceResults).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Find the Results link in the sidebar menu
    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const resultsLink = within(sidebar).getByRole('link', { name: 'Results' });

    await act(async () => {
      fireEvent.click(resultsLink);
    });

    expect(await screen.findByText('Error loading race results')).toBeDefined();
  });

  test('navigates to race details when clicking a race', async () => {
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

    vi.mocked(f1Api.getRaceResults).mockResolvedValue(mockRaces);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Find the Results link in the sidebar menu
    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const resultsLink = within(sidebar).getByRole('link', { name: 'Results' });

    await act(async () => {
      fireEvent.click(resultsLink);
    });

    const raceCard = await screen.findByText('Bahrain Grand Prix');
    await act(async () => {
      fireEvent.click(raceCard);
    });

    // Check if we're on the race details page
    expect(await screen.findByText('Bahrain Grand Prix')).toBeDefined();
  });
});
