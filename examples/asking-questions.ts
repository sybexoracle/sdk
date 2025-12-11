/**
 * Asking Questions Example
 *
 * This example demonstrates how to:
 * - Ask different types of questions to the oracle
 * - Pay question fees
 * - Handle question timeouts
 * - Monitor question status
 */

import { oracle } from "../src";
import { createClients } from "./config";

async function askingQuestionsExample() {
  console.log("❓ SybexOracle Asking Questions Example\n");

  const { publicClient, walletClient, account } = createClients("testnet");

  try {
    // Get current question fee
    const questionFee = await oracle.getQuestionFee({}, { client: publicClient });
    console.log(`Current question fee: ${questionFee} wei`);

    // Example 1: Ask a general yes/no question
    console.log("\n📝 Example 1: Asking a Boolean Question");
    console.log("-".repeat(40));

    const booleanQuestion = "Will Bitcoin price exceed $100,000 by December 31, 2024?";
    const timeout = BigInt(7 * 24 * 60 * 60); // 7 days in seconds

    console.log(`Question: ${booleanQuestion}`);
    console.log(`Timeout: ${timeout} seconds (7 days)`);

    const booleanTx = await oracle.askBoolean(
      {
        questionText: booleanQuestion,
        timeout,
        additionalData: "0x", // Optional additional data
      },
      {
        client: walletClient,
        value: questionFee, // Pay the fee
        waitForTransaction: true,
      }
    );

    console.log(`✅ Boolean question asked!`);
    console.log(`Transaction hash: ${booleanTx}`);

    // Example 2: Ask a numerical question
    console.log("\n📊 Example 2: Asking a Numerical Question");
    console.log("-".repeat(40));

    const numericalQuestion = "What will be the price of ETH in USD on December 31, 2024?";
    const numericalTimeout = BigInt(30 * 24 * 60 * 60); // 30 days

    console.log(`Question: ${numericalQuestion}`);
    console.log(`Timeout: ${numericalTimeout} seconds (30 days)`);

    const numericalTx = await oracle.askNumeric(
      {
        questionText: numericalQuestion,
        timeout: numericalTimeout,
        additionalData: "0x", // Optional metadata
      },
      {
        client: walletClient,
        value: questionFee,
        waitForTransaction: true,
      }
    );

    console.log(`✅ Numerical question asked!`);
    console.log(`Transaction hash: ${numericalTx}`);

    // Example 3: Ask a general question (custom type)
    console.log("\n🔍 Example 3: Asking a General Question");
    console.log("-".repeat(40));

    const generalQuestion = "Who will win the 2024 US Presidential Election?";
    const generalTimeout = BigInt(60 * 24 * 60 * 60); // 60 days

    console.log(`Question: ${generalQuestion}`);
    console.log(`Timeout: ${generalTimeout} seconds (60 days)`);

    const generalTx = await oracle.ask(
      {
        questionText: generalQuestion,
        timeout: generalTimeout,
        additionalData: JSON.stringify({
          category: "politics",
          tags: ["election", "usa", "2024"],
          source: "news",
        }),
      },
      {
        client: walletClient,
        value: questionFee,
        waitForTransaction: true,
      }
    );

    console.log(`✅ General question asked!`);
    console.log(`Transaction hash: ${generalTx}`);

    // Example 4: Batch asking multiple questions (for efficiency)
    console.log("\n📦 Example 4: Asking Multiple Questions");
    console.log("-".repeat(40));

    const questions = [
      {
        text: "Will the S&P 500 reach 5000 by Q2 2024?",
        type: "boolean" as const,
        timeout: BigInt(90 * 24 * 60 * 60), // 90 days
      },
      {
        text: "What will be the total TVL in DeFi by end of 2024 (in billions USD)?",
        type: "numerical" as const,
        timeout: BigInt(120 * 24 * 60 * 60), // 120 days
      },
      {
        text: "Which blockchain will have the most active addresses in 2024?",
        type: "general" as const,
        timeout: BigInt(365 * 24 * 60 * 60), // 1 year
      },
    ];

    console.log("Asking multiple questions...");

    for (const [index, q] of questions.entries()) {
      console.log(`\nQuestion ${index + 1}: ${q.text}`);

      let tx;
      switch (q.type) {
        case "boolean":
          tx = await oracle.askBoolean(
            { questionText: q.text, timeout: q.timeout },
            { client: walletClient, value: questionFee, waitForTransaction: true }
          );
          break;
        case "numerical":
          tx = await oracle.askNumeric(
            { questionText: q.text, timeout: q.timeout },
            { client: walletClient, value: questionFee, waitForTransaction: true }
          );
          break;
        case "general":
          tx = await oracle.ask(
            { questionText: q.text, timeout: q.timeout },
            { client: walletClient, value: questionFee, waitForTransaction: true }
          );
          break;
      }

      console.log(`  ✅ Asked! TX: ${tx}`);
    }

    // Example 5: Monitor question status
    console.log("\n👀 Example 5: Monitoring Question Status");
    console.log("-".repeat(40));

    // Get the latest question count
    const questionCount = await oracle.getQuestionCount({}, { client: publicClient });
    console.log(`Total questions in oracle: ${questionCount}`);

    // Check the last question
    if (questionCount > 0) {
      const lastQuestionId = questionCount - 1n;
      const question = await oracle.getQuestion(
        { questionId: lastQuestionId },
        { client: publicClient }
      );

      console.log(`\nLast Question (ID: ${lastQuestionId}):`);
      console.log(`Text: ${question.questionText}`);
      console.log(`Type: ${question.questionType}`);
      console.log(`Resolved: ${question.isResolved}`);
      console.log(`Asker: ${question.asker}`);

      if (!question.isResolved) {
        const timeLeft = Number(question.timeout) - (Date.now() / 1000 - Number(question.createdAt));
        if (timeLeft > 0) {
          console.log(`Time remaining: ${(timeLeft / 3600).toFixed(1)} hours`);
        } else {
          console.log("⚠️ Question has expired!");
        }
      }
    }

    console.log("\n✅ All questions asked successfully!");
    console.log("\n💡 Tips:");
    console.log("- Always check the current question fee before asking");
    console.log("- Set appropriate timeouts for your use case");
    console.log("- Use additionalData to store metadata for easier tracking");
    console.log("- Monitor your questions to ensure they get resolved");

  } catch (error) {
    console.error("❌ Error:", error);

    // Check if it's a fee issue
    if (error instanceof Error && error.message.includes("insufficient funds")) {
      console.log("\n💡 Tip: Make sure you have enough BNB for question fees and gas");
    }

    process.exit(1);
  }
}

// Run the example
askingQuestionsExample().catch(console.error);
