import { z } from "zod";

import { useOpenUser } from "@/features/settings/hooks/use-open-user";
import { useCreateUser } from "@/features/settings/api/use-create-user";
import { useEditUser } from "@/features/settings/api/use-edit-user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserForm } from "./user-form";

type FormValues = {
  id: string;
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
  const { user, isOpen, onClose } = useOpenUser();
  console.log("oi")
  console.log(user)
  let mutation = undefined;
  if (user) {
    mutation = useEditUser(user.id);
  } else {
    mutation = useCreateUser();
  }

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error('Erro na mutação:', error);
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
            id: user === undefined ? "" : user.id,
            documentNumber: user === undefined ? "" : user.documentNumber,
            fullName: user === undefined ? "" : user.fullName,
            phoneNumber: user === undefined ? "" : user.phoneNumber,
            motherName: user === undefined ? "" : user.motherName,
            email: user === undefined ? "" : user.email,
            birthDate: user === undefined ? "" : user.birthDate,
            postalCode: user === undefined ? "" : user.postalCode,
            street: user === undefined ? "" : user.street,
            addressComplement: user === undefined ? "" : user.addressComplement,
            number: user === undefined ? "" : user.number,
            neighborhood: user === undefined ? "" : user.neighborhood,
            city: user === undefined ? "" : user.city,
            state: user === undefined ? "" : user.state,
            longitude: user === undefined ? "" : user.longitude,
            latitude: user === undefined ? "" : user.latitude,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
