import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.users[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.users[":id"]["$patch"]>["json"];

export const useEditUser = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.users[":id"]["$patch"]({ 
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Seu cadastro foi atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao atualizar seu cadastro");
    },
  });

  return mutation;
};
