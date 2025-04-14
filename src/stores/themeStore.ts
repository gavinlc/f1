import { Store } from '@tanstack/store'

type Theme = 'light' | 'dark'

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const themeStore = new Store<ThemeState>({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const newTheme = themeStore.state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    themeStore.setState((state) => ({ ...state, theme: newTheme }))
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme)
    themeStore.setState((state) => ({ ...state, theme }))
  },
}) 