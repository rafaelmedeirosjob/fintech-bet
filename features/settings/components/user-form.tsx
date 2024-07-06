import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Accordion from '@radix-ui/react-accordion';
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { insertUserSchema, insertAddress } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const UserForm = ({
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

  // Função para aplicar a máscara de CPF
  const maskCpf = (value: any) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona o traço
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos e 2 do traço
  };

  // Função para aplicar a máscara de telefone celular
  const maskPhone = (value: any) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '($1) $2') // Adiciona os parênteses no DDD
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço no número do celular
      .replace(/(-\d{4})\d+?$/, '$1'); // Limita a 11 dígitos
  };

  // Função para validar o e-mail
  const maskEmail = (value: any) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(value).toLowerCase());
  };
  // Função para validar o data de nascimento
  const maskBirthDate = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a primeira barra
      .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a segunda barra
      .replace(/(\d{4})\d+?$/, '$1'); // Limita a 8 dígitos
  };

  const maskCep = (value: any) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço
      .replace(/(-\d{3})\d+?$/, '$1'); // Limita a 8 dígitos
  };

  return (
    <Accordion.Root
      className="bg-mauve6 w-[300px] rounded-md shadow-[0_2px_10px] shadow-black/5"
      type="single"
      defaultValue="item-1"
      collapsible
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 pt-4"
        >
          {/* DADOS DO USUÁRIO */}
          <Accordion.Item value="item-1"
            className='focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]'
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger
                className=
                'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'
              >
                Dados pessoais
                <ChevronDownIcon
                  className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className='text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
            >

              <div className="py-[15px] px-5">
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
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o seu email"
                          {...field}
                          value={field.value ?? ""}
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
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o seu nome completo"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="motherName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome da mãe
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o nome completo da sua mãe"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o telefone"
                          {...field}
                          onChange={(e) => field.onChange(maskPhone(e.target.value))}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="birthDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Data de Nascimento
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite a data de nascimento"
                          {...field}
                          onChange={(e) => field.onChange(maskBirthDate(e.target.value))}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Accordion.Content>
          </Accordion.Item>
          {/* ENDEREÇO */}
          <Accordion.Item value="item-2"
            className='focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]'
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger
                className=
                'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'
              >
                Endereço
                <ChevronDownIcon
                  className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className='text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
            >
              <div className="py-[15px] px-5">
                <FormField
                  name="postalCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cep
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o seu cep"
                          {...field}
                          onChange={(e) => field.onChange(maskCep(e.target.value))}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="street"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rua
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o nome da sua rua"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                                              <FormField
                  name="neighborhood"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bairro
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o bairro"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={disabled}
                          placeholder="Digite o número"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                                              <FormField
                  name="addressComplement"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Complemento
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o complemento"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cidade
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite a cidade"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Estado
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o Estado"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

              </div>

                
            </Accordion.Content>
          </Accordion.Item>

          {/* DADOS BANCÁRIOS
          <Accordion.Item value="item-3"
            className='focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]'
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger
                className=
                'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'
              >
                Dados bancários
                <ChevronDownIcon
                  className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className='text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
            >
              <div className="py-[15px] px-5">
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
                          value={field.value ?? ""}
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
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o seu nome completo"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          placeholder="Digite o telefone"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Accordion.Content>
          </Accordion.Item> */}
          <Button className="w-full" disabled={disabled}>
            {"Salvar alterações"}
          </Button>
          {!!id && (
            <Button
              type="button"
              disabled={disabled}
              onClick={handleDelete}
              className="w-full"
              variant="outline"
            >
              <Trash className="size-4 mr-2" />
              Excluir          </Button>
          )}
        </form>
      </Form>
    </Accordion.Root>
  );
};
