import { create } from 'zustand';
import type { FilterState, SortOption } from '@/types/subscription';

interface FilterActions {
  setCategoryFilter: (id: string | null) => void;
  setActiveFilter: (active: boolean | null) => void;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  category_id: null,
  is_active: true,
  search: '',
  sort: 'next_billing',
};

export const useFilterStore = create<FilterState & FilterActions>()((set) => ({
  ...defaultFilters,

  setCategoryFilter: (id: string | null) => {
    set({ category_id: id });
  },

  setActiveFilter: (active: boolean | null) => {
    set({ is_active: active });
  },

  setSearch: (search: string) => {
    set({ search });
  },

  setSort: (sort: SortOption) => {
    set({ sort });
  },

  resetFilters: () => {
    set({ ...defaultFilters });
  },
}));
