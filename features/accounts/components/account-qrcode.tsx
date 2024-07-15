import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useOpenPayQrCodeHomeAccount } from "@/features/accounts/hooks/use-open-account-qr-code";
import { useQrCodeAccount } from "@/features/accounts/api/use-qr-code-account";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AccountQrCodeForm } from "./account-qr-code-form";

type FormValues = {
  linkQrCode: string;
  id: string;
}

export const QrCodeAccountSheet = () => {
  const { isOpen, onCloseQrCode, id } = useOpenPayQrCodeHomeAccount();

  console.log({
    isOpen,
    id,
  })

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account."
  );

  const accountQuery = useGetAccount(id);
  const qrCodeMutation = useQrCodeAccount(id);

  const isPending =
  qrCodeMutation.isPending

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    qrCodeMutation.mutate(values, {
      onSuccess: () => {
        onCloseQrCode();
      },
    });
  };

  const defaultValues = { linkQrCode: "", id: id != null ? id : ""}
  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onCloseQrCode}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Depósito na casa de apostas
            </SheetTitle>
            <SheetDescription>
              Insira o QR Code gerado dentro da casa de apostas
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <AccountQrCodeForm
                id={id}
                onSubmit={onSubmit} 
                disabled={isPending}
                defaultValues={defaultValues}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
