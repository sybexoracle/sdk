# SybexOracle SDK

TypeScript SDK for interacting with SybexOracle smart contracts on BNB Smart Chain.

## Installation

```bash
bun add @sybexoracle/sdk viem
```

## Requirements

- Bun Runtime or Node.js 18+
- TypeScript 5+
- viem (latest)

## Quick Start

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc, oracle } from "@sybexoracle/sdk";

// Initialize clients
const publicClient = createPublicClient({
  chain: bsc,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: bsc,
  transport: http(),
  account: privateKeyToAccount("0x..."),
});

// Ask a boolean question
const questionHash = await oracle.askBoolean({
  questionText: "Will BTC price exceed $100k by end of 2024?",
  timeout: 86400n, // 24 hours in seconds
}, {
  client: walletClient,
  value: 1000000000000000n, // 0.001 BNB fee
  waitForTransaction: true,
});

console.log("Question asked:", questionHash);

// Get question details
const questionId = 1n; // Assuming this is the question ID from the transaction
const question = await oracle.getQuestion({ questionId }, { client: publicClient });
console.log("Question:", question);
```

## API Reference

### Oracle Public Functions

#### `getQuestion`
Get details of a specific question.

```typescript
const question = await oracle.getQuestion({
  questionId: 1n
}, {
  client: publicClient
});
```

#### `getAnswer`
Get the answer to a resolved question.

```typescript
const answer = await oracle.getAnswer({
  questionId: 1n
}, {
  client: publicClient
});
```

#### `getQuestionFee`
Get the current fee for asking questions.

```typescript
const fee = await oracle.getQuestionFee({}, {
  client: publicClient
});
```

#### `isResolver`
Check if an address is a resolver.

```typescript
const isResolver = await oracle.isResolver({
  resolver: "0x..."
}, {
  client: publicClient
});
```

### Oracle Private Functions

#### `ask`
Ask a general question.

```typescript
const txHash = await oracle.ask({
  questionText: "What will be the price of ETH in 24 hours?",
  timeout: 86400n,
  additionalData: "0x..." // Optional
}, {
  client: walletClient,
  value: fee, // Question fee
});
```

#### `askBoolean`
Ask a boolean (yes/no) question.

```typescript
const txHash = await oracle.askBoolean({
  questionText: "Will the market go up tomorrow?",
  timeout: 86400n
}, {
  client: walletClient,
  value: fee,
  waitForTransaction: { confirmations: 2 }
});
```

#### `askNumeric`
Ask a numerical question.

```typescript
const txHash = await oracle.askNumeric({
  questionText: "What will be the BTC price in USD?",
  timeout: 86400n
}, {
  client: walletClient,
  value: fee
});
```

#### `provideAnswer`
Provide an answer to a question (resolver only).

```typescript
const txHash = await oracle.provideAnswer({
  questionId: 1n,
  answerData: "0x..." // Encoded answer data
}, {
  client: walletClient
});
```

### Resolver Functions

#### Binary Resolver

```typescript
import { resolvers } from "@sybexoracle/sdk";

// Resolve a binary question (0 = false, 1 = true)
const txHash = await resolvers.binary.resolve({
  questionId: 1n,
  outcome: 1 // true
}, {
  client: walletClient
});
```

#### Categorical Resolver

```typescript
// Resolve a categorical question with category index
const txHash = await resolvers.categorical.resolve({
  questionId: 1n,
  categoryIndex: 2 // Third category (0-indexed)
}, {
  client: walletClient
});
```

#### Numerical Resolver

```typescript
// Resolve a numerical question
const txHash = await resolvers.numerical.resolve({
  questionId: 1n,
  numericAnswer: 50000n // $50,000
}, {
  client: walletClient
});
```

#### Range Numerical Resolver

```typescript
// Resolve a range numerical question
const txHash = await resolvers.rangeNumerical.resolve({
  questionId: 1n,
  lowerBound: 45000n,
  upperBound: 55000n
}, {
  client: walletClient
});
```

## Transaction Handling

All write functions return a transaction hash by default. You can optionally wait for transaction confirmation:

```typescript
// Just get the hash
const hash = await oracle.askBoolean({
  questionText: "Will it rain tomorrow?",
  timeout: 86400n
}, {
  client: walletClient,
  value: fee
});

// Wait for transaction receipt
const receipt = await oracle.askBoolean({
  questionText: "Will it rain tomorrow?",
  timeout: 86400n
}, {
  client: walletClient,
  value: fee,
  waitForTransaction: true
});

// Wait with custom options
const receipt = await oracle.askBoolean({
  questionText: "Will it rain tomorrow?",
  timeout: 86400n
}, {
  client: walletClient,
  value: fee,
  waitForTransaction: {
    confirmations: 3,
    timeout: 120000 // 2 minutes
  }
});
```

## Error Handling

The SDK provides strongly typed errors for better debugging:

```typescript
try {
  const question = await oracle.getQuestion({ questionId: 999n }, { client: publicClient });
} catch (error) {
  if (error.message.includes("No contracts found")) {
    console.log("Unsupported chain");
  } else if (error.message.includes("Invalid address")) {
    console.log("Invalid contract address");
  }
}
```

## Constants

Access contract addresses and ABIs directly:

```typescript
import { CONTRACT_ADDRESSES, SYBEX_ORACLE_ABI } from "@sybexoracle/sdk";

console.log("Oracle Address:", CONTRACT_ADDRESSES[56].SYBEX_ORACLE);
console.log("Oracle ABI:", SYBEX_ORACLE_ABI);
```

## TypeScript Support

The SDK is fully typed with TypeScript strict mode enabled. All function parameters and return types are strongly typed for better developer experience and compile-time safety.

## License

MIT
