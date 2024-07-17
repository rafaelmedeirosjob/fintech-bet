import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.withdrawals.zero_fees["$post"]>;
type RequestType = InferRequestType<typeof client.api.withdrawals.zero_fees["$post"]>["json"];

export const useWithdrawZero = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.withdrawals.zero_fees["$post"]({ 
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Solicitação do saque realizada");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao realizar Solicitação");
    },
  });

  return mutation;
};
