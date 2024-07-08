"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";

export const PlaidDisconnect = () => {
  const [Dialog, confirm] = useConfirm(
    "Are you sure?",
    "This will disconnect your bank account, and remove all associated data."
  );

  const onClick = async () => {
    const ok = await confirm();

    if (ok) {

    }
  };

  return (
    <>
      <Dialog />
      <Button
        onClick={onClick}
        disabled={false}
        size="sm"
        variant="ghost"
      >
        Disconnect
      </Button>
    </>
  );
};
