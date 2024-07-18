import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useOpenPayQrCodeHomeAccount } from "@/features/accounts/hooks/use-open-account-qr-code";
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
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";

export const FeesSheet = () => {
  const { isOpen, onCloseQrCode, id } = useOpenPayQrCodeHomeAccount();

  console.log({
    isOpen,
    id,
  })

  const feesMutation = useGetFees();

  const isPending =
  feesMutation.isPending


  return (
    <>
      <Sheet open={isOpen} onOpenChange={onCloseQrCode}>
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
              <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>Tony Reichert</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>Zoey Lang</TableCell>
                  <TableCell>Technical Lead</TableCell>
                  <TableCell>Paused</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>Jane Fisher</TableCell>
                  <TableCell>Senior Developer</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>William Howard</TableCell>
                  <TableCell>Community Manager</TableCell>
                  <TableCell>Vacation</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
