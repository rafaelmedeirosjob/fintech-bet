import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type FormValues = {
  fullName: string;
  documentNumber: string;
}

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  console.log({
    isOpen,
    id,
  })

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);

  const isPending =
    editMutation.isPending

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery.data ? {
    documentNumber: accountQuery.data.documentNumber,
    fullName: accountQuery.data.fullName != null ? accountQuery.data.fullName : ""
  } : {
    documentNumber: "",
    fullName: ""
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Editar conta
            </SheetTitle>
            <SheetDescription>
              Edit an existing account
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <AccountForm
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
