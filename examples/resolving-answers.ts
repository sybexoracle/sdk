/**
 * Resolving Answers Example
 *
 * This example demonstrates how to:
 * - Act as a resolver for the SybexOracle
 * - Provide answers to questions
 * - Use different resolver types
 * - Manage resolver permissions
 */

import { oracle, resolvers } from "../src";
import { createClients, EXAMPLE_ADDRESSES } from "./config";

async function resolvingAnswersExample() {
  console.log("✅ SybexOracle Resolving Answers Example\n");

  const { publicClient, walletClient } = createClients("testnet");

  try {
    // First, check if we're a resolver
    console.log("🔑 Checking Resolver Status");
    console.log("-".repeat(40));

    const isResolver = await oracle.isResolver(
      { resolver: walletClient.account!.address },
      { client: publicClient }
    );

    console.log(`Address: ${walletClient.account!.address}`);
    console.log(`Is Resolver: ${isResolver}`);

    if (!isResolver) {
      console.log("\n⚠️ Note: This address is not a resolver.");
      console.log("You need resolver permissions to provide answers.");
      console.log("Continuing with example assuming you have permissions...\n");
    }

    // Example 1: Resolve a binary question
    console.log("📝 Example 1: Resolving a Binary Question");
    console.log("-".repeat(40));

    // In a real scenario, you would have a real question ID
    const binaryQuestionId = BigInt(1); // Replace with actual question ID

    try {
      // Check the question first
      const question = await oracle.getQuestion(
        { questionId: binaryQuestionId },
        { client: publicClient }
      );

      console.log(`Question ID: ${binaryQuestionId}`);
      console.log(`Question: ${question.questionText}`);
      console.log(`Type: ${question.questionType}`);
      console.log(`Resolved: ${question.isResolved}`);

      if (!question.isResolved && question.questionType === QuestionType.BOOLEAN) {
        // Resolve as true (1) or false (0)
        const outcome = 1; // 1 = true, 0 = false
        console.log(`\nResolving with outcome: ${outcome === 1 ? "TRUE" : "FALSE"}`);

        const resolveTx = await resolvers.binary.resolve(
          { questionId: binaryQuestionId, outcome: outcome as 0 | 1 },
          {
            client: walletClient,
            waitForTransaction: true,
          }
        );

        console.log(`✅ Binary question resolved! TX: ${resolveTx}`);
      } else if (question.isResolved) {
        console.log("❌ Question is already resolved");
      } else {
        console.log("❌ Question is not a binary type");
      }
    } catch (error) {
      console.log("❌ Could not resolve binary question (may not exist)");
    }

    // Example 2: Resolve a categorical question
    console.log("\n📊 Example 2: Resolving a Categorical Question");
    console.log("-".repeat(40));

    const categoricalQuestionId = BigInt(2); // Replace with actual question ID

    try {
      const question = await oracle.getQuestion(
        { questionId: categoricalQuestionId },
        { client: publicClient }
      );

      console.log(`Question ID: ${categoricalQuestionId}`);
      console.log(`Question: ${question.questionText}`);
      console.log(`Type: ${question.questionType}`);

      if (!question.isResolved && question.questionType === QuestionType.CATEGORICAL) {
        // Categories are indexed (0, 1, 2, ...)
        // Example categories: 0=OptionA, 1=OptionB, 2=OptionC, etc.
        const categoryIndex = 1; // Selecting Option B
        console.log(`\nResolving with category index: ${categoryIndex}`);

        const resolveTx = await resolvers.categorical.resolve(
          { questionId: categoricalQuestionId, categoryIndex },
          {
            client: walletClient,
            waitForTransaction: true,
          }
        );

        console.log(`✅ Categorical question resolved! TX: ${resolveTx}`);
      }
    } catch (error) {
      console.log("❌ Could not resolve categorical question (may not exist)");
    }

    // Example 3: Resolve a numerical question
    console.log("\n🔢 Example 3: Resolving a Numerical Question");
    console.log("-".repeat(40));

    const numericalQuestionId = BigInt(3); // Replace with actual question ID

    try {
      const question = await oracle.getQuestion(
        { questionId: numericalQuestionId },
        { client: publicClient }
      );

      console.log(`Question ID: ${numericalQuestionId}`);
      console.log(`Question: ${question.questionText}`);

      if (!question.isResolved && question.questionType === QuestionType.NUMERICAL) {
        // Provide a numerical answer (as a regular number, will be converted to BigInt)
        const numericAnswer = 3500; // Example: $3500
        console.log(`\nResolving with numerical answer: ${numericAnswer}`);

        const resolveTx = await resolvers.numerical.resolve(
          { questionId: numericalQuestionId, numericAnswer },
          {
            client: walletClient,
            waitForTransaction: true,
          }
        );

        console.log(`✅ Numerical question resolved! TX: ${resolveTx}`);
      }
    } catch (error) {
      console.log("❌ Could not resolve numerical question (may not exist)");
    }

    // Example 4: Resolve a range numerical question
    console.log("\n📏 Example 4: Resolving a Range Numerical Question");
    console.log("-".repeat(40));

    const rangeNumericalQuestionId = BigInt(4); // Replace with actual question ID

    try {
      const question = await oracle.getQuestion(
        { questionId: rangeNumericalQuestionId },
        { client: publicClient }
      );

      console.log(`Question ID: ${rangeNumericalQuestionId}`);
      console.log(`Question: ${question.questionText}`);

      if (!question.isResolved && question.questionType === QuestionType.RANGE_NUMERICAL) {
        // Provide a range [lowerBound, upperBound]
        const lowerBound = 3000;
        const upperBound = 4000;
        console.log(`\nResolving with range: [${lowerBound}, ${upperBound}]`);

        const resolveTx = await resolvers.rangeNumerical.resolve(
          { questionId: rangeNumericalQuestionId, lowerBound, upperBound },
          {
            client: walletClient,
            waitForTransaction: true,
          }
        );

        console.log(`✅ Range numerical question resolved! TX: ${resolveTx}`);
      }
    } catch (error) {
      console.log("❌ Could not resolve range numerical question (may not exist)");
    }

    // Example 5: Provide a custom answer for general questions
    console.log("\n🔍 Example 5: Providing Custom Answer");
    console.log("-".repeat(40));

    const generalQuestionId = BigInt(5); // Replace with actual question ID

    try {
      const question = await oracle.getQuestion(
        { questionId: generalQuestionId },
        { client: publicClient }
      );

      if (!question.isResolved) {
        // Custom answer data (can be stringified JSON, hash, etc.)
        const answerData = "0x" + Buffer.from("Result: Candidate A", "utf8").toString("hex");
        console.log(`\nProviding answer: ${answerData}`);

        const answerTx = await oracle.provideAnswer(
          { questionId: generalQuestionId, answerData: answerData as `0x${string}` },
          {
            client: walletClient,
            waitForTransaction: true,
          }
        );

        console.log(`✅ Custom answer provided! TX: ${answerTx}`);
      }
    } catch (error) {
      console.log("❌ Could not provide answer (may not exist or no permissions)");
    }

    // Example 6: Manage resolver permissions (admin only)
    console.log("\n🔐 Example 6: Managing Resolver Permissions");
    console.log("-".repeat(40));

    const newResolverAddress = EXAMPLE_ADDRESSES.trustedResolver;

    try {
      // Grant resolver role
      console.log(`Granting resolver role to: ${newResolverAddress}`);

      const grantTx = await resolvers.binary.grantRole(
        {
          role: "0x9d8eef2d77b408ce23bfc4866c9e6e5e4f2e2c5e6c3f7c6d6b696c6c5f5e5d5c", // RESOLVER_ROLE
          account: newResolverAddress,
        },
        {
          client: walletClient,
          waitForTransaction: true,
        }
      );

      console.log(`✅ Resolver role granted! TX: ${grantTx}`);

      // Later, you can revoke it
      console.log(`\nRevoking resolver role from: ${newResolverAddress}`);

      const revokeTx = await resolvers.binary.revokeRole(
        {
          role: "0x9d8eef2d77b408ce23bfc4866c9e6e5e4f2e2c5e6c3f7c6d6b696c6c5f5e5d5c", // RESOLVER_ROLE
          account: newResolverAddress,
        },
        {
          client: walletClient,
          waitForTransaction: true,
        }
      );

      console.log(`✅ Resolver role revoked! TX: ${revokeTx}`);
    } catch (error) {
      console.log("❌ Could not manage resolver permissions (need admin role)");
    }

    console.log("\n✅ Resolution examples completed!");
    console.log("\n💡 Best Practices:");
    console.log("- Always verify questions before resolving");
    console.log("- Use reliable data sources for answers");
    console.log("- Document your resolution methodology");
    console.log("- Be transparent about potential conflicts of interest");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Import QuestionType enum (it's exported from types)
import { QuestionType } from "../src";

// Run the example
resolvingAnswersExample().catch(console.error);