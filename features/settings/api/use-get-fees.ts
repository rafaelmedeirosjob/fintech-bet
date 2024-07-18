import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetFees = () => {
  const query = useQuery({
    queryKey: ["fees"],
    queryFn: async () => {
      const response = await client.api.fees.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch fees");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
