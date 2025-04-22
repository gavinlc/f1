import { Store } from '@tanstack/store';
import type { DetailsPageTitleState } from '@/types/stores';

export const pageTitleStore = new Store<DetailsPageTitleState>({
  detailsPageTitle: '',
  setDetailsPageTitle: (title: string) => {
    pageTitleStore.setState((state) => ({ ...state, detailsPageTitle: title }));
  },
});
