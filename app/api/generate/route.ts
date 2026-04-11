import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, brandBrains, scripts, scenes } from "@/db/schema";
import { streamScriptGeneration } from "@/lib/ai/stream";
import { buildScriptPrompt, formatBrandBrain } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { topicDescription, platform, length, pace, format } = body;

  if (!topicDescription || !platform || !length || !pace || !format) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // Check limits
  if (user.scriptsUsed >= user.scriptsLimit && user.extraCredits <= 0) {
    return new Response("Script generation limit reached", { status: 403 });
  }

  // Get Brand Brain
  const [brandBrain] = await db
    .select()
    .from(brandBrains)
    .where(eq(brandBrains.userId, user.id))
    .limit(1);

  if (!brandBrain) {
    return new Response("Complete Brand Brain first", { status: 400 });
  }

  const prompt = buildScriptPrompt({
    brandBrain,
    topicDescription,
    platform,
    length,
    pace,
    format,
  });

  const { stream: aiStream, result } = streamScriptGeneration(
    formatBrandBrain(brandBrain),
    prompt
  );

  const encoder = new TextEncoder();

  // Create a wrapper stream that pipes AI deltas AND appends
  // the saved script ID after generation + DB save completes
  const outputStream = new ReadableStream({
    async start(controller) {
      // Pipe AI text deltas to client
      const reader = aiStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "Generation failed" })}\n\n`
          )
        );
        controller.close();
        return;
      }

      // AI stream done — now save to DB
      try {
        const aiOutput = await result;

        const [script] = await db
          .insert(scripts)
          .values({
            userId: user.id,
            title: aiOutput.title,
            mode: "own_idea",
            platform,
            length,
            pace,
            format,
            topicDescription,
          })
          .returning();

        await db.insert(scenes).values(
          aiOutput.scenes.map((scene, index) => ({
            scriptId: script.id,
            order: index + 1,
            type: scene.type,
            content: scene.content,
            textOnScreen: scene.textOnScreen,
          }))
        );

        // Deduct usage
        if (user.scriptsUsed < user.scriptsLimit) {
          await db
            .update(users)
            .set({ scriptsUsed: user.scriptsUsed + 1, updatedAt: new Date() })
            .where(eq(users.id, user.id));
        } else {
          await db
            .update(users)
            .set({
              extraCredits: user.extraCredits - 1,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));
        }

        // Send script ID to frontend so it can redirect
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "complete", scriptId: script.id })}\n\n`
          )
        );
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "Failed to save script" })}\n\n`
          )
        );
      }

      controller.close();
    },
  });

  return new Response(outputStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
