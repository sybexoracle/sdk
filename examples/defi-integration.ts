/**
 * DeFi Integration Example
 *
 * This example demonstrates how to integrate SybexOracle
 * into a DeFi lending protocol for determining liquidation prices
 * and other critical parameters.
 */

import { oracle, resolvers } from "../src";
import { createClients } from "./config";

class DeFiPriceOracle {
  private publicClient: any;
  private walletClient: any;

  constructor(publicClient: any, walletClient: any) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  /**
   * Ask for the price of a crypto asset
   */
  async askForPrice(asset: string, timeoutHours: number = 24) {
    console.log(`\n💰 Asking for price of ${asset}`);
    console.log("-".repeat(40));

    const question = `What is the price of ${asset} in USD at ${new Date().toISOString()}?`;
    const timeout = BigInt(timeoutHours * 60 * 60); // Convert hours to seconds

    const questionFee = await oracle.getQuestionFee({}, { client: this.publicClient });

    const tx = await oracle.askNumeric(
      {
        questionText: question,
        timeout,
        additionalData: JSON.stringify({
          asset,
          requestId: Date.now(),
          requestedBy: this.walletClient.account!.address,
        }),
      },
      {
        client: this.walletClient,
        value: questionFee,
        waitForTransaction: true,
      }
    );

    console.log(`✅ Price request submitted! TX: ${tx}`);
    return tx;
  }

  /**
   * Monitor and resolve price questions
   */
  async monitorPrices() {
    console.log("\n👀 Monitoring price requests...");

    const questionCount = await oracle.getQuestionCount({}, { client: this.publicClient });

    // Check last 5 questions
    const recentQuestions = [];
    for (let i = 0n; i < 5n && i < questionCount; i++) {
      try {
        const questionId = questionCount - 1n - i;
        const question = await oracle.getQuestion(
          { questionId },
          { client: this.publicClient }
        );

        const additionalData = JSON.parse(question.additionalData || "{}");
        if (additionalData.asset) {
          recentQuestions.push({
            id: questionId,
            asset: additionalData.asset,
            text: question.questionText,
            resolved: question.isResolved,
            createdAt: Number(question.createdAt),
          });
        }
      } catch (error) {
        // Skip questions that don't exist
      }
    }

    console.log("\nRecent Price Requests:");
    recentQuestions.forEach((q) => {
      const age = (Date.now() / 1000 - q.createdAt) / 3600; // hours
      console.log(`- ${q.asset}: ${q.resolved ? "✅ Resolved" : "⏳ Pending"} (${age.toFixed(1)}h ago)`);
    });

    return recentQuestions;
  }

  /**
   * Provide price answer from a reliable source
   */
  async providePrice(questionId: bigint, asset: string, price: number) {
    console.log(`\n📝 Providing price for ${asset}: $${price}`);

    try {
      const tx = await resolvers.numerical.resolve(
        { questionId, numericAnswer: price },
        {
          client: this.walletClient,
          waitForTransaction: true,
        }
      );

      console.log(`✅ Price provided! TX: ${tx}`);
      return tx;
    } catch (error) {
      console.error("❌ Failed to provide price:", error);
      throw error;
    }
  }

