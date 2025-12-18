/**
 * Prediction Market Example
 *
 * This example demonstrates how to build a prediction market
 * using SybexOracle for resolving outcomes.
 */

import { oracle, resolvers, type TransactionReceiptReturn } from "../src";
import { createClients } from "./config";

interface PredictionMarket {
	id: string;
	question: string;
	category: "binary" | "categorical" | "numerical";
	outcomes?: string[]; // For categorical markets
	end_time: number;
	total_volume: number;
	resolved: boolean;
	oracle_question_id?: bigint;
}

interface Position {
	user: string;
	market_id: string;
	outcome: number;
	amount: number;
	shares: number;
}

class PredictionMarketPlatform {
	private publicClient: any;
	private walletClient: any;
	private markets: Map<string, PredictionMarket> = new Map();
	private positions: Map<string, Position[]> = new Map();

	constructor(publicClient: any, walletClient: any) {
		this.publicClient = publicClient;
		this.walletClient = walletClient;
	}

	/**
	 * Create a new prediction market
	 */
	async createMarket(params: {
		question: string;
		category: "binary" | "categorical" | "numerical";
		outcomes?: string[];
		duration: number; // hours
	}): Promise<PredictionMarket> {
		console.log(`\n📊 Creating Prediction Market`);
		console.log(`Question: ${params.question}`);
		console.log(`Category: ${params.category}`);
		console.log(`Duration: ${params.duration} hours`);
		console.log("-".repeat(40));

		const market: PredictionMarket = {
			id: `market_${Date.now()}`,
			question: params.question,
			category: params.category,
			outcomes: params.outcomes,
			end_time: Date.now() + params.duration * 60 * 60 * 1000,
			total_volume: 0,
			resolved: false,
		};

		// Submit question to oracle
		const questionFee = await oracle.getQuestionFee(
			{},
			{ client: this.publicClient },
		);
		const timeout = BigInt(params.duration * 60 * 60); // Convert to seconds

		let tx: `0x${string}` | TransactionReceiptReturn;
		switch (params.category) {
			case "binary":
				tx = await oracle.askBoolean(
					{ questionText: params.question, timeout },
					{
						client: this.walletClient,
						value: questionFee,
						waitForTransaction: true,
					},
				);
				break;
			case "categorical": {
				if (!params.outcomes || params.outcomes.length < 2) {
					throw new Error(
						"Categorical markets need at least 2 outcomes",
					);
				}
				const questionWithOutcomes = `${params.question}\nOutcomes: ${params.outcomes.join(", ")}`;
				tx = await oracle.ask(
					{ questionText: questionWithOutcomes, timeout },
					{
						client: this.walletClient,
						value: questionFee,
						waitForTransaction: true,
					},
				);
				break;
			}
			case "numerical":
				tx = await oracle.askNumeric(
					{ questionText: params.question, timeout },
					{
						client: this.walletClient,
						value: questionFee,
						waitForTransaction: true,
					},
				);
				break;
		}

		market.oracle_question_id = await this.getQuestionIdFromTx(
			tx.toString(),
		);

		this.markets.set(market.id, market);
		console.log(`✅ Market created!`);
		console.log(`Market ID: ${market.id}`);
		console.log(`Oracle Question ID: ${market.oracle_question_id}`);
		console.log(`Transaction: ${tx}`);

		return market;
	}

	/**
	 * Place a bet on a market outcome
	 */
	async placeBet(params: {
		market_id: string;
		outcome: number;
		amount: number;
		user?: string;
	}): Promise<Position> {
		console.log(`\n💰 Placing Bet`);
		console.log(`Market: ${params.market_id}`);
		console.log(`Outcome: ${params.outcome}`);
		console.log(`Amount: ${params.amount}`);
		console.log("-".repeat(40));

		const market = this.markets.get(params.market_id);
		if (!market) {
			throw new Error("Market not found");
		}

		if (market.resolved) {
			throw new Error("Market is already resolved");
		}

		if (Date.now() > market.end_time) {
			throw new Error("Market has expired");
		}

		// Calculate shares (simplified - in real implementation, use AMM)
		const shares = params.amount; // 1:1 for simplicity

		const position: Position = {
			user: params.user || this.walletClient.account?.address,
			market_id: params.market_id,
			outcome: params.outcome,
			amount: params.amount,
			shares,
		};

		// Store position
		if (!this.positions.has(params.market_id)) {
			this.positions.set(params.market_id, []);
		}
		this.positions.get(params.market_id)?.push(position);

		// Update market volume
		market.total_volume += params.amount;

		console.log(`✅ Bet placed!`);
		console.log(`Shares received: ${shares}`);
		console.log(`Current market volume: $${market.total_volume}`);

		return position;
	}

