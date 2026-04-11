"use client";

import { useState, useCallback } from "react";

interface StreamState {
  isStreaming: boolean;
  streamedText: string;
  error: string | null;
  scriptId: string | null;
}

export function useScriptStream() {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    streamedText: "",
    error: null,
    scriptId: null,
  });

  const generate = useCallback(
    async (params: {
      topicDescription: string;
      platform: string;
      length: string;
      pace: string;
      format: string;
    }) => {
      setState({
        isStreaming: true,
        streamedText: "",
        error: null,
        scriptId: null,
      });

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!res.ok) {
          const msg = await res.text();
          setState((s) => ({ ...s, isStreaming: false, error: msg }));
          return null;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setState((s) => ({
            ...s,
            isStreaming: false,
            error: "No stream available",
          }));
          return null;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let scriptId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process SSE messages
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = JSON.parse(line.slice(6));

            if (data.type === "delta") {
              setState((s) => ({
                ...s,
                streamedText: s.streamedText + data.text,
              }));
            } else if (data.type === "complete") {
              scriptId = data.scriptId;
              setState((s) => ({
                ...s,
                isStreaming: false,
                scriptId: data.scriptId,
              }));
            } else if (data.type === "error") {
              setState((s) => ({
                ...s,
                isStreaming: false,
                error: data.message,
              }));
            }
          }
        }

        return scriptId;
      } catch (err) {
        setState((s) => ({
          ...s,
          isStreaming: false,
          error: err instanceof Error ? err.message : "Generation failed",
        }));
        return null;
      }
    },
    []
  );

  return { ...state, generate };
}
