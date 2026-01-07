/**
 * AMM V2 - Market Resolution & Settlement Example
 *
 * This example demonstrates how to resolve markets
 * and claim winnings using the Sybex AMM V2 contract.
 */

import { ammV2, oracle, resolvers } from "../../src";
import { createClients } from "../config";

/**
 * Example 1: Resolve Market (by authorized resolver)
 */
async function resolveMarket(marketId: bigint) {
	console.log("\n🎯 Example 1: Resolving Market");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	try {
		console.log(`Market ID: ${marketId}`);

		// Check current market status
		const marketBefore = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);

		if (marketBefore.status === 2) {
			console.log("Market is already resolved");
			return;
		}

		console.log(`Current Status: ${getStatusName(marketBefore.status)}`);

		// Resolve the market
		// Note: This requires authorization (DEFAULT_ADMIN_ROLE or ADMIN_ROLE)
		const txHash = await ammV2.resolveMarket(
			{ marketId },
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Market resolved successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Check updated status
		const marketAfter = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);

		console.log(`New Status: ${getStatusName(marketAfter.status)}`);
		console.log(`Winning Outcome: ${marketAfter.winningOutcome.toString()}`);

		return marketAfter;
	} catch (error) {
		console.error("❌ Failed to resolve market:", error);
		console.error("\n💡 Note: Market resolution requires authorized role");
		console.error("   Ensure your wallet has DEFAULT_ADMIN_ROLE or ADMIN_ROLE");
		throw error;
	}
}

/**
 * Example 2: Cancel Market (by market owner or authorized role)
 */
async function cancelMarket(marketId: bigint) {
	console.log("\n🚫 Example 2: Cancelling Market");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	try {
		console.log(`Market ID: ${marketId}`);

		// Check current market status
		const marketBefore = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);

		if (marketBefore.status === 1) {
			console.log("Market is already cancelled");
			return;
		}

		if (marketBefore.status === 2) {
			console.log("Cannot cancel: Market is already resolved");
			return;
		}

		console.log(`Current Status: ${getStatusName(marketBefore.status)}`);

		// Cancel the market
		// Note: Only market owner or authorized role can cancel
		const txHash = await ammV2.cancelMarket(
			{ marketId },
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Market cancelled successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Check updated status
		const marketAfter = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);

		console.log(`New Status: ${getStatusName(marketAfter.status)}`);

		return marketAfter;
	} catch (error) {
		console.error("❌ Failed to cancel market:", error);
		console.error("\n💡 Note: Market cancellation requires:");
		console.error("   - Being the market owner, OR");
		console.error("   - Having DEFAULT_ADMIN_ROLE or ADMIN_ROLE");
		throw error;
	}
}

/**
 * Example 3: Claim Winnings from Resolved Market
 */