	/**
	 * Get market odds and statistics
	 */
	getMarketStats(market_id: string) {
		const market = this.markets.get(market_id);
		if (!market) return null;

		const positions = this.positions.get(market_id) || [];
		const outcomeTotals = new Map<number, number>();

		positions.forEach((pos) => {
			outcomeTotals.set(
				pos.outcome,
				(outcomeTotals.get(pos.outcome) || 0) + pos.amount,
			);
		});

		const totalBets = Array.from(outcomeTotals.values()).reduce(
			(a, b) => a + b,
			0,
		);
		const odds: { [key: number]: number } = {};

		outcomeTotals.forEach((amount, outcome) => {
			odds[outcome] = totalBets > 0 ? totalBets / amount : 1;
		});

		return {
			market,
			totalBets,
			outcomeTotals: Object.fromEntries(outcomeTotals),
			odds,
			timeRemaining: Math.max(0, market.end_time - Date.now()),
		};
	}

	/**
	 * Resolve market using oracle answer
	 */
	async resolveMarket(market_id: string): Promise<void> {
		console.log(`\n🎯 Resolving Market: ${market_id}`);
		console.log("-".repeat(40));

		const market = this.markets.get(market_id);
		if (!market) {
			throw new Error("Market not found");
		}

		if (market.resolved) {
			console.log("Market is already resolved");
			return;
		}

		if (!market.oracle_question_id) {
			throw new Error("No oracle question ID for this market");
		}

		try {
			// Check if oracle has resolved
			const question = await oracle.getQuestion(
				{ questionId: market.oracle_question_id },
				{ client: this.publicClient },
			);

			if (!question.isResolved) {
				console.log("Oracle has not resolved this question yet");
				return;
			}

			const answer = await oracle.getAnswer(
				{ questionId: market.oracle_question_id },
				{ client: this.publicClient },
			);

			console.log(`Oracle answer: ${answer.answerData}`);
			console.log(`Resolved by: ${answer.resolver}`);

			// Parse answer based on market type
			let winningOutcome: number;

			switch (market.category) {
				case "binary":
					winningOutcome = answer.answerData === "0x31" ? 0 : 1; // "1" = true, "0" = false
					console.log(
						`Winning outcome: ${winningOutcome === 0 ? "FALSE" : "TRUE"}`,
					);
					break;
				case "categorical":
					// Parse categorical answer (implementation depends on your format)
					winningOutcome = 0; // Simplified
					console.log(
						`Winning outcome: ${market.outcomes?.[winningOutcome]}`,
					);
					break;
				case "numerical":
					winningOutcome = Number(answer.answerData);
					console.log(`Winning outcome: ${winningOutcome}`);
					break;
				default:
					throw new Error("Unknown market type");
			}

			// Settle positions
			await this.settlePositions(market_id, winningOutcome);

			market.resolved = true;
			console.log(`✅ Market resolved successfully!`);
		} catch (error) {
			console.error("❌ Failed to resolve market:", error);
			throw error;
		}
	}

	/**
	 * Manually resolve using resolver privileges
	 */
	async manuallyResolveMarket(
		market_id: string,
		outcome: number,
	): Promise<void> {
		console.log(`\n🎯 Manually Resolving Market: ${market_id}`);
		console.log(`Outcome: ${outcome}`);
		console.log("-".repeat(40));

		const market = this.markets.get(market_id);
		if (!market || !market.oracle_question_id) {
			throw new Error("Invalid market");
		}

		try {
			let tx: `0x${string}` | TransactionReceiptReturn;

			if (market.category === "binary") {
				tx = await resolvers.binary.resolve(
					{
						questionId: market.oracle_question_id,
						outcome: outcome as 0 | 1,
						proof: "This is a manual resolution by authorized resolver, and this serves as the proof. Source: Sybex Oracle Data Feed.",
					},
					{
						client: this.walletClient,
						waitForTransaction: true,
					},
				);
			} else if (market.category === "categorical") {
				tx = await resolvers.categorical.resolve(
					{
						questionId: market.oracle_question_id,
						categoryIndex: outcome,
						proof: "This is a manual resolution by authorized resolver, and this serves as the proof. Source: Sybex Oracle Data Feed.",
					},
					{
						client: this.walletClient,
						waitForTransaction: true,
					},
				);
			} else if (market.category === "numerical") {
				tx = await resolvers.numerical.resolve(
					{
						questionId: market.oracle_question_id,
						numericAnswer: BigInt(outcome),
						proof: "This is a manual resolution by authorized resolver, and this serves as the proof. Source: Sybex Oracle Data Feed.",
					},
					{
						client: this.walletClient,
						waitForTransaction: true,
					},
				);
			} else {
				throw new Error("Unknown market type for manual resolution");
			}

			console.log(`✅ Oracle question resolved! TX: ${tx.toString()}`);

			// Now settle the market
			await this.resolveMarket(market_id);
		} catch (error) {
			console.error("❌ Failed to manually resolve:", error);
			throw error;
		}
	}

