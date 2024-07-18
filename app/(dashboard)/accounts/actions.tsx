"use client";

import { Edit, MoreHorizontal, KeyRoundIcon, ReceiptCentIcon, BadgeXIcon, QrCodeIcon } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useActivePixAccount } from "@/features/accounts/api/use-active-pix-account";
import { useOpenPayQrCodeHomeAccount } from "@/features/accounts/hooks/use-open-account-qr-code";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useOpenWithdrawZero } from "@/features/accounts/hooks/use-open-withdraw-zero";


type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Você realmente quer ativar a chave pix para esta conta?",
    "A chave tem duração de 1 hora."
  );

  const activePixMutation = useActivePixAccount(id);
  const { onOpen } = useOpenAccount();
  const { onOpenQrCode } = useOpenPayQrCodeHomeAccount();
  const { onOpenWithdrawZero } = useOpenWithdrawZero();

  const handleactivePix = async () => {
    const ok = await confirm();

    if (ok) {
      activePixMutation.mutate({accountId: id});
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={activePixMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
              disabled={activePixMutation.isPending}
              onClick={handleactivePix}
          >
            <KeyRoundIcon className="size-4 mr-2" />
            Ativar chave pix
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpenQrCode(id)}
          >
            <QrCodeIcon className="size-4 mr-2" />
            Pagar QR Code da casa 
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpenWithdrawZero(id)}
          >
            <BadgeXIcon className="size-4 mr-2" />
            Solicitar saque taxa zero
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