async function claimWinnings(marketId: bigint) {
	console.log("\n💰 Example 3: Claiming Winnings");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const userAddress = walletClient.account?.address;
	if (!userAddress) {
		console.error("No wallet address available");
		return;
	}

	try {
		console.log(`Market ID: ${marketId}`);
		console.log(`User Address: ${userAddress}`);

		// Check market status
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		if (market.status !== 2) {
			console.log("⚠️ Market is not resolved yet");
			console.log(`Current Status: ${getStatusName(market.status)}`);
			return;
		}

		console.log(`Winning Outcome: ${market.winningOutcome.toString()}`);

		// Check user's positions
		console.log("\nChecking your positions...");

		let winningPosition = 0n;
		const winningOutcomeLabel = await ammV2.getOutcomeLabel(
			{ marketId, outcomeId: market.winningOutcome },
			{ client: publicClient },
		);

		try {
			winningPosition = await ammV2.getUserPosition(
				{ marketId, outcomeId: market.winningOutcome, user: userAddress },
				{ client: publicClient },
			);
			console.log(`Position in ${winningOutcomeLabel}: ${winningPosition.toString()} shares`);
		} catch {
			console.log("No winning position found");
		}

		if (winningPosition === 0n) {
			console.log("❌ You don't have any winning positions to claim");
			return;
		}

		// Claim winnings
		console.log("\nClaiming winnings...");
		const txHash = await ammV2.claimWinnings(
			{ marketId },
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Winnings claimed successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		// Check remaining position (should be 0 after claim)
		const remainingPosition = await ammV2.getUserPosition(
			{ marketId, outcomeId: market.winningOutcome, user: userAddress },
			{ client: publicClient },
		);
		console.log(`Remaining Position: ${remainingPosition.toString()}`);

		return txHash;
	} catch (error) {
		console.error("❌ Failed to claim winnings:", error);
		throw error;
	}
}

/**
 * Example 4: Request Refund from Cancelled Market
 */
async function requestRefund(marketId: bigint) {
	console.log("\n💸 Example 4: Requesting Refund");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	const userAddress = walletClient.account?.address;
	if (!userAddress) {
		console.error("No wallet address available");
		return;
	}

	try {
		console.log(`Market ID: ${marketId}`);
		console.log(`User Address: ${userAddress}`);

		// Check market status
		const market = await ammV2.getMarket({ marketId }, { client: publicClient });

		if (market.status !== 1) {
			console.log("⚠️ Market is not cancelled");
			console.log(`Current Status: ${getStatusName(market.status)}`);
			return;
		}

		// Check user's positions
		console.log("\nChecking your positions...");
		let totalPosition = 0n;

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
					console.log(`${label || `Outcome ${i}`}: ${position.toString()} shares`);
					totalPosition += position;
				}
			} catch {
				break;
			}
		}

		if (totalPosition === 0n) {
			console.log("❌ You don't have any positions to refund");
			return;
		}

		console.log(`Total Positions: ${totalPosition.toString()} shares`);

		// Request refund
		console.log("\nRequesting refund...");
		const txHash = await ammV2.refund(
			{ marketId },
			{
				client: walletClient,
				waitForTransaction: true,
			},
		);

		console.log("✅ Refund processed successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		return txHash;
	} catch (error) {
		console.error("❌ Failed to request refund:", error);
		throw error;
	}
}

/**
 * Example 5: Full Resolution Workflow
 * Complete process from resolution to claiming
 */
async function fullResolutionWorkflow(marketId: bigint, winningOutcome: bigint) {
	console.log("\n🔄 Example 5: Full Resolution Workflow");
	console.log("=".repeat(50));

	const { publicClient, walletClient } = createClients("testnet");

	try {
		console.log(`Market ID: ${marketId}`);
		console.log(`Intended Winning Outcome: ${winningOutcome.toString()}`);

		// Step 1: Check initial state
		console.log("\n📋 Step 1: Checking Initial Market State");
		const initialMarket = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);
		console.log(`Status: ${getStatusName(initialMarket.status)}`);
		console.log(`Total Pool: ${initialMarket.totalPool.toString()}`);

		// Step 2: Resolve the market
		if (initialMarket.status === 0) {
			console.log("\n🎯 Step 2: Resolving Market");
			await resolveMarket(marketId);
		} else {
			console.log("\n⏭️ Step 2: Market already resolved, skipping...");
		}

		// Step 3: Claim winnings
		console.log("\n💰 Step 3: Claiming Winnings");
		await claimWinnings(marketId);

		// Step 4: Verify final state
		console.log("\n📊 Step 4: Verifying Final State");
		const finalMarket = await ammV2.getMarket(
			{ marketId },
			{ client: publicClient },
		);
		console.log(`Status: ${getStatusName(finalMarket.status)}`);
		console.log(`Winning Outcome: ${finalMarket.winningOutcome.toString()}`);

		console.log("\n✅ Full resolution workflow completed!");
	} catch (error) {
		console.error("❌ Resolution workflow failed:", error);
		throw error;
	}
}

/**
 * Example 6: Batch Claim Winnings from Multiple Markets
 */
async function batchClaimWinnings(marketIds: bigint[]) {
	console.log("\n💎 Example 6: Batch Claiming Winnings");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	const results: Array<{ marketId: bigint; success: boolean; tx?: string }> = [];

	for (const marketId of marketIds) {
		try {
			console.log(`\nProcessing Market ${marketId}...`);

			// Check if market is resolved
			const market = await ammV2.getMarket(
				{ marketId },
				{ client: publicClient },
			);

			if (market.status !== 2) {
				console.log(`  ⏭️ Skipping: Not resolved (${getStatusName(market.status)})`);
				results.push({ marketId, success: false });
				continue;
			}

			// Try to claim winnings
			await claimWinnings(marketId);
			results.push({ marketId, success: true, tx: "Success" });
		} catch (error) {
			console.error(`  ❌ Failed to claim from market ${marketId}:`, error);
			results.push({ marketId, success: false });
		}
	}

	// Summary
	console.log("\n📊 Batch Claim Summary:");
	console.log("=".repeat(50));
	const successful = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	console.log(`Total Markets: ${marketIds.length}`);
	console.log(`✅ Successful: ${successful}`);
	console.log(`❌ Failed: ${failed}`);

	return results;
}

