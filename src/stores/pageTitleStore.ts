import { Store } from '@tanstack/store';

interface PageTitleState {
  title: string;
  setTitle: (title: string) => void;
}

export const pageTitleStore = new Store<PageTitleState>({
  title: '',
  setTitle: (title: string) => {
    pageTitleStore.setState((state) => ({ ...state, title }));
  },
});
