import { create } from "zustand";

type OpenAccountQRCodeState = {
  id?: string;
  isOpen: boolean;
  onOpenQrCode: (id: string) => void;
  onCloseQrCode: () => void;
};

export const useOpenPayQrCodeHomeAccount = create<OpenAccountQRCodeState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpenQrCode: (id: string) => set({ isOpen: true, id }),
  onCloseQrCode: () => set({ isOpen: false, id: undefined }),
}));
