import { Outlet } from '@tanstack/react-router';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function Layout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <main
            className="@container/main flex flex-1 flex-col gap-2"
            role="main"
          >
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
