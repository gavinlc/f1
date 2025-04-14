import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export function Home() {
  const sections = [
    {
      title: 'Circuits',
      description: 'Browse all Formula 1 circuits and their details',
      path: '/circuits',
    },
    {
      title: '2024 Drivers',
      description: 'View current Formula 1 drivers and their information',
      path: '/drivers',
    },
    {
      title: '2024 Constructors',
      description: 'Explore Formula 1 teams and their details',
      path: '/constructors',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to F1 Browser</h1>
      <p className="text-gray-600">
        Explore Formula 1 data from the Ergast API. Browse through circuits,
        drivers, and constructors.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link key={section.path} to={section.path}>
            <Card className="h-full hover:bg-gray-50 transition-colors">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
