/**
 * AMM V2 - Market Creation Example
 *
 * This example demonstrates how to create prediction markets
 * using the Sybex AMM V2 contract.
 */

import { ammV2, QuestionType } from "../../src";
import { createClients } from "../config";

/**
 * Example 1: Create a Binary Market
 * A simple yes/no market
 */
async function createBinaryMarket() {
	console.log("\n📊 Example 1: Creating Binary Market");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	// Market parameters
	const question = "Will Bitcoin reach $100,000 by end of 2025?";
	const outcomeLabels = ["No", "Yes"]; // For binary, always 2 outcomes
	const questionType: QuestionType = QuestionType.BOOLEAN;
	const token = "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`; // USDT on BSC Testnet
	const deadline = BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60); // 30 days from now

	try {
		const txHash = await ammV2.createMarket(
			{
				question,
				outcomeLabels,
				questionType,
				token,
				deadline,
			},
			{
				client: walletClient,
				value: 1000000000000000000n, // Optional: initial liquidity in wei
				waitForTransaction: true,
			},
		);

		console.log("✅ Market created successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Get the market counter to find the new market ID
		const marketCounter = await ammV2.getMarketCounter({}, { client: publicClient });
		console.log(`Total Markets: ${marketCounter}`);
		console.log(`New Market ID: ${marketCounter - 1n}`);

		return marketCounter - 1n;
	} catch (error) {
		console.error("❌ Failed to create market:", error);
		throw error;
	}
}

/**
 * Example 2: Create a Categorical Market
 * A market with multiple outcome options
 */
