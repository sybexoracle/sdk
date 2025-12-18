/**
 * Basic Oracle Queries Example
 *
 * This example demonstrates how to:
 * - Read basic information from the SybexOracle
 * - Check oracle status and configuration
 * - Query questions and answers
 */

import { oracle } from "../src";
import { createClients } from "./config";

async function basicQueriesExample() {
	console.log("🔍 SybexOracle Basic Queries Example\n");

	const { publicClient } = createClients("testnet");

	try {
		// 1. Get basic oracle information
		console.log("📊 Oracle Information:");
		console.log("-".repeat(40));

		const questionCount = await oracle.getQuestionCount(
			{},
			{ client: publicClient },
		);
		console.log(`Total Questions: ${questionCount}`);

		const questionFee = await oracle.getQuestionFee(
			{},
			{ client: publicClient },
		);
		console.log(`Question Fee: ${questionFee} wei`);

		const feeRecipient = await oracle.getFeeRecipient(
			{},
			{ client: publicClient },
		);
		console.log(`Fee Recipient: ${feeRecipient}`);

		// 2. Get oracle configuration
		console.log("\n⚙️ Oracle Configuration:");
		console.log("-".repeat(40));

		const maxQuestionLength = await oracle.getMaxQuestionLength(
			{},
			{ client: publicClient },
		);
		console.log(`Max Question Length: ${maxQuestionLength} characters`);

		const minQuestionLength = await oracle.getMinQuestionLength(
			{},
			{ client: publicClient },
		);
		console.log(`Min Question Length: ${minQuestionLength} characters`);

		const maxTimeout = await oracle.getMaxTimeout(
			{},
			{ client: publicClient },
		);
		console.log(
			`Max Timeout: ${maxTimeout} seconds (${(Number(maxTimeout) / 86400).toFixed(1)} days)`,
		);

		const minTimeout = await oracle.getMinTimeout(
			{},
			{ client: publicClient },
		);
		console.log(
			`Min Timeout: ${minTimeout} seconds (${(Number(minTimeout) / 60).toFixed(1)} minutes)`,
		);

		const feeDenominator = await oracle.getFeeDenominator(
			{},
			{ client: publicClient },
		);
		console.log(`Fee Denominator: ${feeDenominator}`);

		const refundPeriod = await oracle.getRefundPeriod(
			{},
			{ client: publicClient },
		);
		console.log(
			`Refund Period: ${refundPeriod} seconds (${(Number(refundPeriod) / 86400).toFixed(1)} days)`,
		);

		// 3. Check if an address is a resolver
		const checkAddress = "0x1234567890123456789012345678901234567890";
		const isResolver = await oracle.isResolver(
			{ resolver: checkAddress as `0x${string}` },
			{ client: publicClient },
		);
		console.log(`\n🔑 Is ${checkAddress} a resolver? ${isResolver}`);

		// 4. Query a specific question (example)
		// Note: Replace with an actual question ID from your network
		const questionId = BigInt(1);
		try {
			const question = await oracle.getQuestion(
				{ questionId },
				{ client: publicClient },
			);
			console.log(`\n❓ Question ${questionId}:`);
			console.log(`Text: ${question.questionText}`);
			console.log(`Type: ${question.questionType}`);
			console.log(`Timeout: ${question.timeout} seconds`);
			console.log(`Asker: ${question.asker}`);
			console.log(`Is Resolved: ${question.isResolved}`);
			console.log(
				`Created At: ${new Date(Number(question.createdAt) * 1000).toISOString()}`,
			);

			// Get the answer if it exists
			if (question.isResolved) {
				const answer = await oracle.getAnswer(
					{ questionId },
					{ client: publicClient },
				);
				console.log(`\n✅ Answer: ${answer.answerData}`);
				console.log(`Resolver: ${answer.resolver}`);
			}
		} catch (_error) {
			console.log(
				`\n❓ Question ${questionId} not found or error occurred`,
			);
		}

		// 5. Check roles (if you have admin permissions)
		const DEFAULT_ADMIN_ROLE =
			"0x0000000000000000000000000000000000000000000000000000000000000000";
		const RESOLVER_ROLE =
			"0x9d8eef2d77b408ce23bfc4866c9e6e5e4f2e2c5e6c3f7c6d6b696c6c5f5e5d5c";

		try {
			const hasAdminRole = await oracle.hasRole(
				{
					role: DEFAULT_ADMIN_ROLE as `0x${string}`,
					account: checkAddress as `0x${string}`,
				},
				{ client: publicClient },
			);
			console.log(`\n👑 Has Admin Role: ${hasAdminRole}`);

			const hasResolverRole = await oracle.hasRole(
				{
					role: RESOLVER_ROLE as `0x${string}`,
					account: checkAddress as `0x${string}`,
				},
				{ client: publicClient },
			);
			console.log(`🔑 Has Resolver Role: ${hasResolverRole}`);
		} catch (_error) {
			console.log("\n⚠️ Could not check roles (permission denied)");
		}

		console.log("\n✅ Basic queries completed successfully!");
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

// Run the example
basicQueriesExample().catch(console.error);
