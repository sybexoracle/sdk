# AMM V2 Examples

This directory contains examples demonstrating how to use the Sybex AMM V2 functionality.

## Examples

### 1. Market Creation (`1-create-market.ts`)

Demonstrates how to create different types of prediction markets:

- **Binary Markets**: Yes/No questions (e.g., "Will Bitcoin reach $100k?")
- **Categorical Markets**: Multiple outcome options (e.g., "Which team will win?")
- **Numerical Markets**: Number predictions (e.g., "What will ETH price be?")

**Features:**
- Creating markets with different question types
- Getting market information
- Checking token support
- Understanding AMM configuration

**Run:**
```bash
bun run examples/v2/1-create-market.ts
```

---

### 2. Trading (`2-trading.ts`)

Demonstrates how to trade positions in prediction markets:

- Placing positions with native token (BNB)
- Placing positions with ERC20 tokens (USDT, USDC)
- Getting user positions
- Calculating potential returns
- Market analysis before trading
- Trading strategies

**Features:**
- Buy positions with BNB or ERC20 tokens
- Check your positions across outcomes
- Calculate odds and potential returns
- Analyze market liquidity and depth
- Implement trading strategies

**Run:**
```bash
bun run examples/v2/2-trading.ts
```

---

### 3. Resolution & Settlement (`3-resolution.ts`)

Demonstrates how to resolve markets and claim winnings:

- Resolving markets (authorized only)
- Cancelling markets (owner only)
- Claiming winnings from resolved markets
- Requesting refunds from cancelled markets
- Batch claiming from multiple markets
- Manual oracle question resolution

**Features:**
- Resolve markets when outcomes are known
- Claim your winnings
- Handle market cancellations
- Batch operations for multiple markets
- Integration with SybexOracle for resolution

**Run:**
```bash
bun run examples/v2/3-resolution.ts
```

---

## Prerequisites

1. **Set up environment variables:**

```bash
cp examples/.env.example examples/.env
```

Edit `examples/.env` and add:
```
PRIVATE_KEY=your_private_key_here
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

2. **Install dependencies:**

```bash
bun install
```

3. **Build the SDK:**

```bash
bun run build
```

---

## Configuration

The examples use the configuration from `examples/config.ts`:

```typescript
import { createClients } from "../config";

const { publicClient, walletClient } = createClients("testnet");
```

Available networks:
- `"mainnet"` - BSC Mainnet
- `"testnet"` - BSC Testnet (default)

---

## Key Concepts

### Market Types

1. **Binary (BOOLEAN)**: Yes/No questions with 2 outcomes
2. **Categorical**: Multiple choice with 2+ outcomes
3. **Numerical**: Number-based predictions

### Market Status

- **ACTIVE (0)**: Market is open for trading
- **CANCELLED (1)**: Market was cancelled, positions can be refunded
- **RESOLVED (2)**: Market was resolved, winnings can be claimed

### Trading

- **Position with Native Token**: Use BNB to buy positions
- **Position with ERC20**: Use supported tokens (USDT, USDC, etc.)
- **Potential Returns**: Calculated based on outcome pool sizes

### Resolution Flow

1. Oracle resolves the question (via SybexOracle)
2. Market is marked as resolved
3. Users claim their winnings
4. Winning outcome shares receive payout

---

## Common Patterns

### Creating a Market

```typescript
import { ammV2, QuestionType } from "@sybexoracle/sdk";

const txHash = await ammV2.createMarket(
  {
    question: "Will BTC reach $100k?",
    outcomeLabels: ["No", "Yes"],
    questionType: QuestionType.BOOLEAN,
    token: "0x..." as `0x${string}`,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
  },
  {
    client: walletClient,
    value: 1000000000000000000n, // Optional initial liquidity
    waitForTransaction: true,
  }
);
```

### Placing a Position

```typescript
// With native token (BNB)
await ammV2.placePosition(
  { marketId: 1n, outcomeId: 0n },
  {
    client: walletClient,
    value: 100000000000000000n, // 0.1 BNB
  }
);

// With ERC20 token
await ammV2.placePositionWithToken(
  {
    marketId: 1n,
    outcomeId: 0n,
    amount: 100000000n, // 100 USDT (6 decimals)
    token: "0x..." as `0x${string}`,
  },
  { client: walletClient }
);
```

### Claiming Winnings

```typescript
// First check if market is resolved
const market = await ammV2.getMarket(
  { marketId: 1n },
  { client: publicClient }
);

if (market.status === 2) { // RESOLVED
  await ammV2.claimWinnings(
    { marketId: 1n },
    { client: walletClient }
  );
}
```

---

## Contract Addresses

### BSC Testnet
- **SYBEX_AMM_V2**: `0x978BD94E7478e37FaB77264fa1a40C804e9dEf40`

### BSC Mainnet
- Check `src/constants/addresses.ts` for latest addresses

---

## Troubleshooting

### "No contracts found for chain ID"
- Ensure you're using a supported chain (BSC mainnet/testnet)
- Check your RPC URL is correct

### "Market not found"
- Verify the marketId exists
- Check you're on the correct network

### "Insufficient balance"
- Ensure your wallet has enough BNB/tokens
- For ERC20 tokens, approve the contract first

### "Cannot resolve: Already resolved"
- Market can only be resolved once
- Check current market status first

### "No winning positions to claim"
- You didn't hold positions in the winning outcome
- Check your positions before claiming

---

## Additional Resources

- [SybexOracle Documentation](../README.md)
- [Usage Guide](../USAGE_GUIDE.md)
- [SDK API Reference](../../src/index.ts)

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing examples for patterns
- Review contract ABIs in `src/constants/abi/`
