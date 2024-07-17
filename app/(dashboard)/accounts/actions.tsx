"use client";

import { Edit, MoreHorizontal, KeyRoundIcon, ReceiptCentIcon, QrCodeIcon } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
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
    "Você tem certeza?",
    "Você está excluindo esta conta."
  );

  const deleteMutation = useDeleteAccount(id);
  const { onOpen } = useOpenAccount();
  const { onOpenQrCode } = useOpenPayQrCodeHomeAccount();
  const { onOpenWithdrawZero } = useOpenWithdrawZero();

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
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
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
            <QrCodeIcon className="size-4 mr-2" />
            Solicitar saque taxa zero
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
