/**
 * Price Feeds Example
 *
 * This example demonstrates how to create custom price feeds
 * using SybexOracle for reliable and decentralized price data.
 */

import { oracle, resolvers } from "../src";
import { createClients } from "./config";

interface PriceFeed {
	symbol: string;
	name: string;
	base_currency: string;
	quote_currency: string;
	oracle_question_id?: bigint;
	last_updated?: number;
	price?: number;
	confidence_score: number;
}

interface PriceUpdate {
	feed_id: string;
	price: number;
	timestamp: number;
	source: string;
	volume?: number;
}

class PriceFeedManager {
	private publicClient: any;
	private walletClient: any;
	private feeds: Map<string, PriceFeed> = new Map();
	private priceHistory: Map<string, PriceUpdate[]> = new Map();
	private updateInterval: NodeJS.Timeout | null = null;

	constructor(publicClient: any, walletClient: any) {
		this.publicClient = publicClient;
		this.walletClient = walletClient;
	}

	/**
	 * Create a new price feed
	 */
	async createPriceFeed(params: {
		symbol: string;
		name: string;
		base_currency: string;
		quote_currency: string;
		update_frequency_minutes: number;
		confidence_score?: number;
	}): Promise<PriceFeed> {
		console.log(`\n📈 Creating Price Feed`);
		console.log(`${params.name} (${params.symbol})`);
		console.log(`${params.base_currency}/${params.quote_currency}`);
		console.log(`Update every ${params.update_frequency_minutes} minutes`);
		console.log("-".repeat(40));

		const feed: PriceFeed = {
			symbol: params.symbol,
			name: params.name,
			base_currency: params.base_currency,
			quote_currency: params.quote_currency,
			confidence_score: params.confidence_score || 0.8,
		};

		// Create oracle question for price updates
		const question = `What is the current price of ${params.name} (${params.symbol}) in ${params.quote_currency}?`;

		const questionFee = await oracle.getQuestionFee(
			{},
			{ client: this.publicClient },
		);
		const timeout = BigInt(365 * 24 * 60 * 60); // 1 year timeout for continuous updates

		const tx = await oracle.askNumeric(
			{
				questionText: question,
				timeout,
				additionalData: JSON.stringify({
					feed_type: "price",
					symbol: params.symbol,
					base: params.base_currency,
					quote: params.quote_currency,
					confidence: feed.confidence_score,
				}),
			},
			{
				client: this.walletClient,
				value: questionFee,
				waitForTransaction: true,
			},
		);

		feed.oracle_question_id = await this.getQuestionIdFromTx(tx);

		this.feeds.set(params.symbol, feed);
		this.priceHistory.set(params.symbol, []);

		console.log(`✅ Price feed created!`);
		console.log(`Feed Symbol: ${params.symbol}`);
		console.log(`Oracle Question ID: ${feed.oracle_question_id}`);
		console.log(`Transaction: ${tx}`);

		return feed;
	}

	/**
	 * Update price feed with new data
	 */
	async updatePrice(params: {
		symbol: string;
		price: number;
		source: string;
		volume?: number;
	}): Promise<void> {
		console.log(`\n🔄 Updating Price Feed`);
		console.log(`Symbol: ${params.symbol}`);
		console.log(`Price: $${params.price}`);
		console.log(`Source: ${params.source}`);
		console.log("-".repeat(40));

		const feed = this.feeds.get(params.symbol);
		if (!feed || !feed.oracle_question_id) {
			throw new Error("Price feed not found");
		}

		try {
			// Submit price to oracle
			const tx = await resolvers.numerical.resolve(
				{
					questionId: feed.oracle_question_id,
					numericAnswer: params.price,
				},
				{
					client: this.walletClient,
					waitForTransaction: true,
				},
			);

			console.log(`✅ Price updated on oracle! TX: ${tx}`);

			// Update local cache
			feed.last_updated = Date.now();
			feed.price = params.price;

			// Store in history
			const update: PriceUpdate = {
				feed_id: params.symbol,
				price: params.price,
				timestamp: Date.now(),
				source: params.source,
				volume: params.volume,
			};

			const history = this.priceHistory.get(params.symbol) || [];
			history.push(update);

			// Keep only last 100 updates
			if (history.length > 100) {
				history.shift();
			}

			this.priceHistory.set(params.symbol, history);

			console.log(`Price history size: ${history.length}`);
		} catch (error) {
			console.error("❌ Failed to update price:", error);
			throw error;
		}
	}

