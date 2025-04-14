import { describe, expect, test } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../router';

describe('Header', () => {
  test('renders header with title', () => {
    act(() => {
      render(<RouterProvider router={router} />);
    });
    expect(screen.getByText('F1 2024 Browser')).toBeDefined();
  });

  test('renders all navigation links', () => {
    act(() => {
      render(<RouterProvider router={router} />);
    });

    const expectedLinks = ['Circuits', 'Drivers', 'Constructors', 'Results'];
    expectedLinks.forEach((linkText) => {
      expect(screen.getByRole('link', { name: linkText })).toBeDefined();
    });
  });

  test('navigation links have correct hrefs', () => {
    act(() => {
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
});
