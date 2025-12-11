/**
 * Sports Betting Example
 *
 * This example demonstrates how to create a sports betting
 * platform using SybexOracle for resolving match outcomes.
 */

import { oracle, resolvers } from "../src";
import { createClients } from "./config";

interface SportsMatch {
  id: string;
  sport: string;
  league: string;
  teams: {
    home: string;
    away: string;
  };
  match_date: Date;
  oracle_question_id?: bigint;
  resolved: boolean;
  result?: {
    winner: "home" | "away" | "draw";
    home_score?: number;
    away_score?: number;
  };
}

interface Bet {
  id: string;
  match_id: string;
  user: string;
  bet_type: "winner" | "correct_score" | "total_goals";
  selection: string | number;
  amount: number;
  odds: number;
  status: "pending" | "won" | "lost";
}

class SportsBettingPlatform {
  private publicClient: any;
  private walletClient: any;
  private matches: Map<string, SportsMatch> = new Map();
  private bets: Map<string, Bet> = new Map();

  constructor(publicClient: any, walletClient: any) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  /**
   * Add a new sports match for betting
   */
  async addMatch(params: {
    sport: string;
    league: string;
    home_team: string;
    away_team: string;
    match_date: Date;
  }): Promise<SportsMatch> {
    console.log(`\n⚽ Adding Sports Match`);
    console.log(`${params.home_team} vs ${params.away_team}`);
    console.log(`${params.league} - ${params.sport}`);
    console.log(`Date: ${params.match_date.toISOString()}`);
    console.log("-".repeat(40));

    const match: SportsMatch = {
      id: `match_${Date.now()}`,
      sport: params.sport,
      league: params.league,
      teams: {
        home: params.home_team,
        away: params.away_team,
      },
      match_date: params.match_date,
      resolved: false,
    };

    // Create oracle question for match result
    const question = `Who will win the ${params.league} match between ${params.home_team} and ${params.away_team} on ${params.match_date.toISOString().split('T')[0]}?`;

    const questionFee = await oracle.getQuestionFee({}, { client: this.publicClient });
    const timeout = BigInt(
      Math.floor((params.match_date.getTime() - Date.now()) / 1000) + 24 * 60 * 60 // Match time + 24 hours buffer
    );

    const tx = await oracle.askBoolean(
      { questionText: question, timeout },
      {
        client: this.walletClient,
        value: questionFee,
        waitForTransaction: true,
      }
    );

    match.oracle_question_id = await this.getQuestionIdFromTx(tx);
    this.matches.set(match.id, match);

    console.log(`✅ Match added!`);
    console.log(`Match ID: ${match.id}`);
    console.log(`Oracle Question ID: ${match.oracle_question_id}`);
    console.log(`Transaction: ${tx}`);

    return match;
  }

  /**
   * Place a bet on a match
   */
  async placeBet(params: {
    match_id: string;
    bet_type: "winner" | "correct_score" | "total_goals";
    selection: string | number;
    amount: number;
  }): Promise<Bet> {
    console.log(`\n💰 Placing Bet`);
    console.log(`Match: ${params.match_id}`);
    console.log(`Type: ${params.bet_type}`);
    console.log(`Selection: ${params.selection}`);
    console.log(`Amount: $${params.amount}`);
    console.log("-".repeat(40));

    const match = this.matches.get(params.match_id);
    if (!match) {
      throw new Error("Match not found");
    }

    if (match.resolved) {
      throw new Error("Match is already resolved");
    }

    if (Date.now() > match.match_date.getTime()) {
      throw new Error("Match has already started");
    }

    // Calculate odds (simplified - in real implementation, use odds from bookmaker)
    const odds = this.calculateOdds(params.bet_type, params.selection, match);

    const bet: Bet = {
      id: `bet_${Date.now()}`,
      match_id: params.match_id,
      user: this.walletClient.account!.address,
      bet_type: params.bet_type,
      selection: params.selection,
      amount: params.amount,
      odds,
      status: "pending",
    };

    this.bets.set(bet.id, bet);

    console.log(`✅ Bet placed!`);
    console.log(`Bet ID: ${bet.id}`);
    console.log(`Odds: ${odds}x`);
    console.log(`Potential payout: $${(params.amount * odds).toFixed(2)}`);

    return bet;
  }

