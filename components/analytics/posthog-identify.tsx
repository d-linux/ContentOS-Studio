"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

export function PostHogIdentify() {
  const { user, isLoaded } = useUser();
  const posthog = usePostHog();

  useEffect(() => {
    if (!isLoaded || !posthog) return;

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    }
  }, [user, isLoaded, posthog]);

  return null;
}
