"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function redirectTo(url: string) {
  window.location.assign(url);
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Zap,
  Gift,
  ExternalLink,
  Loader2,
  Copy,
} from "lucide-react";

export default function BillingPage() {
  const trpc = useTRPC();
  const [referralCode, setReferralCode] = useState("");

  const { data: billing, isLoading } = useQuery(
    trpc.billing.getStatus.queryOptions()
  );

  const checkoutMutation = useMutation(
    trpc.billing.createCheckout.mutationOptions({
      onSuccess: (data) => {
        if (data.url) redirectTo(data.url);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const creditsMutation = useMutation(
    trpc.billing.buyCredits.mutationOptions({
      onSuccess: (data) => {
        if (data.url) redirectTo(data.url);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({
      onSuccess: (data) => {
        if (data.url) redirectTo(data.url);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const referralMutation = useMutation(
    trpc.billing.applyReferral.mutationOptions({
      onSuccess: () => {
        toast.success("Referral code applied!");
        setReferralCode("");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!billing) return null;

  const usagePercent =
    billing.scriptsLimit > 0
      ? (billing.scriptsUsed / billing.scriptsLimit) * 100
      : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription, usage, and credits.
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                {billing.plan === "paid" ? "Paid Plan" : "Free Plan"}
              </CardDescription>
            </div>
            <Badge variant={billing.plan === "paid" ? "default" : "secondary"}>
              {billing.plan === "paid" ? "PRO" : "FREE"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                Scripts used: {billing.scriptsUsed} / {billing.scriptsLimit}
              </span>
              <span className="text-muted-foreground">
                {Math.round(usagePercent)}%
              </span>
            </div>
            <Progress value={usagePercent} />
          </div>

          {billing.extraCredits > 0 && (
            <p className="text-muted-foreground text-sm">
              Extra credits: {billing.extraCredits}
            </p>
          )}

          <div className="flex gap-2">
            {billing.plan === "free" ? (
              <Button
                onClick={() =>
                  checkoutMutation.mutate({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "",
                  })
                }
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Zap className="mr-1 h-4 w-4" />
                Upgrade to Pro
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extra Credits */}
      <Card>
        <CardHeader>
          <CardTitle>Extra Credits</CardTitle>
          <CardDescription>
            Need more scripts? Buy 5 extra generations for £2.99.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => creditsMutation.mutate()}
            disabled={creditsMutation.isPending}
          >
            {creditsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Buy 5 Credits — £2.99
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Referral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Referrals
          </CardTitle>
          <CardDescription>
            Share your referral code to earn bonus scripts. Each referral gives
            you 1 free generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {billing.referralCode && (
            <div className="space-y-2">
              <Label>Your Referral Code</Label>
              <div className="flex gap-2">
                <Input value={billing.referralCode} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(billing.referralCode!);
                    toast.success("Copied!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Apply a Referral Code</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
              <Button
                onClick={() => referralMutation.mutate({ code: referralCode })}
                disabled={referralMutation.isPending || !referralCode}
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
