import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
export type FeedFollows = typeof feedFollows.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userID: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const feedFollows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userID: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  feedID: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade" }),
});
