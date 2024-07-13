"use client";

import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";

import { NewUserSheet } from "@/features/settings/components/new-user-sheet";

import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewUserSheet />

      <SubscriptionModal />
    </>
  );
};
