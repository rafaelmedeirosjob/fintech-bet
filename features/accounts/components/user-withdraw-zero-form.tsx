import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  bettingHouseOptions: { label: string; value: string; }[];
};

export const WithdrawZeroForm = ({
  id,
  defaultValues,
  onSubmit,
  bettingHouseOptions,
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
          name="bettingHouse"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Casa de apostas
              </FormLabel>
              <FormControl>
                <Select
                  placeholder="Selecionar"
                  options={bettingHouseOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
                <FormField
          name="reason"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Motivo do pedido
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Motivo do pedido"
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
