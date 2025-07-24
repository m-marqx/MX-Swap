import { pgTable, index, timestamp, doublePrecision, text } from "drizzle-orm/pg-core"

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	role: text("role").default("user"),
})

export const btc = pgTable("btc", {
	date: timestamp("date", { mode: 'string' }),
	open: doublePrecision("open"),
	high: doublePrecision("high"),
	low: doublePrecision("low"),
	close: doublePrecision("close"),
	updatedAt: timestamp("updatedAt", { withTimezone: true, mode: 'string' }),
	volume: doublePrecision("volume"),
},
(table) => {
	return {
		ixBtcDate: index("ix_btc_date").on(table.date),
	}
});

export const modelRecommendations = pgTable("model_recommendations", {
	date: text("date"),
	position: text("position"),
	side: text("side"),
	capital: text("capital"),
},
(table) => {
	return {
		ixModelRecommendationsDate: index("ix_model_recommendations_date").on(table.date),
	}
});

export const walletBalanceMonthly = pgTable("wallet_balance_monthly", {
	date: timestamp("date", { mode: 'string' }),
	modelo: doublePrecision("Modelo"),
	btc: doublePrecision("BTC"),
},
(table) => {
	return {
		ixWalletUsdMonthlyDate: index("ix_wallet_usd_monthly_date").on(table.date),
	}
});

export const walletUsd = pgTable("wallet_usd", {
	height: text("height"),
	blockTimestamp: timestamp("blockTimestamp", { mode: 'string' }),
	walletUsd: doublePrecision("wallet_usd"),
});