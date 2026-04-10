import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────

export const platformEnum = pgEnum("platform", [
  "youtube",
  "tiktok",
  "instagram",
]);

export const scriptModeEnum = pgEnum("script_mode", [
  "own_idea",
  "trend",
  "series",
  "remix",
]);

export const connectionModeEnum = pgEnum("connection_mode", [
  "sequential",
  "anthology",
  "running_format",
  "journey",
  "response",
]);

export const paceEnum = pgEnum("pace", ["slow", "medium", "fast"]);

export const formatEnum = pgEnum("format", [
  "talking_head",
  "listicle",
  "storytime",
  "tutorial",
  "skit",
  "vlog",
  "review",
]);

export const planEnum = pgEnum("plan", ["free", "paid"]);

// ─── Users ───────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  plan: planEnum("plan").notNull().default("free"),
  scriptsUsed: integer("scripts_used").notNull().default(0),
  scriptsLimit: integer("scripts_limit").notNull().default(5),
  extraCredits: integer("extra_credits").notNull().default(0),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Brand Brain ─────────────────────────────────────────

export const brandBrains = pgTable("brand_brains", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  name: text("name"),
  tone: text("tone"),
  niche: text("niche"),
  about: text("about"),
  boundaries: text("boundaries"),
  youtubeData: jsonb("youtube_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Series ──────────────────────────────────────────────

export const series = pgTable("series", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  connectionMode: connectionModeEnum("connection_mode").notNull(),
  platform: platformEnum("platform").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Scripts ─────────────────────────────────────────────

export const scripts = pgTable("scripts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  seriesId: uuid("series_id").references(() => series.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  mode: scriptModeEnum("mode").notNull(),
  platform: platformEnum("platform").notNull(),
  length: text("length"),
  pace: paceEnum("pace"),
  format: formatEnum("format"),
  topicDescription: text("topic_description"),
  episodeNumber: integer("episode_number"),
  remixSourceId: uuid("remix_source_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Scenes ──────────────────────────────────────────────

export const scenes = pgTable("scenes", {
  id: uuid("id").defaultRandom().primaryKey(),
  scriptId: uuid("script_id")
    .notNull()
    .references(() => scripts.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  type: text("type").notNull(), // hook, context, value, proof, payoff, cta
  content: text("content").notNull(),
  textOnScreen: text("text_on_screen"),
  originalContent: text("original_content"), // saved when scene is regenerated
  isRegenerated: boolean("is_regenerated").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Script Captions ─────────────────────────────────────

export const scriptCaptions = pgTable("script_captions", {
  id: uuid("id").defaultRandom().primaryKey(),
  scriptId: uuid("script_id")
    .notNull()
    .references(() => scripts.id, { onDelete: "cascade" })
    .unique(),
  description: text("description"),
  hashtags: text("hashtags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── YouTube Analyses ────────────────────────────────────

export const youtubeAnalyses = pgTable("youtube_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  scriptId: uuid("script_id")
    .notNull()
    .references(() => scripts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoUrl: text("video_url").notNull(),
  performanceData: jsonb("performance_data"),
  insights: text("insights"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Referrals ───────────────────────────────────────────

export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerId: uuid("referrer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referredId: uuid("referred_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  creditAwarded: boolean("credit_awarded").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Feedback ────────────────────────────────────────────

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  creditAwarded: boolean("credit_awarded").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Relations ───────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  brandBrain: one(brandBrains, {
    fields: [users.id],
    references: [brandBrains.userId],
  }),
  scripts: many(scripts),
  series: many(series),
  youtubeAnalyses: many(youtubeAnalyses),
  feedback: many(feedback),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
}));

export const brandBrainsRelations = relations(brandBrains, ({ one }) => ({
  user: one(users, {
    fields: [brandBrains.userId],
    references: [users.id],
  }),
}));

export const seriesRelations = relations(series, ({ one, many }) => ({
  user: one(users, {
    fields: [series.userId],
    references: [users.id],
  }),
  scripts: many(scripts),
}));

export const scriptsRelations = relations(scripts, ({ one, many }) => ({
  user: one(users, {
    fields: [scripts.userId],
    references: [users.id],
  }),
  series: one(series, {
    fields: [scripts.seriesId],
    references: [series.id],
  }),
  scenes: many(scenes),
  caption: one(scriptCaptions, {
    fields: [scripts.id],
    references: [scriptCaptions.scriptId],
  }),
  youtubeAnalyses: many(youtubeAnalyses),
}));

export const scenesRelations = relations(scenes, ({ one }) => ({
  script: one(scripts, {
    fields: [scenes.scriptId],
    references: [scripts.id],
  }),
}));

export const scriptCaptionsRelations = relations(scriptCaptions, ({ one }) => ({
  script: one(scripts, {
    fields: [scriptCaptions.scriptId],
    references: [scripts.id],
  }),
}));

export const youtubeAnalysesRelations = relations(
  youtubeAnalyses,
  ({ one }) => ({
    script: one(scripts, {
      fields: [youtubeAnalyses.scriptId],
      references: [scripts.id],
    }),
    user: one(users, {
      fields: [youtubeAnalyses.userId],
      references: [users.id],
    }),
  })
);

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
}));
