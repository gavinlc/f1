import '@testing-library/jest-dom';
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

describe('Layout', () => {
  test('renders header', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });
    expect(screen.getByRole('banner')).toBeDefined();
  });

  test('renders main content', async () => {
    await act(async () => {
      renderWithProviders(<RouterProvider router={router} />);
    });
    expect(screen.getByRole('main')).toBeDefined();
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
