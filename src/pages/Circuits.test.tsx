import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from '../router';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getCircuitsForSeason: vi.fn(),
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
    const defaultMockCircuits = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValue(
      defaultMockCircuits,
    );
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getCircuitsForSeason).mockImplementation(
      () => new Promise(() => {}),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const circuitsLink = within(sidebar).getByRole('link', {
      name: 'Circuits',
    });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    expect(await screen.findByText('Loading...')).toBeDefined();
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
            {
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
          ],
        },
      },
    };

    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(mockCircuits);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const circuitsLink = within(sidebar).getByRole('link', {
      name: 'Circuits',
    });
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
    const mockCircuits = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(mockCircuits);

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const sidebar = screen.getByRole('complementary', {
      name: 'Sidebar navigation',
    });
    const circuitsLink = within(sidebar).getByRole('link', {
      name: 'Circuits',
    });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for loading to finish
    const loadingText = screen.queryByText('Loading...');
    waitFor(() => expect(loadingText).toBeNull());

    // Verify no circuits are rendered
    expect(screen.queryByText(/Location:/)).toBeNull();
  });
});
