import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetUser } from "@/features/settings/api/use-get-user";
import { UserForm } from "@/features/settings/components/user-form";
import { useOpenUser } from "@/features/settings/hooks/use-open-user";
import { useEditUser } from "@/features/settings/api/use-edit-user";


import { useConfirm } from "@/hooks/use-confirm";
import { insertUserSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = insertUserSchema.pick({
  documentNumber: true,
  phoneNumber: true,
  fullName: true
});

type FormValues = z.input<typeof formSchema>;

export const EditUserSheet = () => {
  const { isOpen, onClose, id } = useOpenUser();

  console.log({
    isOpen,
    id,
  })

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this user."
  );

  const userQuery = useGetUser(id);
  const editMutation = useEditUser(id);

  const isPending =
    editMutation.isPending

  const isLoading = userQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };


  const defaultValues = userQuery.data ? {
    documentNumber: userQuery.data.documentNumber,
    phoneNumber: userQuery.data.phoneNumber,
    fullName: userQuery.data.fullName
  } : {
    documentNumber: "",
    fullName: "",
    phoneNumber: "",
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit User
            </SheetTitle>
            <SheetDescription>
              Edit an existing user
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <UserForm
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
