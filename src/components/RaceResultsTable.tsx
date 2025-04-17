import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { Driver, Race, RaceResult } from '../types/f1';

interface RaceResultsTableProps {
  races: Array<Race>;
  results: Array<{ round: string; Results: Array<RaceResult> }>;
  sprintResults?: Array<{ round: string; Results: Array<RaceResult> }>;
  drivers: Array<Driver>;
  viewMode: 'driver' | 'constructor';
}

export function RaceResultsTable({
  races,
  results,
  sprintResults,
  drivers,
  viewMode,
}: RaceResultsTableProps) {
  // Create a map of race results for quick lookup
  const resultsMap = new Map();
  results.forEach((race) => {
    resultsMap.set(race.round, race);
  });

  // Create a map of sprint results for quick lookup
  const sprintResultsMap = new Map();
  sprintResults?.forEach((race) => {
    sprintResultsMap.set(race.round, race);
  });

  if (viewMode === 'driver') {
    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Race</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Grid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => {
              const raceResult = resultsMap.get(race.round);
              const sprintResult = sprintResultsMap.get(race.round);
              const result = raceResult?.Results?.[0];
              const sprint = sprintResult?.Results?.find(
                (r: RaceResult) => r.Driver.driverId === drivers[0].driverId,
              );

              // Check if the race has already happened
              const raceDate = new Date(race.date);
              const today = new Date();
              const isUpcoming = raceDate > today;

              return (
                <React.Fragment key={`${race.round}-container`}>
                  <TableRow key={`${race.round}-race`}>
                    <TableCell className="font-medium">
                      {race.raceName}
                    </TableCell>
                    <TableCell>
                      {new Date(race.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {isUpcoming ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : result ? (
                        <span className="font-medium">P{result.position}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isUpcoming ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : result ? (
                        <span>{result.points}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isUpcoming ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : result ? (
                        <span>{result.grid}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isUpcoming ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : result ? (
                        <span>{result.status}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {sprint && (
                    <TableRow
                      key={`${race.round}-sprint`}
                      className="bg-muted/50"
                    >
                      <TableCell className="font-medium pl-8">
                        Sprint Race
                      </TableCell>
                      <TableCell>
                        {new Date(race.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">P{sprint.position}</span>
                      </TableCell>
                      <TableCell>
                        <span>{sprint.points}</span>
                      </TableCell>
                      <TableCell>
                        <span>{sprint.grid}</span>
                      </TableCell>
                      <TableCell>
                        <span>{sprint.status}</span>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Constructor view mode
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10">
              Race
            </TableHead>
            <TableHead>Date</TableHead>
            {drivers.map((driver) => (
              <TableHead key={driver.driverId} className="min-w-[120px]">
                <Link
                  to="/drivers/$driverId"
                  params={{ driverId: driver.driverId }}
                  className="flex flex-col hover:underline"
                >
                  <span className="font-medium">
                    {driver.givenName} {driver.familyName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{driver.permanentNumber}
                  </span>
                </Link>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {races.map((race) => {
            const raceResult = resultsMap.get(race.round);
            const sprintResult = sprintResultsMap.get(race.round);

            // Check if the race has already happened
            const raceDate = new Date(race.date);
            const today = new Date();
            const isUpcoming = raceDate > today;

            return (
              <TableRow key={race.round}>
                <TableCell className="sticky left-0 bg-background font-medium">
                  {race.raceName}
                </TableCell>
                <TableCell>
                  {new Date(race.date).toLocaleDateString()}
                </TableCell>
                {drivers.map((driver) => {
                  const result = raceResult?.Results?.find(
                    (r: RaceResult) => r.Driver.driverId === driver.driverId,
                  );
                  const sprint = sprintResult?.Results?.find(
                    (r: RaceResult) => r.Driver.driverId === driver.driverId,
                  );

                  return (
                    <TableCell key={`${race.round}-${driver.driverId}`}>
                      {isUpcoming ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : result ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            P{result.position}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.points} pts
                          </span>
                          {sprint && (
                            <span className="text-xs text-muted-foreground">
                              Sprint: P{sprint.position} ({sprint.points} pts)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
