import { Router, createRootRoute, createRoute } from '@tanstack/react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { Circuits } from './pages/Circuits';
import { CircuitDetails } from './pages/CircuitDetails';
import { Drivers } from './pages/Drivers';
import { DriverDetails } from './pages/DriverDetails';
import { Constructors } from './pages/Constructors';
import { ConstructorDetails } from './pages/ConstructorDetails';
import { Results } from './pages/Results';
import { About } from './pages/About';
import { RouterErrorBoundary } from './components/RouterErrorBoundary';

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: RouterErrorBoundary,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const circuitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circuits',
  component: Circuits,
});

const circuitDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circuits/$circuitId',
  component: CircuitDetails,
});

const driversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/drivers',
  component: Drivers,
});

const driverDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/drivers/$driverId',
  component: DriverDetails,
});

const constructorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/constructors',
  component: Constructors,
});

const constructorDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/constructors/$constructorId',
  component: ConstructorDetails,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: Results,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  circuitsRoute,
  circuitDetailsRoute,
  driversRoute,
  driverDetailsRoute,
  constructorsRoute,
  constructorDetailsRoute,
  resultsRoute,
  aboutRoute,
]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
