import { useStore } from '@tanstack/react-store';
import { Moon, Sun } from 'lucide-react';
import { themeStore } from '../stores/themeStore';
import { Button } from './ui/button';

export function ThemeToggle() {
  const theme = useStore(themeStore, (state) => state.theme);
  const toggleTheme = useStore(themeStore, (state) => state.toggleTheme);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-accent hover:text-accent-foreground"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
