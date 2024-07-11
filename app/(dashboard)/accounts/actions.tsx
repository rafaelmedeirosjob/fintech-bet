"use client";

import { Edit, MoreHorizontal, KeyRoundIcon, ReceiptCentIcon, QrCodeIcon } from "lucide-react";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
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
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <ReceiptCentIcon className="size-4 mr-2" />
            Depositar 
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <QrCodeIcon className="size-4 mr-2" />
            Pagar QR Code da casa 
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
