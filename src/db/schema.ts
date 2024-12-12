import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { STATUS_OPTIONS } from "@/constants/invoices";

export type Status = (typeof STATUS_OPTIONS)[number]["id"];

const allStatus = STATUS_OPTIONS.map(({ id }) => id) as Array<Status>;

export const statusEnum = pgEnum(
  "status",
  allStatus as [Status, ...Array<Status>]
);

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  createTimestamp: timestamp("createTimestamp").notNull().defaultNow(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  customerId: integer("customerId").notNull().references(() => Customers.id),
  status: statusEnum("status").notNull().default("open"),
});

export const Customers = pgTable("customers", {
  id: serial("id").primaryKey().notNull(),
  createTimestamp: timestamp("createTimestamp").notNull().defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
});
