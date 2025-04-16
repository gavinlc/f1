import { Outlet } from '@tanstack/react-router';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function Layout() {
  return (
    // <div className="min-h-screen bg-background">
    //   <Header />
    //   <SidebarProvider>
    //     <div className="flex h-[calc(100vh-4rem)]">
    //       <Sidebar />
    //       <main className="flex-1 overflow-y-auto p-6">
    //         <div className="mx-auto max-w-7xl">
    //           <Outlet />
    //         </div>
    //       </main>
    //     </div>
    //   </SidebarProvider>
    // </div>
    <>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
