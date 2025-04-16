import { useQuery } from '@tanstack/react-query';
import { Link, useMatches } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { f1Api } from '../services/f1Api';
import { pageTitleStore } from '../stores/pageTitleStore';
import { ThemeToggle } from './ThemeToggle';
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function Header() {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const pathname = currentRoute?.pathname || '';
  const pageTitle = useStore(pageTitleStore, (state) => state.title);

  // Get the base route name (e.g., "Circuits" from "/circuits")
  const baseRouteName =
    pathname.split('/')[1]?.charAt(0).toUpperCase() +
      pathname.split('/')[1]?.slice(1) || '';

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {baseRouteName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${baseRouteName.toLowerCase()}`}>
                    {baseRouteName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {pageTitle && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
