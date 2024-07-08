import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  text, 
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum('user', ['user', 'admin', 'user-admin']);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  emailVerified: text("emailVerified"),
  image: text("image"),
  password: text("password"),
  role: RoleEnum('user'),
  userExternalId: text("user_external_id").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const usersRelations = relations(users, ({ many }) => ({
  auth: many(auth),
}));

export const insertUserSchema = createInsertSchema(users);

export const auth = pgTable("auth", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  type: text("type"),
  provider: text("provider"),
  providerAccountId: text("providerAccountId"),
  refresh_token: RoleEnum('refresh_token'),
  access_token: text("access_token").notNull(),
  expires_at: text("expires_at").notNull(),
  token_type: text("token_type").notNull(),
  scope: text("scope").notNull(),
  id_token: text("id_token").notNull(),
  session_state: text("session_state").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const authRelations = relations(auth, ({ one }) => ({
  user: one(users, {
    fields: [auth.userId],
    references: [users.id],
  }),
}));

export const insertAuthSchema = createInsertSchema(auth);

export const person = pgTable("person", {
  id: text("id").primaryKey(),
  documentNumber: text("documentNumber"),
  phoneNumber: text("phoneNumber"),
  email: text("email"),
  motherName: text("motherName"),
  fullName: text("fullName"),
  socialName: text("socialName"),
  birthDate: text("birthDate"),
  isPoliticallyExposedPerson: text("isPoliticallyExposedPerson"),
  userExternalId: text("user_external_id").notNull(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  addressId: text("address_id").references(() => address.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const personRelations = relations(person, ({ many, one }) => ({
  accounts: many(accounts),
  user: one(users, {
    fields: [person.userId],
    references: [users.id],
  }),
  address: one(address, {
    fields: [person.addressId],
    references: [address.id],
  }),
}));

export const insertPersonSchema = createInsertSchema(person);

export const address = pgTable("address", {
  id: text("id").primaryKey(),
  postalCode: text("postalCode"),
  street: text("street"),
  number: text("number"),
  addressComplement: text("addressComplement"),
  neighborhood: text("neighborhood"),
  city: text("city"),
  state: text("state"),
  longitude: text("longitude"),
  latitude: text("latitude")
});


export const insertAddress = createInsertSchema(address);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  status: text("status"),
  documentNumber: text("documentNumber").notNull(),
  participant: text("participant"),
  accountOnboardingType: text("accountOnboardingType"),
  branch: text("branch"),
  account: text("account"),
  accountType: text("accountType"),
  personId: text("person_id").references(() => person.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const accountsRelations = relations(accounts, ({ many, one }) => ({
  transactions: many(transactions),
  person: one(person, {
    fields: [accounts.personId],
    references: [person.id],
  }),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

export const connectedBanks = pgTable("connected_banks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token").notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  subscriptionId: text("subscription_id").notNull().unique(),
  status: text("status").notNull(),
});
