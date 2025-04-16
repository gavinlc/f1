import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { ConstructorStanding, DriverStanding } from '../types/f1';

interface StandingsTableProps {
  title: string;
  standings: Array<DriverStanding | ConstructorStanding>;
  type: 'driver' | 'constructor';
}

export function StandingsTable({
  title,
  standings,
  type,
}: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">No standings data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos</TableHead>
              <TableHead>{type === 'driver' ? 'Driver' : 'Team'}</TableHead>
              <TableHead className="w-16">Points</TableHead>
              <TableHead className="w-16">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing) => (
              <TableRow
                key={
                  type === 'driver'
                    ? (standing as DriverStanding).Driver.driverId
                    : (standing as ConstructorStanding).Constructor
                        .constructorId
                }
              >
                <TableCell>{standing.position}</TableCell>
                <TableCell>
                  {type === 'driver'
                    ? `${(standing as DriverStanding).Driver.givenName} ${(standing as DriverStanding).Driver.familyName}`
                    : (standing as ConstructorStanding).Constructor.name}
                </TableCell>
                <TableCell>{standing.points}</TableCell>
                <TableCell>{standing.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