	/**
	 * Get current price for a symbol
	 */
	async getPrice(symbol: string): Promise<number | null> {
		console.log(`\n💰 Getting Price for ${symbol}`);

		const feed = this.feeds.get(symbol);
		if (!feed) {
			console.log("Price feed not found");
			return null;
		}

		// Check local cache first
		if (feed.price && feed.last_updated) {
			const age = Date.now() - feed.last_updated;
			const maxAge = 5 * 60 * 1000; // 5 minutes

			if (age < maxAge) {
				console.log(
					`Price from cache: $${feed.price} (${(age / 1000).toFixed(0)}s old)`,
				);
				return feed.price;
			}
		}

		// Try to get from oracle
		try {
			if (!feed.oracle_question_id) {
				throw new Error("No oracle question ID");
			}

			const question = await oracle.getQuestion(
				{ questionId: feed.oracle_question_id },
				{ client: this.publicClient },
			);

			if (question.isResolved) {
				const answer = await oracle.getAnswer(
					{ questionId: feed.oracle_question_id },
					{ client: this.publicClient },
				);

				const price = Number(answer.answerData);
				console.log(`Price from oracle: $${price}`);
				return price;
			}
		} catch (_error) {
			console.log("Could not get price from oracle");
		}

		console.log("No price data available");
		return null;
	}

	/**
	 * Get price history for analysis
	 */
	getPriceHistory(symbol: string, hours: number = 24): PriceUpdate[] {
		const history = this.priceHistory.get(symbol) || [];
		const cutoff = Date.now() - hours * 60 * 60 * 1000;

		return history.filter((update) => update.timestamp > cutoff);
	}

	/**
	 * Calculate price statistics
	 */
	getPriceStats(symbol: string, hours: number = 24) {
		const history = this.getPriceHistory(symbol, hours);

		if (history.length === 0) {
			return null;
		}

		const prices = history.map((h) => h.price);
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

		// Calculate volatility (standard deviation)
		const variance =
			prices.reduce((sum, price) => sum + (price - avg) ** 2, 0) /
			prices.length;
		const volatility = Math.sqrt(variance);

		// Calculate price change
		const firstPrice = history[0].price;
		const lastPrice = history[history.length - 1].price;
		const change = ((lastPrice - firstPrice) / firstPrice) * 100;

		return {
			symbol,
			period: `${hours}h`,
			current: lastPrice,
			high: max,
			low: min,
			average: avg,
			change: change,
			volatility: volatility,
			updates: history.length,
		};
	}

	/**
	 * Start automated price updates
	 */
	startAutoUpdate(symbols: string[], intervalMinutes: number = 5) {
		console.log(`\n🔄 Starting Auto-Updates`);
		console.log(`Symbols: ${symbols.join(", ")}`);
		console.log(`Interval: ${intervalMinutes} minutes`);
		console.log("-".repeat(40));

		if (this.updateInterval) {
			clearInterval(this.updateInterval);
		}

		this.updateInterval = setInterval(
			async () => {
				console.log(
					`\n⏰ Auto-updating prices at ${new Date().toISOString()}`,
				);

				for (const symbol of symbols) {
					try {
						// In a real implementation, fetch from multiple exchanges
						const mockPrice = this.generateMockPrice(symbol);
						const mockSource = "MockExchange";

						await this.updatePrice({
							symbol,
							price: mockPrice,
							source: mockSource,
							volume: Math.random() * 1000000,
						});
					} catch (error) {
						console.error(`Failed to update ${symbol}:`, error);
					}
				}
			},
			intervalMinutes * 60 * 1000,
		);

		console.log(`✅ Auto-updates started!`);
	}

	/**
	 * Stop automated updates
	 */
	stopAutoUpdate() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
			console.log("\n⏸️ Auto-updates stopped");
		}
	}

	/**
	 * Display all price feeds
	 */
	displayFeeds() {
		console.log("\n📊 All Price Feeds");
		console.log("-".repeat(40));

		this.feeds.forEach((feed, symbol) => {
			console.log(`\n${symbol}:`);
			console.log(`  Name: ${feed.name}`);
			console.log(`  Pair: ${feed.base_currency}/${feed.quote_currency}`);
			console.log(
				`  Confidence: ${(feed.confidence_score * 100).toFixed(0)}%`,
			);

			if (feed.price) {
				console.log(`  Current Price: $${feed.price}`);
				if (feed.last_updated) {
					const age = (Date.now() - feed.last_updated) / 1000;
					console.log(`  Last Updated: ${age.toFixed(0)}s ago`);
				}
			} else {
				console.log(`  Status: No price data`);
			}

			const stats = this.getPriceStats(symbol);
			if (stats) {
				console.log(
					`  24h Change: ${stats.change > 0 ? "+" : ""}${stats.change.toFixed(2)}%`,
				);
				console.log(`  24h High: $${stats.high.toFixed(2)}`);
				console.log(`  24h Low: $${stats.low.toFixed(2)}`);
			}
		});
	}

	private generateMockPrice(symbol: string): number {
		// Generate realistic mock prices
		const basePrices: { [key: string]: number } = {
			BTC: 43500,
			ETH: 2250,
			BNB: 310,
			ADA: 0.58,
			DOT: 7.5,
			LINK: 14.2,
			MATIC: 0.92,
		};

		const base = basePrices[symbol] || 100;
		// Add random variation ±5%
		const variation = (Math.random() - 0.5) * 0.1;
		return base * (1 + variation);
	}

	private async getQuestionIdFromTx(_tx: string): Promise<bigint> {
		// Mock implementation
		return BigInt(Date.now());
	}
}

