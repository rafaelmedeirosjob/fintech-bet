import { create } from "zustand";

type OpenFeesState = {
  id?: string;
  isOpen: boolean;
  onOpenFees: (id?: string) => void;
  onCloseFees: () => void;
};

export const useOpenFees = create<OpenFeesState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenFees: (id?: string) => set({ isOpen: true, id }),
  onCloseFees: () => set({ isOpen: false, id: undefined }),
}));
