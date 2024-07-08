import { create } from "zustand";

type OpenUserState = {
  user?: any;
  isOpen: boolean;
  onOpen: (id: any) => void;
  onClose: () => void;
};

export const useOpenUser = create<OpenUserState>((set) => ({
  user: undefined,
  isOpen: false,
  onOpen: (user: any) => set({ isOpen: true, user }),
  onClose: () => set({ isOpen: false, user: undefined }),
}));
