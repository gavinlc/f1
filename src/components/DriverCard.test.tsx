import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DriverCard } from './DriverCard';
import type { Driver } from '../types/f1';

// Mock the useAge hook
vi.mock('../hooks/useAge', () => ({
  useAge: () => 26,
}));

// Mock the CountryFlag component
vi.mock('./CountryFlag', () => ({
  CountryFlag: ({ nationality }: { nationality: string }) => (
    <div data-testid={`flag-${nationality}`}>Flag: {nationality}</div>
  ),
}));

describe('DriverCard', () => {
  const mockDriver: Driver = {
    driverId: 'max_verstappen',
    permanentNumber: '1',
    code: 'VER',
    url: 'http://example.com/verstappen',
    givenName: 'Max',
    familyName: 'Verstappen',
    dateOfBirth: '1997-09-30',
    nationality: 'Dutch',
  };

  test('renders driver information correctly', () => {
    render(<DriverCard driver={mockDriver} />);

    // Check driver name
    expect(screen.getByText('Max Verstappen')).toBeDefined();

    // Check driver details
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('VER')).toBeDefined();
    expect(screen.getByText('Dutch')).toBeDefined();
    expect(screen.getByText('26')).toBeDefined();

    // Check flag is rendered
    expect(screen.getByTestId('flag-Dutch')).toBeDefined();
  });

  test('handles missing permanent number', () => {
    const driverWithoutNumber: Driver = {
      ...mockDriver,
      permanentNumber: undefined,
    };

    render(<DriverCard driver={driverWithoutNumber} />);

    expect(screen.getByText('N/A')).toBeDefined();
  });

  test('handles missing driver code', () => {
    const driverWithoutCode: Driver = {
      ...mockDriver,
      code: undefined,
    };

    render(<DriverCard driver={driverWithoutCode} />);

    expect(screen.getByText('N/A')).toBeDefined();
  });

  test('renders all required fields', () => {
    render(<DriverCard driver={mockDriver} />);

    // Check all field labels are present
    expect(screen.getByText('Number:')).toBeDefined();
    expect(screen.getByText('Code:')).toBeDefined();
    expect(screen.getByText('Nationality:')).toBeDefined();
    expect(screen.getByText('Age:')).toBeDefined();
  });
});
