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
    getCircuits: vi.fn(),
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

    vi.mocked(f1Api.getCircuits).mockResolvedValue(defaultMockCircuits);
  });

  test('renders page title', async () => {
    act(() => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    act(() => {
      fireEvent.click(circuitsLink);
    });

    expect(await screen.findByText('F1 Circuits')).toBeDefined();
  });

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getCircuits).mockImplementation(
      () => new Promise(() => {}),
    );

    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    act(() => {
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
              circuitId: 'albert_park',
              circuitName: 'Albert Park Circuit',
              url: 'http://example.com/albert_park',
              Location: {
                locality: 'Melbourne',
                country: 'Australia',
                lat: '-37.8497',
                long: '144.9687',
              },
            },
          ],
        },
      },
    };

    vi.mocked(f1Api.getCircuits).mockResolvedValueOnce(mockCircuits);

    act(() => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    act(() => {
      fireEvent.click(circuitsLink);
    });

    // Wait for circuit data to load
    const circuitName = await screen.findByText('Albert Park Circuit');
    expect(circuitName).toBeDefined();

    // Check location details
    expect(screen.getByText('Melbourne, Australia')).toBeDefined();
    expect(screen.getByText('-37.8497, 144.9687')).toBeDefined();
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

    vi.mocked(f1Api.getCircuits).mockResolvedValueOnce(mockCircuits);

    act(() => {
      renderWithProviders(<RouterProvider router={router} />);
    });

    const circuitsLink = screen.getByRole('link', { name: 'Circuits' });
    act(() => {
      fireEvent.click(circuitsLink);
    });

    // Wait for loading to finish
    const title = await screen.findByText('F1 Circuits');
    expect(title).toBeDefined();

    // Verify no circuits are rendered
    expect(screen.queryByText(/Location:/)).toBeNull();
  });
});
