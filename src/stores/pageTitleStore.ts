import { Store } from '@tanstack/store';

interface DetailsPageTitleState {
  detailsPageTitle: string;
  setDetailsPageTitle: (title: string) => void;
}

export const pageTitleStore = new Store<DetailsPageTitleState>({
  detailsPageTitle: '',
  setDetailsPageTitle: (title: string) => {
    pageTitleStore.setState((state) => ({ ...state, detailsPageTitle: title }));
  },
});