  /**
   * Use oracle price in DeFi protocol
   */
  async updateProtocolPrice(asset: string, protocolAddress: string) {
    console.log(`\n🔄 Updating ${protocolAddress} with ${asset} price`);

    // Find the latest resolved price question for this asset
    const questionCount = await oracle.getQuestionCount({}, { client: this.publicClient });

    for (let i = 0n; i < questionCount; i++) {
      try {
        const questionId = questionCount - 1n - i;
        const question = await oracle.getQuestion(
          { questionId },
          { client: this.publicClient }
        );

        const additionalData = JSON.parse(question.additionalData || "{}");

        if (
          additionalData.asset === asset &&
          question.isResolved &&
          question.questionType === 2 // NUMERICAL
        ) {
          const answer = await oracle.getAnswer(
            { questionId },
            { client: this.publicClient }
          );

          const price = BigInt(Math.floor(Number(answer.answerData)));

          // Update the protocol contract (mock)
          console.log(`Updating protocol with price: ${price} (${Number(price)})`);

          // In a real implementation, you would call the contract:
          // const tx = await walletClient.writeContract({
          //   address: protocolAddress,
          //   abi: LENDING_PROTOCOL_ABI,
          //   functionName: "updateCollateralPrice",
          //   args: [assetAddress, price],
          // });

          console.log(`✅ Protocol updated with latest price!`);
          return price;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error(`No resolved price found for ${asset}`);
  }

  /**
   * Check if positions need liquidation based on oracle prices
   */
  async checkLiquidations(positions: Array<{ address: string; collateral: string; debt: number }>) {
    console.log("\n⚠️ Checking for liquidations...");
    console.log("-".repeat(40));

    for (const position of positions) {
      try {
        // Get current price from oracle
        const price = await this.getLatestPrice(position.collateral);

        if (!price) {
          console.log(`⏳ No price available for ${position.collateral}`);
          continue;
        }

        // Calculate health factor (simplified)
        const collateralValue = Number(price) * 1000; // Assuming 1000 units
        const healthFactor = (collateralValue / position.debt) * 100;

        console.log(`\nPosition: ${position.address}`);
        console.log(`Collateral: ${position.collateral} @ $${price}`);
        console.log(`Debt: $${position.debt}`);
        console.log(`Health Factor: ${healthFactor.toFixed(2)}%`);

        if (healthFactor < 150) { // Below 150% health factor
          console.log(`⚠️ POSITION AT RISK! Health factor: ${healthFactor.toFixed(2)}%`);

          if (healthFactor < 100) {
            console.log(`🚨 LIQUIDATION NEEDED!`);

            // In a real implementation:
            // await this.liquidatePosition(position.address);
          }
        }
      } catch (error) {
        console.log(`❌ Error checking position ${position.address}:`, error);
      }
    }
  }

  private async getLatestPrice(asset: string): Promise<number | null> {
    const questionCount = await oracle.getQuestionCount({}, { client: this.publicClient });

    for (let i = 0n; i < Math.min(50n, questionCount); i++) {
      try {
        const questionId = questionCount - 1n - i;
        const question = await oracle.getQuestion(
          { questionId },
          { client: this.publicClient }
        );

        const additionalData = JSON.parse(question.additionalData || "{}");

        if (
          additionalData.asset === asset &&
          question.isResolved &&
          question.questionType === 2 // NUMERICAL
        ) {
          const answer = await oracle.getAnswer(
            { questionId },
            { client: this.publicClient }
          );
          return Number(answer.answerData);
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }
}

async function defiIntegrationExample() {
  console.log("🏦 DeFi Integration Example\n");

  const { publicClient, walletClient } = createClients("testnet");
  const priceOracle = new DeFiPriceOracle(publicClient, walletClient);

  try {
    // Example 1: Ask for prices of major assets
    console.log("📊 Example 1: Requesting Asset Prices");

    const assets = ["BTC", "ETH", "BNB"];
    const priceRequests = [];

    for (const asset of assets) {
      const tx = await priceOracle.askForPrice(asset, 24); // 24 hour timeout
      priceRequests.push({ asset, tx });

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Example 2: Simulate receiving prices from external source
    console.log("\n📡 Example 2: Simulating Price Updates");

    // Wait a bit for questions to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    const recentQuestions = await priceOracle.monitorPrices();

    // Provide mock prices for demonstration
    const mockPrices = {
      "BTC": 43500,
      "ETH": 2250,
      "BNB": 310,
    };

    for (const question of recentQuestions) {
      if (!question.resolved && mockPrices[question.asset]) {
        await priceOracle.providePrice(
          question.id,
          question.asset,
          mockPrices[question.asset]
        );
      }
    }

    // Example 3: Update DeFi protocol with oracle prices
    console.log("\n🔄 Example 3: Updating DeFi Protocol");

    const mockProtocolAddress = "0x1234567890123456789012345678901234567890";

    for (const asset of assets) {
      try {
        const price = await priceOracle.updateProtocolPrice(asset, mockProtocolAddress);
        console.log(`Updated ${asset} price: $${Number(price)}`);
      } catch (error) {
        console.log(`Could not update ${asset}: ${error}`);
      }
    }

    // Example 4: Check liquidations
    console.log("\n⚠️ Example 4: Liquidation Risk Analysis");

    const mockPositions = [
      {
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        collateral: "BTC",
        debt: 40000, // $40,000 debt
      },
      {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        collateral: "ETH",
        debt: 1800, // $1,800 debt
      },
      {
        address: "0xfedcba0987654321fedcba0987654321fedcba09",
        collateral: "BNB",
        debt: 400, // $400 debt
      },
    ];

    await priceOracle.checkLiquidations(mockPositions);

    console.log("\n✅ DeFi integration example completed!");
    console.log("\n💡 Key Integration Points:");
    console.log("- Use oracle for real-time price feeds");
    console.log("- Implement circuit breakers for extreme price movements");
    console.log("- Use multiple resolvers for price verification");
    console.log("- Cache prices to reduce gas costs");
    console.log("- Implement dispute mechanisms for incorrect prices");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the example
defiIntegrationExample().catch(console.error);