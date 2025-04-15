import { describe, expect, test } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import App from './App.tsx';

describe('App', () => {
  test('renders', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Welcome to F1 2024 Browser')).toBeDefined();
  });
});
