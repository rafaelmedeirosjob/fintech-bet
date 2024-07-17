"use client";

import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";

import { NewUserSheet } from "@/features/settings/components/new-user-sheet";

import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { QrCodeAccountSheet } from "@/features/accounts/components/account-qrcode";
import { WithdrawZeroSheet } from "@/features/accounts/components/withdraw-zero-form";
import { FeesSheet } from "@/features/settings/components/fees-form";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <QrCodeAccountSheet />

      <NewUserSheet />
      <FeesSheet />
      <WithdrawZeroSheet />

      <SubscriptionModal />
    </>
  );
};