async function createCategoricalMarket() {
	console.log("\n📊 Example 2: Creating Categorical Market");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const question = "Which team will win the Champions League 2025?";
	const outcomeLabels: string[] = [
		"Real Madrid",
		"Manchester City",
		"Bayern Munich",
		"PSG",
		"Other",
	];
	const questionType: QuestionType = QuestionType.CATEGORICAL;
	const token = "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`; // USDT on BSC Testnet
	const deadline = BigInt(Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60); // 180 days

	try {
		const txHash = await ammV2.createMarket(
			{
				question,
				outcomeLabels,
				questionType,
				token,
				deadline,
			},
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Categorical market created successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		const marketCounter = await ammV2.getMarketCounter({}, { client: publicClient });
		console.log(`New Market ID: ${marketCounter - 1n}`);

		return marketCounter - 1n;
	} catch (error) {
		console.error("❌ Failed to create categorical market:", error);
		throw error;
	}
}

/**
 * Example 3: Create a Numerical Market
 * A market for numerical predictions
 */
async function createNumericalMarket() {
	console.log("\n📊 Example 3: Creating Numerical Market");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const question = "What will be the price of ETH in USD on December 31, 2025?";
	const outcomeLabels: string[] = []; // Empty for numerical
	const questionType: QuestionType = QuestionType.NUMERICAL;
	const token = "0x55d398326f99059fF775485246999027B3197955" as `0x${string}`; // USDT on BSC Testnet
	const deadline = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 365 days

	try {
		const txHash = await ammV2.createMarket(
			{
				question,
				outcomeLabels,
				questionType,
				token,
				deadline,
			},
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Numerical market created successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		const marketCounter = await ammV2.getMarketCounter({}, { client: publicClient });
		console.log(`New Market ID: ${marketCounter - 1n}`);

		return marketCounter - 1n;
	} catch (error) {
		console.error("❌ Failed to create numerical market:", error);
		throw error;
	}
}

/**
 * Example 4: Get Market Information
 */
async function getMarketInfo(marketId: bigint) {
	console.log("\n📋 Example 4: Getting Market Information");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	try {
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		console.log("\nMarket Details:");
		console.log(`Question: ${market.question}`);
		console.log(`Question Type: ${market.questionType}`);
		console.log(`Token: ${market.token}`);
		console.log(`Status: ${getMarketStatusName(market.status)}`);
		console.log(`Total Pool: ${market.totalPool.toString()}`);
		console.log(`Total Fees: ${market.totalFees.toString()}`);
		console.log(`Winning Outcome: ${market.winningOutcome.toString()}`);
		console.log(`Deadline: ${new Date(Number(market.deadline) * 1000).toISOString()}`);
		console.log(`Owner: ${market.owner}`);

		// Get outcome labels
		console.log("\nOutcome Labels:");
		for (let i = 0; i < 10; i++) {
			try {
				const label = await ammV2.getOutcomeLabel(
					{ marketId, outcomeId: BigInt(i) },
					{ client: publicClient },
				);
				if (label) {
					console.log(`  Outcome ${i}: ${label}`);
				}
			} catch {
				break; // No more outcomes
			}
		}

		// Get outcome pools
		console.log("\nOutcome Pools:");
		for (let i = 0; i < 10; i++) {
			try {
				const pool = await ammV2.getOutcomePool(
					{ marketId, outcomeId: BigInt(i) },
					{ client: publicClient },
				);
				if (pool > 0n) {
					const label = await ammV2.getOutcomeLabel(
						{ marketId, outcomeId: BigInt(i) },
						{ client: publicClient },
					);
					console.log(`  ${label}: ${pool.toString()}`);
				}
			} catch {
				break;
			}
		}

		return market;
	} catch (error) {
		console.error("❌ Failed to get market info:", error);
		throw error;
	}
}

/**
 * Helper function to convert market status to string
 */
function getMarketStatusName(status: number): string {
	switch (status) {
		case 0:
			return "ACTIVE";
		case 1:
			return "CANCELLED";
		case 2:
			return "RESOLVED";
		default:
			return "UNKNOWN";
	}
}

/**
 * Example 5: Check Token Support
 */
async function checkTokenSupport() {
	console.log("\n🔍 Example 5: Checking Token Support");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	const tokens = [
		"0x55d398326f99059fF775485246999027B3197955", // USDT
		"0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // USDC
	];

	for (const token of tokens) {
		try {
			const isSupported = await ammV2.isTokenSupported(
				{ token },
				{ client: publicClient },
			);
			console.log(`${token}: ${isSupported ? "✅ Supported" : "❌ Not supported"}`);
		} catch (error) {
			console.error(`Error checking ${token}:`, error);
		}
	}
}

/**
 * Example 6: Get AMM Configuration
 */
async function getAmmConfiguration() {
	console.log("\n⚙️ Example 6: Getting AMM Configuration");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	try {
		// Get fee percentage
		const feePercentage = await ammV2.getFeePercentage({}, { client: publicClient });
		console.log(`Fee Percentage: ${feePercentage.toString()}`);

		// Get fee recipient
		const feeRecipient = await ammV2.getFeeRecipient({}, { client: publicClient });
		console.log(`Fee Recipient: ${feeRecipient}`);

		// Get oracle address
		const oracle = await ammV2.getSybexOracle({}, { client: publicClient });
		console.log(`Oracle Address: ${oracle}`);

		// Get accumulated fees
		const accumulatedFees = await ammV2.getAccumulatedFees(
			{},
			{ client: publicClient },
		);
		console.log(`Accumulated Fees: ${accumulatedFees.toString()}`);
	} catch (error) {
		console.error("❌ Failed to get AMM configuration:", error);
	}
}

/**
 * Main execution function
 */
async function main() {
	console.log("🎲 AMM V2 Market Creation Examples");
	console.log("=".repeat(50));

	try {
		// Check AMM configuration first
		await getAmmConfiguration();

		// Check token support
		await checkTokenSupport();

		// Create different types of markets
		const binaryMarketId = await createBinaryMarket();
		await getMarketInfo(binaryMarketId);

		const categoricalMarketId = await createCategoricalMarket();
		await getMarketInfo(categoricalMarketId);

		const numericalMarketId = await createNumericalMarket();
		await getMarketInfo(numericalMarketId);

		console.log("\n✅ All examples completed successfully!");
	} catch (error) {
		console.error("\n❌ Example failed:", error);
		process.exit(1);
	}
}

// Run the examples
main().catch(console.error);
