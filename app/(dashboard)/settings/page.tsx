"use client";

import { UserProfile } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>
      </div>

      {/* Clerk UserProfile handles account management */}
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none",
          },
        }}
      />

      <Separator />

      {/* Legal */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Legal</h2>
        <div className="text-muted-foreground flex gap-4 text-sm">
          <a
            href="/privacy"
            className="hover:text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-foreground underline underline-offset-4"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
