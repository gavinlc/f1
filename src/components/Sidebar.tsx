import { Link, useLocation } from '@tanstack/react-router';
import { CircuitBoard, Flag, Home, Info, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Flag, label: 'Results', path: '/results' },
  { icon: Users, label: 'Drivers', path: '/drivers' },
  { icon: Trophy, label: 'Constructors', path: '/constructors' },
  { icon: CircuitBoard, label: 'Circuits', path: '/circuits' },
];

const secondaryMenuItems = [{ icon: Info, label: 'About', path: '/about' }];

export function Sidebar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState<string>(location.pathname);
  // Update active path when location changes

  useEffect(() => {
    const pathSections = location.pathname.split('/').slice(1);
    setActivePath('/' + pathSections[0]);
  }, [location]);

  return (
    <ShadcnSidebar variant="inset">
      <SidebarHeader className="flex flex-row justify-between items-center border-b py-1.5">
        <h1 className="text-lg font-semibold">F1 Stats</h1>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePath === item.path}
                    className={cn(
                      'w-full',
                      activePath === item.path && 'bg-accent',
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={'about'}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePath === item.path}
                    className={cn(
                      'w-full',
                      activePath === item.path && 'bg-accent',
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
