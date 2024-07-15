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
  linkQrCode: string;
  id: string;
}

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountQrCodeForm = ({
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
          name="linkQrCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
              Link do QRCode
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder=""
                  {...field}
                />
              </FormControl>
            </FormItem>
            
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {"Efetuar pagamento"}
        </Button>

      </form>
    </Form>
  )
};