  /**
   * Settle match results using oracle
   */
  async settleMatch(match_id: string): Promise<void> {
    console.log(`\n🏁 Settling Match: ${match_id}`);
    console.log("-".repeat(40));

    const match = this.matches.get(match_id);
    if (!match || !match.oracle_question_id) {
      throw new Error("Invalid match or no oracle question");
    }

    try {
      // Check if oracle has resolved
      const question = await oracle.getQuestion(
        { questionId: match.oracle_question_id },
        { client: this.publicClient }
      );

      if (!question.isResolved) {
        console.log("Oracle has not resolved this match yet");
        return;
      }

      const answer = await oracle.getAnswer(
        { questionId: match.oracle_question_id },
        { client: this.publicClient }
      );

      console.log(`Oracle answer: ${answer.answerData}`);
      console.log(`Resolved by: ${answer.resolver}`);

      // Parse oracle answer
      // Assuming answer is "0x31" for home win, "0x30" for away win, "0x32" for draw
      let winner: "home" | "away" | "draw";
      if (answer.answerData === "0x31") {
        winner = "home";
      } else if (answer.answerData === "0x30") {
        winner = "away";
      } else {
        winner = "draw";
      }

      match.result = { winner };
      match.resolved = true;

      console.log(`\n🏆 Match Result:`);
      console.log(`${match.teams.home} ${match.result.home_score || 0} - ${match.teams.away} ${match.result.away_score || 0}`);
      console.log(`Winner: ${winner}`);

      // Settle bets
      await this.settleBets(match_id, winner);

      console.log(`✅ Match settled successfully!`);

    } catch (error) {
      console.error("❌ Failed to settle match:", error);
      throw error;
    }
  }

  /**
   * Manually resolve match as resolver
   */
  async manuallyResolveMatch(match_id: string, result: {
    winner: "home" | "away" | "draw";
    home_score: number;
    away_score: number;
  }): Promise<void> {
    console.log(`\n✍️ Manually Resolving Match: ${match_id}`);
    console.log(`Result: ${result.home_score} - ${result.away_score}`);
    console.log(`Winner: ${result.winner}`);
    console.log("-".repeat(40));

    const match = this.matches.get(match_id);
    if (!match || !match.oracle_question_id) {
      throw new Error("Invalid match");
    }

    try {
      // Convert winner to oracle answer
      let oracleAnswer: 0 | 1;
      if (result.winner === "home") {
        oracleAnswer = 1; // true for home win
      } else {
        oracleAnswer = 0; // false for away/draw
      }

      const tx = await resolvers.binary.resolve(
        {
          questionId: match.oracle_question_id,
          outcome: oracleAnswer,
        },
        {
          client: this.walletClient,
          waitForTransaction: true,
        }
      );

      console.log(`✅ Oracle question resolved! TX: ${tx}`);

      // Update match result
      match.result = result;
      match.resolved = true;

      // Settle bets
      await this.settleBets(match_id, result.winner);

    } catch (error) {
      console.error("❌ Failed to manually resolve:", error);
      throw error;
    }
  }

  /**
   * Get upcoming matches
   */
  getUpcomingMatches(): SportsMatch[] {
    const now = Date.now();
    return Array.from(this.matches.values()).filter(
      m => !m.resolved && m.match_date.getTime() > now
    );
  }

  /**
   * Get user's betting history
   */
  getUserBets(userAddress: string): Bet[] {
    return Array.from(this.bets.values()).filter(bet => bet.user === userAddress);
  }

  /**
   * Display all matches
   */
  displayMatches() {
    console.log("\n⚽ All Sports Matches");
    console.log("-".repeat(40));

    this.matches.forEach((match, id) => {
      const status = match.resolved
        ? `✅ Resolved (${match.result?.winner})`
        : match.match_date.getTime() > Date.now()
        ? `⏳ Upcoming`
        : `🔄 In Progress`;

      console.log(`\n${id}:`);
      console.log(`  ${match.teams.home} vs ${match.teams.away}`);
      console.log(`  ${match.league} - ${match.sport}`);
      console.log(`  Date: ${match.match_date.toLocaleString()}`);
      console.log(`  Status: ${status}`);
    });
  }

  private calculateOdds(betType: string, selection: any, match: SportsMatch): number {
    // Simplified odds calculation
    switch (betType) {
      case "winner":
        return 2.0; // 50/50 for binary outcome
      case "correct_score":
        return 5.0; // Higher odds for specific scores
      case "total_goals":
        return 1.9; // Slightly less than 2 for over/under
      default:
        return 2.0;
    }
  }

