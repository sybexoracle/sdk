# SybexOracle SDK Examples Usage Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd examples
   bun install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your private key
   ```

3. **Run Examples**
   ```bash
   # Basic queries
   bun run basic

   # Ask questions to oracle
   bun run questions

   # Resolve answers as a resolver
   bun run resolvers

   # DeFi integration example
   bun run defi

   # Prediction market example
   bun run prediction

   # Sports betting example
   bun run sports

   # Price feeds example
   bun run price-feeds
   ```

## Example Details

### 1. Basic Queries (`basic-queries.ts`)
Demonstrates fundamental oracle operations:
- Reading oracle configuration
- Getting question counts and fees
- Querying specific questions
- Checking resolver status

**Key Functions Used:**
- `oracle.getQuestionCount()`
- `oracle.getQuestionFee()`
- `oracle.getQuestion()`
- `oracle.getAnswer()`
- `oracle.isResolver()`

### 2. Asking Questions (`asking-questions.ts`)
Shows how to ask different types of questions:
- Binary (yes/no) questions
- Numerical questions
- General questions with custom data
- Batch asking multiple questions

**Key Functions Used:**
- `oracle.askBoolean()`
- `oracle.askNumeric()`
- `oracle.ask()`

### 3. Resolving Answers (`resolving-answers.ts`)
Demonstrates resolver operations:
- Resolving binary outcomes
- Providing categorical answers
- Submitting numerical values
- Managing resolver permissions

**Key Functions Used:**
- `resolvers.binary.resolve()`
- `resolvers.categorical.resolve()`
- `resolvers.numerical.resolve()`
- `resolvers.rangeNumerical.resolve()`

### 4. DeFi Integration (`defi-integration.ts`)
Real-world DeFi use case:
- Price feeds for lending protocols
- Liquidation risk monitoring
- Automated position checking
- Integration with smart contracts

**Features:**
- Real-time price updates
- Health factor calculations
- Liquidation alerts
- Price dispute mechanisms

### 5. Prediction Market (`prediction-market.ts`)
Complete prediction market platform:
- Multiple market types
- Betting mechanics
- Odds calculation
- Automated settlement

**Market Types:**
- Binary markets (yes/no)
- Categorical markets (multiple outcomes)
- Numerical markets (price predictions)

### 6. Sports Betting (`sports-betting.ts`)
Sports betting platform example:
- Match creation and management
- Multiple bet types
- Result resolution
- Payout calculations

**Bet Types:**
- Match winner
- Correct score
- Total goals (over/under)

### 7. Price Feeds (`price-feeds.ts`)
Decentralized price feed system:
- Multiple asset price tracking
- Automated updates
- Price history and statistics
- Confidence scoring

**Features:**
- Real-time price updates
- Volatility calculations
- Historical data storage
- Multi-source price verification

## Best Practices

### Security
1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Test on testnet** before mainnet deployment
4. **Implement proper access controls** for resolvers

### Oracle Usage
1. **Set appropriate timeouts** for your use case
2. **Include metadata** in additionalData for tracking
3. **Use multiple resolvers** for critical decisions
4. **Monitor question status** regularly

### Error Handling
1. **Always catch and handle errors** gracefully
2. **Check return values** before using them
3. **Implement retry logic** for network issues
4. **Log important operations** for debugging

## Common Patterns

### Creating a Question
```typescript
const questionFee = await oracle.getQuestionFee({}, { client: publicClient });

const tx = await oracle.askBoolean(
  {
    questionText: "Will BTC exceed $100k by end of year?",
    timeout: BigInt(30 * 24 * 60 * 60), // 30 days
    additionalData: JSON.stringify({ category: "crypto" }),
  },
  {
    client: walletClient,
    value: questionFee,
    waitForTransaction: true,
  }
);
```

### Resolving a Question
```typescript
const tx = await resolvers.binary.resolve(
  {
    questionId: questionId,
    outcome: 1, // 1 = true, 0 = false
  },
  {
    client: walletClient,
    waitForTransaction: true,
  }
);
```

### Getting Oracle Data
```typescript
const question = await oracle.getQuestion(
  { questionId },
  { client: publicClient }
);

if (question.isResolved) {
  const answer = await oracle.getAnswer(
    { questionId },
    { client: publicClient }
  );
  console.log("Answer:", answer.answerData);
}
```

## Troubleshooting

### Common Errors

1. **"Wallet client must have an account"**
   - Ensure your wallet client is properly initialized with an account
   - Check your private key configuration

2. **"Question not found"**
   - Verify the question ID is correct
   - Check if the question was successfully created

3. **"Insufficient funds"**
   - Ensure you have enough BNB for gas fees
   - Check the current question fee

4. **"Resolver permissions denied"**
   - Verify you have resolver permissions
   - Check if you're using the correct resolver type

### Debugging Tips

1. **Use console.log()** to trace execution flow
2. **Check transaction hashes** on block explorer
3. **Verify contract addresses** match your network
4. **Test with small amounts** first

## Next Steps

1. **Build your own dApp** using these examples as reference
2. **Implement custom logic** for your specific use case
3. **Add error handling** for production use
4. **Consider using TypeScript** for type safety
5. **Write tests** for your implementation

## Resources

- [SybexOracle Documentation](./README.md)
- [Viem Documentation](https://viem.sh/)
- [BSC Network Documentation](https://docs.binance.org/)
- [Bun Documentation](https://bun.sh/docs)

## Support

If you encounter issues:
1. Check the error messages carefully
2. Review the examples for similar implementations
3. Ensure your environment is properly configured
4. Test on BSC testnet first