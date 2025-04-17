import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RouterErrorBoundary } from './RouterErrorBoundary';

// Mock window.location.reload
const mockReload = vi.fn();
vi.stubGlobal('location', { reload: mockReload });

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('RouterErrorBoundary', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  test('renders routing error UI correctly', () => {
    const routingError = new Error('Failed to load route /invalid-path');

    render(<RouterErrorBoundary error={routingError} />);

    // Check error UI elements using test IDs
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Navigation Error',
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'There was a problem with the page navigation',
    );
    expect(screen.getByTestId('refresh-button')).toHaveTextContent(
      'Refresh page',
    );
    expect(screen.getByTestId('home-button')).toHaveTextContent('Go home');
  });

  test('renders general error UI correctly', () => {
    const generalError = new Error('Something went wrong');

    render(<RouterErrorBoundary error={generalError} />);

    // Check error UI elements using test IDs
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Something went wrong',
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Something went wrong',
    );
    expect(screen.getByTestId('refresh-button')).toHaveTextContent(
      'Refresh page',
    );
    expect(screen.getByTestId('home-button')).toHaveTextContent('Go home');
  });

  test('handles error without message', () => {
    const errorWithoutMessage = new Error();

    render(<RouterErrorBoundary error={errorWithoutMessage} />);

    // Check default error message using test ID
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'An unexpected error occurred',
    );
  });

  test('reloads page when refresh button is clicked', () => {
    const error = new Error('Test error');

    render(<RouterErrorBoundary error={error} />);

    // Click refresh button using test ID
    fireEvent.click(screen.getByTestId('refresh-button'));

    // Check if reload was called
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test('navigates to home when go home button is clicked', () => {
    const error = new Error('Test error');

    render(<RouterErrorBoundary error={error} />);

    // Click go home button using test ID
    fireEvent.click(screen.getByTestId('home-button'));

    // Check if navigate was called with correct arguments
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  test('identifies routing errors correctly', () => {
    const routingErrors = [
      new Error('Failed to load route /test'),
      new Error('Invalid path /test'),
      new Error('Navigation failed to /test'),
      new Error('Router error occurred'),
    ];

    routingErrors.forEach((error) => {
      const { unmount } = render(<RouterErrorBoundary error={error} />);
      expect(screen.getByTestId('error-title')).toHaveTextContent(
        'Navigation Error',
      );
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'There was a problem with the page navigation',
      );
      unmount(); // Clean up after each iteration
    });
  });

  test('identifies general errors correctly', () => {
    const generalErrors = [
      new Error('API error'),
      new Error('Network error'),
      new Error('Database error'),
    ];

    generalErrors.forEach((error) => {
      const { unmount } = render(<RouterErrorBoundary error={error} />);
      expect(screen.getByTestId('error-title')).toHaveTextContent(
        'Something went wrong',
      );
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        error.message,
      );
      unmount(); // Clean up after each iteration
    });
  });
});
