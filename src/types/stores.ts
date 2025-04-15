/**
 * Theme type representing the available theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Theme store state interface
 */
export interface ThemeState {
  /** Current theme */
  theme: Theme;
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
  /** Function to set a specific theme */
  setTheme: (theme: Theme) => void;
}
