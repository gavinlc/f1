import { Page } from '../components/Page';

export function About() {
  return (
    <Page>
      <h1 className="text-3xl font-bold mb-4">About F1 2025 Browser</h1>
      <p className="mb-4">
        F1 2025 Browser is a web application that provides information about
        Formula 1 racing. This application uses data from the Ergast API to
        display information about drivers, constructors, circuits, and race
        results.
      </p>
      <p className="mb-4">
        The application is built with React, TypeScript, and TanStack Router. It
        uses Shadcn UI components for a consistent and beautiful user interface.
      </p>
      <h2 className="text-2xl font-bold mb-2">Features</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>View driver and constructor standings</li>
        <li>Browse race results</li>
        <li>Explore circuits</li>
        <li>View driver and constructor information</li>
      </ul>
    </Page>
  );
}