async function priceFeedsExample() {
	console.log("📈 Price Feeds Example\n");

	const { publicClient, walletClient } = createClients("testnet");
	const feedManager = new PriceFeedManager(publicClient, walletClient);

	try {
		// Example 1: Create multiple price feeds
		console.log("📊 Example 1: Creating Price Feeds");

		const feeds = [
			{
				symbol: "BTC",
				name: "Bitcoin",
				base_currency: "BTC",
				quote_currency: "USD",
				update_frequency_minutes: 1,
				confidence_score: 0.95,
			},
			{
				symbol: "ETH",
				name: "Ethereum",
				base_currency: "ETH",
				quote_currency: "USD",
				update_frequency_minutes: 1,
				confidence_score: 0.95,
			},
			{
				symbol: "BNB",
				name: "Binance Coin",
				base_currency: "BNB",
				quote_currency: "USD",
				update_frequency_minutes: 5,
				confidence_score: 0.9,
			},
			{
				symbol: "DEFI",
				name: "DeFi Index",
				base_currency: "DEFI",
				quote_currency: "USD",
				update_frequency_minutes: 10,
				confidence_score: 0.85,
			},
		];

		for (const feed of feeds) {
			await feedManager.createPriceFeed(feed);
		}

		// Example 2: Update prices with mock data
		console.log("\n💰 Example 2: Updating Prices");

		const priceUpdates = [
			{
				symbol: "BTC",
				price: 43250.75,
				source: "Binance",
				volume: 1234567,
			},
			{ symbol: "ETH", price: 2245.3, source: "Uniswap", volume: 987654 },
			{
				symbol: "BNB",
				price: 312.45,
				source: "PancakeSwap",
				volume: 543210,
			},
			{ symbol: "DEFI", price: 1580.25, source: "Curve", volume: 234567 },
		];

		for (const update of priceUpdates) {
			await feedManager.updatePrice(update);
			// Add delay between updates
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		// Example 3: Get prices and statistics
		console.log("\n📈 Example 3: Price Statistics");

		for (const symbol of ["BTC", "ETH", "BNB"]) {
			const price = await feedManager.getPrice(symbol);
			const stats = feedManager.getPriceStats(symbol);

			console.log(`\n${symbol}:`);
			console.log(`  Current: $${price?.toFixed(2) || "N/A"}`);

			if (stats) {
				console.log(`  24h Stats:`);
				console.log(`    High: $${stats.high.toFixed(2)}`);
				console.log(`    Low: $${stats.low.toFixed(2)}`);
				console.log(`    Average: $${stats.average.toFixed(2)}`);
				console.log(
					`    Change: ${stats.change > 0 ? "+" : ""}${stats.change.toFixed(2)}%`,
				);
				console.log(`    Updates: ${stats.updates}`);
			}
		}

		// Example 4: Start auto-updates
		console.log("\n🔄 Example 4: Auto-Updates");

		feedManager.startAutoUpdate(["BTC", "ETH", "BNB"], 30); // Every 30 seconds for demo

		// Run for a while to show auto-updates
		console.log("Running auto-updates for 60 seconds...");
		await new Promise((resolve) => setTimeout(resolve, 60000));

		// Stop auto-updates
		feedManager.stopAutoUpdate();

		// Example 5: Display final feed status
		console.log("\n📊 Example 5: Final Feed Status");
		feedManager.displayFeeds();

		console.log("\n✅ Price feeds example completed!");
		console.log("\n💡 Key Features:");
		console.log("- Multiple price feeds with different confidence scores");
		console.log("- Automated price updates");
		console.log("- Price history tracking");
		console.log("- Statistical analysis (volatility, changes, etc.)");
		console.log("- Decentralized price verification via oracle");
		console.log("- Configurable update frequencies");
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

// Run the example
priceFeedsExample().catch(console.error);
