import { create } from "zustand";

type OpenWithdrawZeroState = {
  id?: string;
  isOpen: boolean;
  onOpenWithdrawZero: (id?: string) => void;
  onCloseWithdrawZero: () => void;
};

export const useOpenWithdrawZero = create<OpenWithdrawZeroState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenWithdrawZero: (id?: string) => set({ isOpen: true, id }),
  onCloseWithdrawZero: () => set({ isOpen: false, id: undefined }),
}));
