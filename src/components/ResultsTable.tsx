import { type RaceResult } from '../types/f1';

interface ResultsTableProps {
  results: RaceResult[];
  title: string;
}

export function ResultsTable({ results, title }: ResultsTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time/Gap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {results.map((result) => (
              <tr key={result.Driver.driverId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Driver.givenName} {result.Driver.familyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Constructor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.Time?.time || result.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
