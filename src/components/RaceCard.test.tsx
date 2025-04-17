import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RaceCard } from './RaceCard';
import type { Race, RaceResult } from '../types/f1';

// Mock the ResultsTable component
vi.mock('./ResultsTable', () => ({
  ResultsTable: ({
    title,
    results,
  }: {
    title: string;
    results: Array<RaceResult>;
  }) => (
    <div>
      <h3>{title}</h3>
      {results.length === 0 ? (
        <div className="p-4 text-center bg-muted rounded-md">
          <p className="text-muted-foreground">
            No results available for this race.
          </p>
        </div>
      ) : (
        <div>Results: {results.length}</div>
      )}
    </div>
  ),
}));

describe('RaceCard', () => {
  const mockRace: Race = {
    season: '2024',
    round: '1',
    url: 'http://example.com/bahrain-gp',
    raceName: 'Bahrain Grand Prix',
    Circuit: {
      circuitId: 'bahrain',
      circuitName: 'Bahrain International Circuit',
      url: 'http://example.com/bahrain',
      Location: {
        locality: 'Sakhir',
        country: 'Bahrain',
        lat: '26.0325',
        long: '50.5106',
      },
    },
    date: '2024-03-02',
    time: '15:00:00Z',
  };

  const mockRaceResults: Array<RaceResult> = [
    {
      number: '1',
      position: '1',
      positionText: '1',
      points: '25',
      Driver: {
        driverId: 'max_verstappen',
        permanentNumber: '1',
        code: 'VER',
        url: 'http://example.com/verstappen',
        givenName: 'Max',
        familyName: 'Verstappen',
        dateOfBirth: '1997-09-30',
        nationality: 'Dutch',
      },
      Constructor: {
        constructorId: 'red_bull',
        url: 'http://example.com/red-bull',
        name: 'Red Bull Racing',
        nationality: 'Austrian',
      },
      grid: '1',
      laps: '57',
      status: 'Finished',
      Time: {
        millis: '5412000',
        time: '1:30:12.000',
      },
    },
  ];

  const mockSprintResults: Array<RaceResult> = [
    {
      number: '1',
      position: '1',
      positionText: '1',
      points: '8',
      Driver: {
        driverId: 'max_verstappen',
        permanentNumber: '1',
        code: 'VER',
        url: 'http://example.com/verstappen',
        givenName: 'Max',
        familyName: 'Verstappen',
        dateOfBirth: '1997-09-30',
        nationality: 'Dutch',
      },
      Constructor: {
        constructorId: 'red_bull',
        url: 'http://example.com/red-bull',
        name: 'Red Bull Racing',
        nationality: 'Austrian',
      },
      grid: '1',
      laps: '24',
      status: 'Finished',
      Time: {
        millis: '2280000',
        time: '38:00.000',
      },
    },
  ];

  test('renders race information correctly', () => {
    render(
      <RaceCard
        race={mockRace}
        showSprint={false}
        onSprintToggle={() => {}}
        raceResults={mockRaceResults}
        isLoading={false}
      />,
    );

    // Check race title
    expect(screen.getByText('Bahrain Grand Prix')).toBeDefined();

    // Check race details
    expect(screen.getByText(/3\/2\/2024/)).toBeDefined();
    expect(screen.getByText('Bahrain International Circuit')).toBeDefined();
  });

  test('renders loading state correctly', () => {
    render(
      <RaceCard
        race={mockRace}
        showSprint={false}
        onSprintToggle={() => {}}
        raceResults={mockRaceResults}
        isLoading={true}
      />,
    );

    // Check loading skeletons are rendered
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(5); // 1 title + 4 rows
  });

  test('handles sprint race toggle correctly', async () => {
    const onSprintToggle = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <RaceCard
        race={mockRace}
        showSprint={false}
        onSprintToggle={onSprintToggle}
        sprintResults={mockSprintResults}
        raceResults={mockRaceResults}
        isLoading={false}
      />,
    );

    // Check sprint tab is present
    expect(screen.getByRole('tab', { name: 'Sprint Results' })).toBeDefined();
    expect(
      screen.getByRole('tab', { name: 'Grand Prix Results' }),
    ).toBeDefined();

    // Click sprint tab
    await user.click(screen.getByRole('tab', { name: 'Sprint Results' }));
    expect(onSprintToggle).toHaveBeenCalledWith(true);

    // Rerender with showSprint=true
    rerender(
      <RaceCard
        race={mockRace}
        showSprint={true}
        onSprintToggle={onSprintToggle}
        sprintResults={mockSprintResults}
        raceResults={mockRaceResults}
        isLoading={false}
      />,
    );

    // Click grand prix tab
    await user.click(
      screen.getByRole('tab', { name: 'Grand Prix Results', selected: false }),
    );
    expect(onSprintToggle).toHaveBeenCalledWith(false);
  });

  test('renders race results when no sprint results available', () => {
    render(
      <RaceCard
        race={mockRace}
        showSprint={false}
        onSprintToggle={() => {}}
        raceResults={mockRaceResults}
        isLoading={false}
      />,
    );

    // Check sprint tab is not present
    expect(screen.queryByText('Sprint Results')).toBeNull();

    // Check race results are rendered
    const resultsTable = screen.getByTestId('results-table');
    expect(resultsTable).toBeDefined();
    expect(
      screen.getByText('Grand Prix Results', { selector: 'h3' }),
    ).toBeDefined();
  });

  test('handles missing results gracefully', () => {
    render(
      <RaceCard
        race={mockRace}
        showSprint={false}
        onSprintToggle={() => {}}
        raceResults={[]}
        isLoading={false}
      />,
    );

    // Check empty results message is shown
    expect(
      screen.getByText('No results available for this race.', {
        selector: '.text-muted-foreground',
      }),
    ).toBeDefined();
  });
});
