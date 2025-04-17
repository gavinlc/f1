import { Link } from '@tanstack/react-router';
import { CountryFlag } from './CountryFlag';
import type { RaceResult } from '../types/f1';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultsTableProps {
  results: Array<RaceResult>;
  title: string;
  raceDate?: string;
}

export function ResultsTable({ results, title, raceDate }: ResultsTableProps) {
  // Check if the race is in the future
  const isFutureRace = raceDate ? new Date(raceDate) > new Date() : false;
  const hasResults = results.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>

      {isFutureRace ? (
        <div className="p-4 text-center bg-muted rounded-md">
          <p className="text-muted-foreground">
            This race hasn't taken place yet. Please check back after the race.
          </p>
        </div>
      ) : !hasResults ? (
        <div className="p-4 text-center bg-muted rounded-md">
          <p className="text-muted-foreground">
            No results available for this race.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Time/Gap</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.Driver.driverId}>
                <TableCell>{result.position}</TableCell>
                <TableCell>
                  <Link
                    to="/drivers/$driverId"
                    params={{ driverId: result.Driver.driverId }}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <CountryFlag
                      nationality={result.Driver.nationality}
                      className="w-6 h-4"
                    />
                    {result.Driver.givenName} {result.Driver.familyName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to="/constructors/$constructorId"
                    params={{ constructorId: result.Constructor.constructorId }}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <CountryFlag
                      nationality={result.Constructor.nationality}
                      className="w-6 h-4"
                    />
                    {result.Constructor.name}
                  </Link>
                </TableCell>
                <TableCell>{result.Time?.time || result.status}</TableCell>
                <TableCell>{result.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