	private async settlePositions(market_id: string, winningOutcome: number) {
		const positions = this.positions.get(market_id) || [];
		const totalWinningShares = positions
			.filter((p) => p.outcome === winningOutcome)
			.reduce((sum, p) => sum + p.shares, 0);

		console.log(`\n💰 Settling ${positions.length} positions`);
		console.log(`Total winning shares: ${totalWinningShares}`);
		console.log(`Winning outcome: ${winningOutcome}`);

		positions.forEach((pos) => {
			if (pos.outcome === winningOutcome) {
				// Winner gets proportional payout
				const payout =
					(pos.shares / totalWinningShares) *
					(positions.length * 100); // Simplified
				console.log(
					`${pos.user}: Won ${payout.toFixed(2)} (${pos.shares} shares)`,
				);
			} else {
				console.log(`${pos.user}: Lost ${pos.amount}`);
			}
		});
	}

	private async getQuestionIdFromTx(_tx: string): Promise<bigint> {
		// In a real implementation, parse transaction logs to get the question ID
		// For now, return a mock ID
		return BigInt(Date.now());
	}

	/**
	 * List all markets
	 */
	listMarkets() {
		console.log("\n📊 All Prediction Markets");
		console.log("-".repeat(40));

		this.markets.forEach((market, id) => {
			const stats = this.getMarketStats(id);
			if (stats) {
				console.log(`\n${id}:`);
				console.log(`  Question: ${market.question}`);
				console.log(`  Category: ${market.category}`);
				console.log(`  Volume: $${market.total_volume}`);
				console.log(
					`  Status: ${market.resolved ? "✅ Resolved" : "⏳ Active"}`,
				);
				console.log(
					`  Time left: ${(stats.timeRemaining / (1000 * 60 * 60)).toFixed(1)} hours`,
				);

				if (Object.keys(stats.odds).length > 0) {
					console.log(`  Odds:`);
					Object.entries(stats.odds).forEach(([outcome, odds]) => {
						const outcomeLabel =
							market.outcomes?.[Number(outcome)] || outcome;
						console.log(`    ${outcomeLabel}: ${odds.toFixed(2)}x`);
					});
				}
			}
		});
	}
}

async function predictionMarketExample() {
	console.log("🎲 Prediction Market Example\n");

	const { publicClient, walletClient } = createClients("testnet");
	const platform = new PredictionMarketPlatform(publicClient, walletClient);

	try {
		// Example 1: Create different types of markets
		console.log("📊 Example 1: Creating Markets");

		// Binary market
		const binaryMarket = await platform.createMarket({
			question: "Will Bitcoin price exceed $50,000 by December 31, 2024?",
			category: "binary",
			duration: 720, // 30 days
		});

		// Categorical market
		const categoricalMarket = await platform.createMarket({
			question: "Which team will win the 2024 World Cup?",
			category: "categorical",
			outcomes: ["Brazil", "Argentina", "France", "Germany", "Other"],
			duration: 2160, // 90 days
		});

		// Numerical market
		const numericalMarket = await platform.createMarket({
			question:
				"What will be the final price of ETH on December 31, 2024?",
			category: "numerical",
			duration: 720, // 30 days
		});

		// Example 2: Place bets on markets
		console.log("\n💰 Example 2: Placing Bets");

		await platform.placeBet({
			market_id: binaryMarket.id,
			outcome: 1, // Yes
			amount: 100,
		});

		await platform.placeBet({
			market_id: categoricalMarket.id,
			outcome: 0, // Brazil
			amount: 50,
		});

		await platform.placeBet({
			market_id: numericalMarket.id,
			outcome: 3000, // $3000 prediction
			amount: 75,
		});

		// Example 3: Show market statistics
		console.log("\n📈 Example 3: Market Statistics");
		platform.listMarkets();

		// Example 4: Manually resolve a market (for demo)
		console.log("\n🎯 Example 4: Resolving Markets");

		// Resolve binary market
		await platform.manuallyResolveMarket(binaryMarket.id, 1); // True

		// Example 5: Create and resolve a quick market
		console.log("\n⚡ Example 5: Quick Market Demo");

		const quickMarket = await platform.createMarket({
			question: "Will this demo complete successfully?",
			category: "binary",
			duration: 1, // 1 hour
		});

		await platform.placeBet({
			market_id: quickMarket.id,
			outcome: 1,
			amount: 10,
		});

		// Immediately resolve it
		await platform.manuallyResolveMarket(quickMarket.id, 1);

		console.log("\n✅ Prediction market example completed!");
		console.log("\n💡 Key Features Implemented:");
		console.log("- Multiple market types (binary, categorical, numerical)");
		console.log("- Automatic resolution via SybexOracle");
		console.log("- Position tracking and settlement");
		console.log("- Real-time odds calculation");
		console.log("- Market statistics and reporting");
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

// Run the example
predictionMarketExample().catch(console.error);
