/**
 * AMM V2 - Trading Example
 *
 * This example demonstrates how to trade positions
 * in prediction markets using the Sybex AMM V2 contract.
 */

import { ammV2 } from "../../src";
import { createClients } from "../config";

/**
 * Example 1: Place Position with Native Token (BNB)
 */
async function placePositionWithNativeToken(marketId: bigint, outcomeId: bigint) {
	console.log("\n💰 Example 1: Placing Position with Native Token");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const amount = 100000000000000000n; // 0.1 BNB (in wei)

	try {
		console.log(`Market ID: ${marketId}`);
		console.log(`Outcome ID: ${outcomeId}`);
		console.log(`Amount: ${amount.toString()} wei (${Number(amount) / 1e18} BNB)`);

		const txHash = await ammV2.placePosition(
			{ marketId, outcomeId },
			{
				client: walletClient,
				value: amount, // Send BNB with the transaction
				waitForTransaction: true,
			},
		);

		console.log("✅ Position placed successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Check new position
		const userAddress = walletClient.account?.address;
		if (userAddress) {
			const position = await ammV2.getUserPosition(
				{ marketId, outcomeId, user: userAddress },
				{ client: publicClient },
			);
			console.log(`Your Position: ${position.toString()} shares`);
		}

		return txHash;
	} catch (error) {
		console.error("❌ Failed to place position:", error);
		throw error;
	}
}

/**
 * Example 2: Place Position with ERC20 Token
 */
async function placePositionWithToken(
	marketId: bigint,
	outcomeId: bigint,
	tokenAddress: string,
) {
	console.log("\n💰 Example 2: Placing Position with ERC20 Token");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const amount = 100000000n; // 100 USDT (assuming 6 decimals)

	try {
		console.log(`Market ID: ${marketId}`);
		console.log(`Outcome ID: ${outcomeId}`);
		console.log(`Token: ${tokenAddress}`);
		console.log(`Amount: ${amount.toString()} (${Number(amount) / 1e6} tokens)`);

		const txHash = await ammV2.placePositionWithToken(
			{ marketId, outcomeId, amount, token: tokenAddress as `0x${string}` },
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Position placed successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Check new position
		const userAddress = walletClient.account?.address;
		if (userAddress) {
			const position = await ammV2.getUserPosition(
				{ marketId, outcomeId, user: userAddress },
				{ client: publicClient },
			);
			console.log(`Your Position: ${position.toString()} shares`);
		}

		return txHash;
	} catch (error) {
		console.error("❌ Failed to place position:", error);
		throw error;
	}
}

/**
 * Example 3: Get User Positions Across Multiple Outcomes
 */
async function getUserPositions(marketId: bigint) {
	console.log("\n📊 Example 3: Getting User Positions");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const userAddress = walletClient.account?.address;
	if (!userAddress) {
		console.error("No wallet address available");
		return;
	}

	console.log(`User Address: ${userAddress}`);
	console.log(`Market ID: ${marketId}`);

	try {
		// Try to get positions for outcomes 0-9
		console.log("\nYour Positions:");
		let hasPositions = false;

		for (let i = 0; i < 10; i++) {
			try {
				const position = await ammV2.getUserPosition(
					{ marketId, outcomeId: BigInt(i), user: userAddress },
					{ client: publicClient },
				);

				if (position > 0n) {
					const label = await ammV2.getOutcomeLabel(
						{ marketId, outcomeId: BigInt(i) },
						{ client: publicClient },
					);
					console.log(`  ${label || `Outcome ${i}`}: ${position.toString()} shares`);
					hasPositions = true;
				}
			} catch {
				// Outcome doesn't exist, skip
			}
		}

		if (!hasPositions) {
			console.log("  No positions found in this market");
		}
	} catch (error) {
		console.error("❌ Failed to get user positions:", error);
	}
}

/**
 * Example 4: Calculate Potential Returns
 */
async function calculatePotentialReturns(marketId: bigint) {
	console.log("\n📈 Example 4: Calculating Potential Returns");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	try {
		// Get market data
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		console.log(`Market: ${market.question}`);
		console.log(`Total Pool: ${market.totalPool.toString()}`);

		// Get outcome pools and calculate implied odds
		console.log("\nOutcome Odds:");

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

					// Calculate implied probability
					const totalPool = market.totalPool;
					const impliedProbability = Number(pool) / Number(totalPool);
					const decimalOdds = totalPool > 0n ? Number(totalPool) / Number(pool) : 0;

					console.log(`\n  ${label || `Outcome ${i}`}:`);
					console.log(`    Pool: ${pool.toString()}`);
					console.log(`    Implied Probability: ${(impliedProbability * 100).toFixed(2)}%`);
					console.log(`    Decimal Odds: ${decimalOdds.toFixed(2)}x`);
					console.log(`    Potential Return (100 shares): ${decimalOdds * 100}`);
				}
			} catch {
				break;
			}
		}
	} catch (error) {
		console.error("❌ Failed to calculate returns:", error);
	}
}

/**
 * Example 5: Multiple Trades Strategy
 */
