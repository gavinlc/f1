import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Mock window.location.reload
const mockReload = vi.fn();
vi.stubGlobal('location', { reload: mockReload });

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeDefined();
  });

  test('renders error UI when child component throws', () => {
    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    // Check error UI elements
    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText('Test error')).toBeDefined();
    expect(screen.getByText('Refresh page')).toBeDefined();

    // Restore console.error
    consoleSpy.mockRestore();
  });

  test('renders default error message when error has no message', () => {
    // Component that throws error without message
    const ThrowErrorWithoutMessage = () => {
      throw new Error();
    };

    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorWithoutMessage />
      </ErrorBoundary>,
    );

    // Check default error message
    expect(screen.getByText('An unexpected error occurred')).toBeDefined();

    // Restore console.error
    consoleSpy.mockRestore();
  });

  test('reloads page when refresh button is clicked', () => {
    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    // Click refresh button
    fireEvent.click(screen.getByText('Refresh page'));

    // Check if reload was called
    expect(mockReload).toHaveBeenCalledTimes(1);

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
