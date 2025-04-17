import { useMatches } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { pageTitleStore } from '../stores/pageTitleStore';
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
  const detailsPageTitle = useStore(
    pageTitleStore,
    (state) => state.detailsPageTitle,
  );

  // Get the base route name (e.g., "Circuits" from "/circuits")
  const baseRouteName =
    pathname.split('/')[1]?.charAt(0).toUpperCase() +
      pathname.split('/')[1]?.slice(1) || '';

  // Check if we're on a detail page
  const isDetailPage = pathname.split('/').length > 2;

  // Check if we're on the home page
  const isHomePage = pathname === '/' || pathname === '';

  return (
    <header
      className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
      aria-label="Main navigation"
      data-testid="app-header"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {isHomePage ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {baseRouteName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isDetailPage ? (
                    <BreadcrumbLink href={`/${baseRouteName.toLowerCase()}`}>
                      {baseRouteName}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{baseRouteName}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {detailsPageTitle && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{detailsPageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
