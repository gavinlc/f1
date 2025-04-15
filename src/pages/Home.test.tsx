import { describe, expect, test } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { axe } from 'vitest-axe';
import { router } from '../router';
import { createTestQueryClient } from '../test/setup';

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe('Home', () => {
  test('renders welcome message', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });
    expect(screen.getByText('Welcome to F1 2025 Browser')).toBeDefined();
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
    expect(results.violations).toHaveLength(0);
  });
});
