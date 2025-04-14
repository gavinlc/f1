import { Router, createRootRoute, createRoute } from '@tanstack/react-router'
import Layout from './components/Layout'
import { Home } from './pages/Home'
import { Circuits } from './pages/Circuits'
import { Drivers } from './pages/Drivers'
import { Constructors } from './pages/Constructors'
import { Results } from './pages/Results'

const rootRoute = createRootRoute({
  component: Layout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const circuitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circuits',
  component: Circuits,
})

const driversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/drivers',
  component: Drivers,
})

const constructorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/constructors',
  component: Constructors,
})

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: Results,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  circuitsRoute,
  driversRoute,
  constructorsRoute,
  resultsRoute,
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
