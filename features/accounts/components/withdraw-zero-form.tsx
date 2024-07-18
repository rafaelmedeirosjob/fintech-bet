import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetAccount } from "@/features/accounts/api/use-get-account";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WithdrawZeroForm } from "./user-withdraw-zero-form";
import { useOpenWithdrawZero } from "../hooks/use-open-withdraw-zero";
import { useQrCodeAccount } from "../api/use-qr-code-account";
import { useWithdrawZero } from "../api/use-post-withdraw-zero";

type FormValues = {
  bettingHouse: string,
  personId: string,
  amount: string,
  reason: string,
  login: string,
  password: string
}

export const WithdrawZeroSheet = () => {
  const { isOpen, onCloseWithdrawZero, id } = useOpenWithdrawZero();

  console.log({
    isOpen,
    id,
  })

  const bettingHouseOptions = [{label: "Betano", value: "Betano"}, {label: "SuperBet", value: "SuperBet"}];

  const accountQuery = useGetAccount(id);
  const withdrawZeroMutation = useWithdrawZero();

  const isPending =
  withdrawZeroMutation.isPending

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    withdrawZeroMutation.mutate(values, {
      onSuccess: () => {
        onCloseWithdrawZero();
      },
    });
  };

  const defaultValues = { 
    bettingHouse: "", 
    login: "",
    password: "",
    reason: "",
    amount: accountQuery.data?.amount != null ? accountQuery.data.amount : "0",
    personId: accountQuery.data?.personId != null ? accountQuery.data?.personId : ""}

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onCloseWithdrawZero}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Solicite o saque da sua conta com taxa zero
            </SheetTitle>
            <SheetDescription>
              preencha todas as informações abaixo para que nossa equipe faça aprovação do saque sem taxas.
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <WithdrawZeroForm
                id={id}
                onSubmit={onSubmit} 
                bettingHouseOptions={bettingHouseOptions}
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
