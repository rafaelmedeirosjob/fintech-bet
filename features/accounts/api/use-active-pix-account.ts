import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts.create_pix["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts.create_pix["$post"]>["json"];

export const useActivePixAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts.create_pix["$post"]({ 
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Criação de chave pix realizada");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao realizar criação da chave");
    },
  });

  return mutation;
};
