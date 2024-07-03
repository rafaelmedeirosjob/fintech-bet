"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { SubscriptionCheckout } from "@/features/subscriptions/components/subscription-checkout";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNewUser } from "@/features/settings/hooks/use-new-user";
import { useGetUser } from "@/features/settings/api/use-get-user";

export const SettingsCard = () => {
  // const {
  //   data: connectedBank,
  //   isLoading: isLoadingConnectedBank,
  // } = useGetConnectedBank();
  const newUser = useNewUser();
  const {
    data: userCreated,
    isLoading: isLoadingUser,
  } = useGetUser();
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
  } = useGetSubscription();

  if (isLoadingSubscription) {
    return (
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">
          Configurações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
          <p className="text-sm font-medium w-full lg:w-[16.5rem]">
            Dados pessoais e bancários
          </p>
          <div className="w-full flex items-center justify-between">
            <div className={cn(
              "text-sm truncate flex items-center",
              !userCreated && "text-muted-foreground",
            )}>
              {userCreated
                ? "Dados atualizados, você pode efetuar o saque"
                : "Realize o cadastro dos seus dados para fazer saques"
              }
            </div>
            <Button
              onClick={newUser.onOpen}
              disabled={userCreated != null}
              size="sm"
              variant="ghost"
            >
              Preencher
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
          <p className="text-sm font-medium w-full lg:w-[16.5rem]">
            Assinatura
          </p>
          <div className="w-full flex items-center justify-between">
            <div className={cn(
              "text-sm truncate flex items-center",
              !subscription && "text-muted-foreground",
            )}>
              {subscription
                ? `Inscrição ${subscription.status}`
                : "Nenhuma inscrição está ativa"
              }
            </div>
            <SubscriptionCheckout />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