/**
 * Example 7: Check Oracle Question Status
 */
async function checkOracleQuestion(questionId: bigint) {
	console.log("\n🔮 Example 7: Checking Oracle Question Status");
	console.log("=".repeat(50));

	const { publicClient } = createClients("testnet");

	try {
		console.log(`Question ID: ${questionId}`);

		// Get question details
		const question = await oracle.getQuestion(
			{ questionId },
			{ client: publicClient },
		);

		console.log("\n📋 Question Details:");
		console.log(`Type: ${question.questionType}`);
		console.log(`Text: ${question.questionText}`);
		console.log(`Timeout: ${question.timeout.toString()}`);
		console.log(`Created At: ${new Date(Number(question.createdAt) * 1000).toISOString()}`);
		console.log(`Resolved: ${question.isResolved ? "Yes" : "No"}`);

		// Get answer if resolved
		if (question.isResolved) {
			const answer = await oracle.getAnswer(
				{ questionId },
				{ client: publicClient },
			);

			console.log("\n✅ Resolution Details:");
			console.log(`Answer Data: ${answer.answerData}`);
			console.log(`Resolver: ${answer.resolver}`);
		} else {
			console.log("\n⏳ Question not yet resolved");
		}

		return question;
	} catch (error) {
		console.error("❌ Failed to check oracle question:", error);
		throw error;
	}
}

/**
 * Example 8: Manually Resolve Oracle Question (by authorized resolver)
 */
async function manuallyResolveOracleQuestion(
	questionId: bigint,
	outcome: number,
	resolverType: "binary" | "categorical" | "numerical" = "binary",
) {
	console.log("\n🎯 Example 8: Manually Resolving Oracle Question");
	console.log("=".repeat(50));

	const { walletClient } = createClients("testnet");

	try {
		console.log(`Question ID: ${questionId}`);
		console.log(`Outcome: ${outcome}`);
		console.log(`Resolver Type: ${resolverType}`);

		const proof = "Manual resolution by authorized resolver. Source: Official data feed verification.";

		let txHash: `0x${string}`;

		switch (resolverType) {
			case "binary":
				txHash = await resolvers.binary.resolve(
					{
						questionId,
						outcome: outcome as 0 | 1,
						proof,
					},
					{
						client: walletClient,
						waitForTransaction: true,
					},
				);
				break;

			case "categorical":
				txHash = await resolvers.categorical.resolve(
					{
						questionId,
						categoryIndex: outcome,
						proof,
					},
					{
						client: walletClient,
						waitForTransaction: true,
					},
				);
				break;

			case "numerical":
				txHash = await resolvers.numerical.resolve(
					{
						questionId,
						numericAnswer: BigInt(outcome),
						proof,
					},
					{
						client: walletClient,
						waitForTransaction: true,
					},
				);
				break;
		}

		console.log("✅ Oracle question resolved successfully!");
		console.log(`Transaction Hash: ${txHash}`);

		return txHash;
	} catch (error) {
		console.error("❌ Failed to resolve oracle question:", error);
		console.error("\n💡 Note: Requires resolver role on the Oracle contract");
		throw error;
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
	console.log("🎲 AMM V2 Resolution & Settlement Examples");
	console.log("=".repeat(50));

	// Replace with actual market IDs
	const marketId = 1n;
	const questionId = 1n;

	try {
		// Example 1: Check oracle question first
		await checkOracleQuestion(questionId);

		// Example 2: Manually resolve oracle question (if needed)
		// await manuallyResolveOracleQuestion(questionId, 1, "binary");

		// Example 3: Full resolution workflow
		await fullResolutionWorkflow(marketId, 1n);

		// Example 4: Batch claim from multiple markets
		// await batchClaimWinnings([1n, 2n, 3n]);

		// Example 5: Cancel a market (if needed)
		// await cancelMarket(marketId);

		// Example 6: Request refund from cancelled market
		// await requestRefund(marketId);

		console.log("\n✅ All resolution examples completed!");
	} catch (error) {
		console.error("\n❌ Resolution example failed:", error);
		process.exit(1);
	}
}

// Run the examples
main().catch(console.error);
