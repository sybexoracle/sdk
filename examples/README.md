# SybexOracle SDK Examples

This directory contains practical examples of using the SybexOracle SDK in real-world scenarios.

## Examples Overview

1. **Basic Oracle Queries** - Simple read operations and getting oracle information
2. **Asking Questions** - Different types of questions you can ask the oracle
3. **Resolving Answers** - How resolvers can provide answers to questions
4. **Oracle Management** - Administrative operations for oracle maintainers
5. **DeFi Integration** - Real-world DeFi protocol integration example
6. **Prediction Market** - Building a prediction market using SybexOracle
7. **Sports Betting** - Sports outcome betting example
8. **Price Feeds** - Creating custom price feeds using the oracle

## Setup

Before running any example, make sure you have:

```bash
# Install dependencies
bun install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your private key and RPC URL
```

## Running Examples

```bash
# Run any example
bun run examples/basic-queries.ts

# Or with TypeScript directly
bunx tsx examples/basic-queries.ts
```

## Important Notes

- Always test on testnet first before using mainnet
- Ensure you have sufficient BNB for transaction fees
- Keep your private keys secure - never commit them to version control
- Some examples require oracle resolver privileges