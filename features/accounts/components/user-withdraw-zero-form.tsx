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
} from "@/components/ui/form";

type FormValues = {
  bettingHouse: string,
  personId: string,
  amount: string,
  reason: string,
  login: string,
  password: string
}

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const WithdrawZeroForm = ({
  id,
  defaultValues,
  onSubmit,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4 pt-4"
      >
        <FormField
          name="login"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Login 
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Login da conta na casa de apostas"
                  {...field}
                />
              </FormControl>
            </FormItem>
            
          )}
        />
                <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Senha 
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Senha da conta na casa de apostas"
                  {...field}
                />
              </FormControl>
            </FormItem>
            
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {"Solicitar saque taxa zero"}
        </Button>

      </form>
    </Form>
  )
};
