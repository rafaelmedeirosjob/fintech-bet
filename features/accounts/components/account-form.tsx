import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { maskCpf } from "@/lib/utils";

type FormValues = {
  fullName: string;
  documentNumber: string;
}

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4 pt-4"
      >
        <FormField
          name="documentNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Cpf
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Digite o cpf da conta"
                  {...field}
                  onChange={(e) => field.onChange(maskCpf(e.target.value))}
                />
              </FormControl>
            </FormItem>
            
          )}
        />
                <FormField
          name="fullName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Nome completo
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Digite o nome completo do dono desta conta"
                  {...field}
                />
              </FormControl>
            </FormItem>
            
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Salvar alterações" : "Criar conta"}
        </Button>

      </form>
    </Form>
  )
};
