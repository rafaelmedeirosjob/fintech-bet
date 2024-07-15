import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.payments.qrCode["$post"]>;
type RequestType = InferRequestType<typeof client.api.payments.qrCode["$post"]>["json"];

export const useQrCodeAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.payments.qrCode["$post"]({ 
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Pagamento realizado");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Falha ao realizar pagamento para casa");
    },
  });

  return mutation;
};
