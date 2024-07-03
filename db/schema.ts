import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  text, 
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts)
}));

export const insertUserSchema = createInsertSchema(users);

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
  latitude: text("latitude"),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export const addressRelations = relations(address, ({ one }) => ({
  user: one(users, {
    fields: [address.userId],
    references: [users.id],
  }),
}));

export const insertAddress = createInsertSchema(address);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(),
  userAccountId: text("user_account_id").references(() => usersAccount.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const accountsRelations = relations(accounts, ({ many, one }) => ({
  transactions: many(transactions),
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  user_account: one(usersAccount, {
    fields: [accounts.userAccountId],
    references: [usersAccount.id],
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


export const usersAccount = pgTable("users_account", {
  id: text("id").primaryKey(),
  documentNumber: text("documentNumber"),
  phoneNumber: text("phoneNumber"),
  email: text("email"),
  motherName: text("motherName"),
  fullName: text("fullName"),
  socialName: text("socialName"),
  birthDate: text("birthDate"),
  isPoliticallyExposedPerson: text("isPoliticallyExposedPerson"),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(),
  addressId: text("address_id").references(() => address.id, {
    onDelete: "cascade",
  }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const usersAccountRelations = relations(usersAccount, ({ one }) => ({
  user: one(users, {
    fields: [usersAccount.userId],
    references: [users.id],
  }),
  address: one(address, {
    fields: [usersAccount.addressId],
    references: [address.id],
  }),
}));

export const insertUserAccountSchema = createInsertSchema(usersAccount);