async function tradingStrategy(marketId: bigint) {
	console.log("\n🎯 Example 5: Trading Strategy");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	try {
		// Get market info
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		if (market.status !== 0) {
			console.log("Market is not active. Cannot trade.");
			return;
		}

		console.log(`Market: ${market.question}`);
		console.log(`Deadline: ${new Date(Number(market.deadline) * 1000).toISOString()}`);

		// Strategy 1: Diversified positions
		console.log("\n📊 Strategy 1: Diversified Positions");
		console.log("Spreading small positions across multiple outcomes");

		for (let i = 0; i < 3; i++) {
			try {
				const amount = 50000000000000000n; // 0.05 BNB each
				console.log(`\nPlacing ${Number(amount) / 1e18} BNB on outcome ${i}...`);

				await ammV2.placePosition(
					{ marketId, outcomeId: BigInt(i) },
					{
						client: walletClient,
						value: amount,
						waitForTransaction: true,
					},
				);
			} catch {
				// Outcome might not exist
				break;
			}
		}

		console.log("\n✅ Diversified positions placed!");
		await getUserPositions(marketId);

		// Strategy 2: Concentrated position (higher risk/reward)
		console.log("\n\n📊 Strategy 2: Concentrated Position");
		console.log("Placing larger position on single outcome");

		const concentratedAmount = 200000000000000000n; // 0.2 BNB
		await ammV2.placePosition(
			{ marketId, outcomeId: 0n }, // Bet on outcome 0
			{
				client: walletClient,
				value: concentratedAmount,
				waitForTransaction: true,
			},
		);

		console.log("\n✅ Concentrated position placed!");
		await getUserPositions(marketId);
	} catch (error) {
		console.error("❌ Trading strategy failed:", error);
	}
}

/**
 * Example 6: Market Analysis Before Trading
 */
async function marketAnalysis(marketId: bigint) {
	console.log("\n🔍 Example 6: Market Analysis");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	try {
		// Get market details
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		console.log("\n📊 Market Overview:");
		console.log(`Question: ${market.question}`);
		console.log(`Status: ${getStatusName(market.status)}`);
		console.log(`Total Pool: ${market.totalPool.toString()}`);
		console.log(`Total Fees: ${market.totalFees.toString()}`);

		if (market.status === 2) {
			console.log(`Winning Outcome: ${market.winningOutcome.toString()}`);
		}

		// Time analysis
		const now = Math.floor(Date.now() / 1000);
		const deadline = Number(market.deadline);
		const timeRemaining = deadline - now;

		console.log("\n⏰ Time Analysis:");
		if (timeRemaining > 0) {
			const days = Math.floor(timeRemaining / (24 * 60 * 60));
			const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
			console.log(`Time Remaining: ${days} days, ${hours} hours`);
		} else {
			console.log("⚠️ Market has passed deadline!");
		}

		// Outcome analysis
		console.log("\n🎯 Outcome Analysis:");
		let totalPool = 0n;

		for (let i = 0; i < 10; i++) {
			try {
				const pool = await ammV2.getOutcomePool(
					{ marketId, outcomeId: BigInt(i) },
					{ client: publicClient },
				);

				if (pool > 0n) {
					totalPool += pool;
					const label = await ammV2.getOutcomeLabel(
						{ marketId, outcomeId: BigInt(i) },
						{ client: publicClient },
					);

					const percentage = Number(pool) / Number(market.totalPool) * 100;
					console.log(`\n  ${label || `Outcome ${i}`}:`);
					console.log(`    Pool Size: ${pool.toString()}`);
					console.log(`    Pool Share: ${percentage.toFixed(2)}%`);
				}
			} catch {
				break;
			}
		}

		// Liquidity analysis
		console.log("\n💧 Liquidity Analysis:");
		console.log(`Total Pool Size: ${market.totalPool.toString()}`);
		console.log(`Market Depth: ${market.totalPool > 1000000000000000000n ? "High" : market.totalPool > 100000000000000000n ? "Medium" : "Low"}`);

		// Fee analysis
		const feePercentage = await ammV2.getFeePercentage({}, { client: publicClient });
		console.log(`\n💸 Fee Rate: ${feePercentage.toString() / 100n}%`);

	} catch (error) {
		console.error("❌ Market analysis failed:", error);
	}
}

/**
 * Helper function to convert status to name
 */
function getStatusName(status: number): string {
	switch (status) {
		case 0:
			return "Active";
		case 1:
			return "Cancelled";
		case 2:
			return "Resolved";
		default:
			return "Unknown";
	}
}

/**
 * Main execution function
 */
async function main() {
	console.log("💱 AMM V2 Trading Examples");
	console.log("=".repeat(50));

	// Use a known market ID or create one first
	const marketId = 1n; // Replace with actual market ID

	try {
		// Analyze the market first
		await marketAnalysis(marketId);

		// Calculate potential returns
		await calculatePotentialReturns(marketId);

		// Place a position with native token
		await placePositionWithNativeToken(marketId, 0n);

		// Get user positions
		await getUserPositions(marketId);

		// (Optional) Place position with ERC20 token
		// const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
		// await placePositionWithToken(marketId, 1n, usdtAddress);

		// Uncomment to run trading strategy example
		// await tradingStrategy(marketId);

		console.log("\n✅ All trading examples completed!");
	} catch (error) {
		console.error("\n❌ Trading example failed:", error);
		process.exit(1);
	}
}

// Run the examples
main().catch(console.error);
