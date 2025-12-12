# SybexOracle SDK React Integration

This guide shows how to use the SybexOracle SDK with React applications using wagmi hooks.

## Installation

```bash
npm install sybex-oracle-sdk wagmi viem @tanstack/react-query
```

## Setup

### 1. Configure Wagmi

```tsx
import { http, createConfig } from 'wagmi'
import { bsc } from 'viem/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
})

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### 2. Wrap with SybexOracleProvider

```tsx
import { SybexOracleProvider } from 'sybex-oracle-sdk/react'

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SybexOracleProvider config={{ chainId: 56 }}>
          <YourApp />
        </SybexOracleProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Usage Examples

### Reading Oracle Data

```tsx
import { useQuestion, useQuestionFee, useQuestionCount } from 'sybex-oracle-sdk/react'

function OracleInfo() {
  // Fetch question count
  const { data: questionCount, isLoading: isLoadingCount } = useQuestionCount()

  // Fetch question fee
  const { data: questionFee, isLoading: isLoadingFee } = useQuestionFee()

  // Fetch specific question
  const { data: question, isLoading: isLoadingQuestion } = useQuestion({
    questionId: 1n,
    enabled: questionCount ? questionCount > 0n : false
  })

  if (isLoadingCount || isLoadingFee) return <div>Loading...</div>

  return (
    <div>
      <h2>Oracle Information</h2>
      <p>Total Questions: {questionCount?.toString()}</p>
      <p>Question Fee: {questionFee?.toString()} wei</p>

      {question && (
        <div>
          <h3>Question #{question.questionId}</h3>
          <p>Type: {question.questionType}</p>
          <p>Question: {question.questionText}</p>
          <p>Resolved: {question.isResolved ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}
```

### Writing to Oracle

```tsx
import { useAskOracle, useAskBooleanOracle, useProvideAnswer } from 'sybex-oracle-sdk/react'
import { useAccount } from 'wagmi'

function OracleActions() {
  const { address } = useAccount()

  const { askOracle, isPending: isAsking } = useAskOracle({
    onSuccess: (hash) => {
      console.log('Transaction submitted:', hash)
    },
    onError: (error) => {
      console.error('Failed to ask question:', error)
    }
  })

  const { askBooleanOracle, isPending: isAskingBoolean } = useAskBooleanOracle({
    onSuccess: (hash) => {
      console.log('Boolean question submitted:', hash)
    }
  })

  const handleAskQuestion = async () => {
    if (!address) return

    try {
      await askOracle({
        chainId: 56,
        question: "What will be the price of ETH at the end of 2024?",
        timeout: 86400n, // 24 hours
        arbitrator: address as `0x${string}`,
        category: 1,
        language: 1,
        fee: parseEther("0.01") // 0.01 BNB
      })
    } catch (error) {
      console.error('Error asking question:', error)
    }
  }

  const handleAskBooleanQuestion = async () => {
    if (!address) return

    try {
      await askBooleanOracle({
        chainId: 56,
        question: "Will Bitcoin reach $100k in 2024?",
        timeout: 86400n,
        arbitrator: address as `0x${string}`,
        category: 1,
        language: 1,
        fee: parseEther("0.01")
      })
    } catch (error) {
      console.error('Error asking boolean question:', error)
    }
  }

  return (
    <div>
      <h2>Oracle Actions</h2>
      <button
        onClick={handleAskQuestion}
        disabled={isAsking || !address}
      >
        {isAsking ? 'Asking...' : 'Ask Question'}
      </button>

      <button
        onClick={handleAskBooleanQuestion}
        disabled={isAskingBoolean || !address}
      >
        {isAskingBoolean ? 'Asking...' : 'Ask Boolean Question'}
      </button>
    </div>
  )
}
```

### Using Resolvers

