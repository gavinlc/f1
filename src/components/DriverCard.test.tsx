import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DriverCard } from './DriverCard';

// Mock the CountryFlag component
vi.mock('./CountryFlag', () => ({
  CountryFlag: ({ nationality }: { nationality: string }) => (
    <div data-testid="country-flag">{nationality}</div>
  ),
}));

// Mock the useAge hook
vi.mock('../hooks/useAge', () => ({
  useAge: () => 39,
}));

describe('DriverCard', () => {
  const mockDriver = {
    driverId: 'hamilton',
    givenName: 'Lewis',
    familyName: 'Hamilton',
    permanentNumber: '44',
    nationality: 'British',
    dateOfBirth: '1985-01-07',
    url: 'http://example.com/hamilton',
    code: 'HAM',
  };

  it('renders driver information correctly', () => {
    render(<DriverCard driver={mockDriver} />);

    // Check driver name
    expect(screen.getByText('Lewis Hamilton (HAM)')).toBeDefined();

    // Check driver number
    expect(screen.getByText('Driver #44')).toBeDefined();

    // Check nationality
    const nationalityElem = screen.getByTestId('nationality');
    expect(within(nationalityElem).getByText('British')).toBeDefined();

    // Check age
    expect(screen.getByText('39')).toBeDefined();

    // Check country flag is rendered
    expect(screen.getByTestId('country-flag')).toBeDefined();
    expect(screen.getByTestId('country-flag')).toHaveTextContent('British');
  });

  it('renders all required fields', () => {
    render(<DriverCard driver={mockDriver} />);

    // Check all field labels are present
    expect(screen.getByText('Nationality:')).toBeDefined();
    expect(screen.getByText('Age:')).toBeDefined();
  });
});
