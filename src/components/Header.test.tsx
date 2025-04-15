import { describe, expect, test } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { axe } from 'vitest-axe';
import { router } from '../router';

describe('Header', () => {
  test('renders header with title', async () => {
    await act(async () => {
      render(<RouterProvider router={router} />);
    });
    expect(screen.getByText('F1 2025 Browser')).toBeDefined();
  });

  test('renders all navigation links', async () => {
    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const expectedLinks = ['Circuits', 'Drivers', 'Constructors', 'Results'];
    expectedLinks.forEach((linkText) => {
      expect(screen.getByRole('link', { name: linkText })).toBeDefined();
    });
  });

  test('navigation links have correct hrefs', async () => {
    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    const links = {
      Circuits: '/circuits',
      Drivers: '/drivers',
      Constructors: '/constructors',
      Results: '/results',
    };

    Object.entries(links).forEach(([text, href]) => {
      const link = screen.getByRole('link', { name: text });
      expect(link.getAttribute('href')).toBe(href);
    });
  });

  test('should have no accessibility violations', async () => {
    const { container } = render(<RouterProvider router={router} />);
    await act(async () => {
      // Wait for any state updates to complete
    });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