```tsx
import {
  useResolveBinary,
  useResolveCategorical,
  useResolveNumerical
} from 'sybex-oracle-sdk/react'

function ResolverActions() {
  const { resolveBinary, isPending: isResolvingBinary } = useResolveBinary({
    onSuccess: (hash) => {
      console.log('Binary resolution submitted:', hash)
    }
  })

  const { resolveCategorical, isPending: isResolvingCategorical } = useResolveCategorical({
    onSuccess: (hash) => {
      console.log('Categorical resolution submitted:', hash)
    }
  })

  const handleResolveBinary = async () => {
    try {
      await resolveBinary({
        chainId: 56,
        questionId: 1n,
        answer: true, // or false
      })
    } catch (error) {
      console.error('Error resolving binary:', error)
    }
  }

  const handleResolveCategorical = async () => {
    try {
      await resolveCategorical({
        chainId: 56,
        questionId: 2n,
        answer: 2, // category index
      })
    } catch (error) {
      console.error('Error resolving categorical:', error)
    }
  }

  return (
    <div>
      <h2>Resolver Actions</h2>
      <button
        onClick={handleResolveBinary}
        disabled={isResolvingBinary}
      >
        {isResolvingBinary ? 'Resolving...' : 'Resolve Binary'}
      </button>

      <button
        onClick={handleResolveCategorical}
        disabled={isResolvingCategorical}
      >
        {isResolvingCategorical ? 'Resolving...' : 'Resolve Categorical'}
      </button>
    </div>
  )
}
```

### Transaction Status

```tsx
import { useWaitForTransaction } from 'sybex-oracle-sdk/react'

function TransactionStatus({ hash }: { hash: `0x${string}` }) {
  const { data: receipt, isLoading, isSuccess, error } = useWaitForTransaction({
    hash,
    confirmations: 1,
  })

  if (isLoading) return <div>Waiting for transaction...</div>

  if (error) return <div>Error: {error.message}</div>

  if (isSuccess && receipt) {
    return (
      <div>
        <p>Transaction confirmed!</p>
        <p>Block number: {receipt.blockNumber}</p>
        <p>Gas used: {receipt.gasUsed.toString()}</p>
      </div>
    )
  }

  return null
}
```

## Available Hooks

### Oracle Read Hooks
- `useQuestion` - Fetch a question by ID
- `useQuestionFee` - Get current question fee
- `useQuestionCount` - Get total question count
- `useFeeRecipient` - Get fee recipient address
- `useIsResolver` - Check if address is a resolver
- `useMaxQuestionLength` - Get maximum question length
- `useMinQuestionLength` - Get minimum question length
- `useMaxTimeout` - Get maximum timeout
- `useMinTimeout` - Get minimum timeout
- `useFeeDenominator` - Get fee denominator
- `useRefundPeriod` - Get refund period
- `useAnswer` - Get answer for a question
- `useHasRole` - Check if account has role
- `useGetRoleAdmin` - Get role admin

### Oracle Write Hooks
- `useAskOracle` - Ask a general question
- `useAskBooleanOracle` - Ask a boolean question
- `useAskNumericOracle` - Ask a numeric question
- `useProvideAnswer` - Provide an answer
- `useAddResolver` - Add a resolver
- `useRemoveResolver` - Remove a resolver
- `useSetFee` - Set question fee
- `useSetFeeRecipient` - Set fee recipient
- `useGrantRole` - Grant a role
- `useRevokeRole` - Revoke a role
- `useRenounceRole` - Renounce a role

### Resolver Hooks
- `useResolveBinary` - Resolve binary questions
- `useResolveCategorical` - Resolve categorical questions
- `useResolveNumerical` - Resolve numerical questions
- `useResolveRangeNumerical` - Resolve range numerical questions

### Simulation Hooks
- `useSimulateAskOracle` - Simulate askOracle transaction
- `useSimulateAskBooleanOracle` - Simulate askBoolean transaction
- `useSimulateAskNumericOracle` - Simulate askNumeric transaction
- `useSimulateProvideAnswer` - Simulate provideAnswer transaction
- And more...

## TypeScript Support

All hooks are fully typed with TypeScript. The SDK provides comprehensive type definitions for all parameters and return values.

```tsx
import type {
  AskOracleParams,
  Question,
  OracleReadOptions
} from 'sybex-oracle-sdk/react'

// Your components will have full type safety
```