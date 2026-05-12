import { create } from 'zustand';

export type ViewName = 'menu' | 'create' | 'game' | 'summary' | 'saves';

interface UiStore {
  currentView: ViewName;
  selectedSaveId: string | null;
  setView: (view: ViewName) => void;
  setSelectedSave: (id: string | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  currentView: 'menu',
  selectedSaveId: null,
  setView: (view) => set({ currentView: view }),
  setSelectedSave: (id) => set({ selectedSaveId: id }),
}));
