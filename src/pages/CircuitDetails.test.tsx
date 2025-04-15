import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from '../router';
import { f1Api } from '../services/f1Api';
import { createTestQueryClient } from '../test/setup';

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getCircuit: vi.fn(),
    getCircuitsForSeason: vi.fn(),
  },
}));

// Mock the CircuitMap component
vi.mock('../components/CircuitMap', () => ({
  CircuitMap: () => <div data-testid="mock-circuit-map">Circuit Map</div>,
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe('CircuitDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock response for all tests
    const defaultMockCircuit = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    // Default mock response for circuits list
    const defaultMockCircuits = {
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

    vi.mocked(f1Api.getCircuit).mockResolvedValue(defaultMockCircuit);
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValue(
      defaultMockCircuits,
    );
  });

  test('renders loading state initially', async () => {
    // Mock the circuits list
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce({
      MRData: {
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'test',
              circuitName: 'Test Circuit',
              url: 'http://example.com/test',
              Location: {
                locality: 'Test',
                country: 'Test',
                lat: '0',
                long: '0',
              },
            },
          ],
        },
      },
    });

    // Override the default mock to simulate loading
    vi.mocked(f1Api.getCircuit).mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Navigate to circuits page
    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for the circuit to appear and click it
    const circuitLink = await screen.findByText('Test Circuit');
    await act(async () => {
      fireEvent.click(circuitLink);
    });

    expect(await screen.findByText('Loading...')).toBeDefined();
  });

  test('renders circuit details when data is loaded', async () => {
    // Mock the circuit details
    const mockCircuit = {
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

    // Set up the mock to return the circuit data for any circuitId
    vi.mocked(f1Api.getCircuit).mockImplementation(() => {
      return Promise.resolve(mockCircuit);
    });

    // Mock the circuits list
    const mockCircuitsList = {
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
    console.log('Mock circuits list:', mockCircuitsList);
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce(
      mockCircuitsList,
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Navigate to circuits page
    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for the circuit to appear and click it
    const circuitLink = await screen.findByText(
      'Bahrain International Circuit',
    );
    console.log('Circuit link found:', circuitLink);
    await act(async () => {
      fireEvent.click(circuitLink);
    });

    // Wait for the loading state to appear and then disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Log the current DOM content
    console.log('Current DOM content:', document.body.innerHTML);

    // Check if the circuit details are rendered
    await waitFor(() => {
      expect(screen.getByText('Circuit Information')).toBeDefined();
      expect(screen.getByText('Sakhir, Bahrain')).toBeDefined();
      expect(screen.getByTestId('mock-circuit-map')).toBeDefined();
      expect(
        screen.getByRole('link', { name: 'Back to Circuits' }),
      ).toBeDefined();
    });
  });

  test('handles circuit not found', async () => {
    // Mock empty API response for circuit details
    const mockCircuit = {
      MRData: {
        CircuitTable: {
          Circuits: [],
        },
      },
    };

    vi.mocked(f1Api.getCircuit).mockResolvedValueOnce(mockCircuit);

    // Mock the circuits list with a nonexistent circuit
    vi.mocked(f1Api.getCircuitsForSeason).mockResolvedValueOnce({
      MRData: {
        CircuitTable: {
          Circuits: [
            {
              circuitId: 'nonexistent',
              circuitName: 'Nonexistent Circuit',
              url: 'http://example.com/nonexistent',
              Location: {
                locality: 'Unknown',
                country: 'Unknown',
                lat: '0',
                long: '0',
              },
            },
          ],
        },
      },
    });

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    // Navigate to circuits page
    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    await act(async () => {
      fireEvent.click(circuitsLink);
    });

    // Wait for the circuit to appear and click it
    const circuitLink = await screen.findByText('Nonexistent Circuit');
    await act(async () => {
      fireEvent.click(circuitLink);
    });

    // Wait for the "not found" message
    const notFoundMessage = await screen.findByText('Circuit not found');
    expect(notFoundMessage).toBeDefined();
  });
});
