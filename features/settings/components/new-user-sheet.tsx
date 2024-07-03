import { z } from "zod";

import { useNewUser } from "@/features/settings/hooks/use-new-user";
import { useCreateUser } from "@/features/settings/api/use-create-user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserForm } from "./user-form";

type FormValues = {
  fullName: string;
  documentNumber: string;
  phoneNumber: string;
  birthDate: string;
  motherName: string;
  email: string;
  postalCode: string;
  street: string;
  number: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  longitude: string;
  latitude: string;
};

export const NewUserSheet = () => {
  const { isOpen, onClose } = useNewUser();

  const mutation = useCreateUser();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Preencha todos os seus dados
          </SheetTitle>
          <SheetDescription>
            Insira seus dados abaixo para realizar transações dentro da plataforma
          </SheetDescription>
        </SheetHeader>
        <UserForm 
          onSubmit={onSubmit} 
          disabled={mutation.isPending}
          defaultValues={{
            documentNumber: "",
            fullName: "",
            phoneNumber: "",
            motherName: "",
            email: "",
            birthDate: "",
            postalCode: "",
            street: "",
            addressComplement: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            longitude: "",
            latitude: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