  private async settleBets(match_id: string, winner: "home" | "away" | "draw") {
    const matchBets = Array.from(this.bets.values()).filter(b => b.match_id === match_id);

    console.log(`\n💰 Settling ${matchBets.length} bets`);

    matchBets.forEach(bet => {
      let won = false;

      switch (bet.bet_type) {
        case "winner":
          won = bet.selection === winner;
          break;
        case "correct_score":
          // Would need to compare with actual scores
          won = false; // Simplified
          break;
        case "total_goals":
          // Would need to calculate from actual scores
          won = false; // Simplified
          break;
      }

      bet.status = won ? "won" : "lost";

      if (won) {
        const payout = bet.amount * bet.odds;
        console.log(`✅ ${bet.user}: Won $${payout.toFixed(2)} on ${bet.selection}`);
      } else {
        console.log(`❌ ${bet.user}: Lost $${bet.amount} on ${bet.selection}`);
      }
    });
  }

  private async getQuestionIdFromTx(tx: string): Promise<bigint> {
    // Mock implementation
    return BigInt(Date.now());
  }
}

async function sportsBettingExample() {
  console.log("⚽ Sports Betting Example\n");

  const { publicClient, walletClient } = createClients("testnet");
  const platform = new SportsBettingPlatform(publicClient, walletClient);

  try {
    // Example 1: Add upcoming matches
    console.log("📅 Example 1: Adding Sports Matches");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0); // 8 PM

    const match1 = await platform.addMatch({
      sport: "Soccer",
      league: "English Premier League",
      home_team: "Manchester United",
      away_team: "Liverpool",
      match_date: tomorrow,
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(15, 0, 0, 0);

    const match2 = await platform.addMatch({
      sport: "Basketball",
      league: "NBA",
      home_team: "Los Angeles Lakers",
      away_team: "Boston Celtics",
      match_date: nextWeek,
    });

    // Example 2: Place bets on matches
    console.log("\n💰 Example 2: Placing Bets");

    await platform.placeBet({
      match_id: match1.id,
      bet_type: "winner",
      selection: "home",
      amount: 100,
    });

    await platform.placeBet({
      match_id: match1.id,
      bet_type: "correct_score",
      selection: "2-1",
      amount: 50,
    });

    await platform.placeBet({
      match_id: match2.id,
      bet_type: "winner",
      selection: "away",
      amount: 75,
    });

    // Example 3: Display all matches and bets
    console.log("\n📊 Example 3: Platform Overview");
    platform.displayMatches();

    const userBets = platform.getUserBets(walletClient.account!.address);
    console.log(`\nYour bets: ${userBets.length}`);
    userBets.forEach(bet => {
      console.log(`- ${bet.match_id}: $${bet.amount} on ${bet.selection} (${bet.status})`);
    });

    // Example 4: Simulate match completion and resolve
    console.log("\n🏁 Example 4: Resolving Matches");

    // Manually resolve match 1 (for demo)
    await platform.manuallyResolveMatch(match1.id, {
      winner: "home",
      home_score: 2,
      away_score: 1,
    });

    // Example 5: Create a quick tennis match
    console.log("\n🎾 Example 5: Quick Tennis Match");

    const tennisMatch = await platform.addMatch({
      sport: "Tennis",
      league: "Wimbledon",
      home_team: "Novak Djokovic",
      away_team: "Carlos Alcaraz",
      match_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    });

    await platform.placeBet({
      match_id: tennisMatch.id,
      bet_type: "winner",
      selection: "home",
      amount: 200,
    });

    // Immediately resolve for demo
    await platform.manuallyResolveMatch(tennisMatch.id, {
      winner: "home",
      home_score: 3,
      away_score: 1, // Sets in tennis
    });

    console.log("\n✅ Sports betting example completed!");
    console.log("\n💡 Features Demonstrated:");
    console.log("- Match creation with oracle integration");
    console.log("- Multiple bet types (winner, correct score, total goals)");
    console.log("- Automatic bet settlement");
    console.log("- Manual match resolution by resolvers");
    console.log("- Betting history and tracking");
    console.log("- Odds calculation and payouts");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the example
sportsBettingExample().catch(console.error);