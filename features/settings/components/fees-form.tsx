import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useOpenFees } from "@/features/settings/hooks/use-open-fees";
import { useGetFees } from "@/features/settings/api/use-get-fees";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTable } from "@/components/data-table-fee";

export const FeesSheet = () => {
  const { isOpen, onCloseFees, id } = useOpenFees();

  console.log({
    isOpen,
    id,
  })

  const feesMutation = useGetFees();

  const fees = feesMutation.data || [];

  const isPending =
  feesMutation.isPending
  


  return (
    <>
      <Sheet open={isOpen} onOpenChange={onCloseFees}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Taxas
            </SheetTitle>
            <SheetDescription>
              Visualize todas as nossas taxas cobradas, todas são descontadas automaticamente do saldo da conta mãe ao realizar as ações seguintes ações.
            </SheetDescription>
          </SheetHeader>
          {isPending
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border">
                          <DataTable
                            columns={[  
                              {
                              accessorKey: "origin",
                              header: ({ column }) => {
                                return (
                                    "Ação"
                                )
                              }
                            },
                            {
                              accessorKey: "value",
                              header: ({ column }) => {
                                return (
                                    "Valor da taxa"
                                )
                              }
                            },
                          ]} 
                            data={fees}
          />
            </div>
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
