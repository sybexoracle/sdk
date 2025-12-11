import type {
	PublicClient,
	WalletClient,
	WriteContractReturnType,
	WaitForTransactionReceiptReturnType,
} from "viem";
import type { SupportedChain } from "../constants/chains";

export type { PublicClient, WalletClient };

export interface Question {
	questionType: QuestionType;
	questionText: string;
	timeout: bigint;
	additionalData: `0x${string}`;
	asker: `0x${string}`;
	isResolved: boolean;
	createdAt: bigint;
}

export interface Answer {
	answerData: `0x${string}`;
	resolver: `0x${string}`;
	answeredAt: bigint;
}

export enum QuestionType {
	GENERAL = 0,
	BOOLEAN = 1,
	NUMERICAL = 2,
	CATEGORICAL = 3,
	RANGE_NUMERICAL = 4,
}

export interface BaseOracleOptions {
	client: PublicClient;
}

export interface BaseWalletOptions {
	client: WalletClient;
}

export interface WaitForTransactionOptions {
	confirmations?: number;
	timeout?: number;
}

export interface TransactionReceipt
	extends WaitForTransactionReceiptReturnType {
	// Additional properties can be added here if needed
}

export interface GetQuestionParams {
	questionId: bigint;
}

export interface GetQuestionOptions extends BaseOracleOptions {}

export interface GetAnswerParams {
	questionId: bigint;
}

export interface GetAnswerOptions extends BaseOracleOptions {}

export interface GetQuestionFeeParams extends Record<string, never> {}

export interface GetQuestionFeeOptions extends BaseOracleOptions {}

export interface GetQuestionCountParams extends Record<string, never> {}

export interface GetQuestionCountOptions extends BaseOracleOptions {}

export interface IsResolverParams {
	resolver: `0x${string}`;
}

export interface IsResolverOptions extends BaseOracleOptions {}

export interface AskParams {
	questionText: string;
	timeout: bigint;
	additionalData?: `0x${string}`;
}

export interface AskOptions extends BaseWalletOptions {
	value?: bigint;
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface AskBooleanParams {
	questionText: string;
	timeout: bigint;
	additionalData?: `0x${string}`;
}

export interface AskBooleanOptions extends BaseWalletOptions {
	value?: bigint;
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface AskNumericParams {
	questionText: string;
	timeout: bigint;
	additionalData?: `0x${string}`;
}

export interface AskNumericOptions extends BaseWalletOptions {
	value?: bigint;
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ProvideAnswerParams {
	questionId: bigint;
	answerData: `0x${string}`;
}

export interface ProvideAnswerOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface AddResolverParams {
	resolver: `0x${string}`;
}

export interface AddResolverOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface RemoveResolverParams {
	resolver: `0x${string}`;
}

export interface RemoveResolverOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface SetFeeParams {
	fee: bigint;
}

export interface SetFeeOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface SetFeeRecipientParams {
	feeRecipient: `0x${string}`;
}

export interface SetFeeRecipientOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

// Resolver types
export interface ResolveBinaryParams {
	questionId: bigint;
	outcome: 0 | 1;
}

export interface ResolveBinaryOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveCategoricalParams {
	questionId: bigint;
	categoryIndex: number;
}

export interface ResolveCategoricalOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveNumericalParams {
	questionId: bigint;
	numericAnswer: bigint;
}

export interface ResolveNumericalOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveRangeNumericalParams {
	questionId: bigint;
	lowerBound: bigint;
	upperBound: bigint;
}

export interface ResolveRangeNumericalOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

// Return types
export type QuestionReturn = Question;
export type AnswerReturn =
	| Answer
	| { answerData: `0x${string}`; resolver: `0x${string}` };
export type QuestionIdReturn = bigint;
export type QuestionCountReturn = bigint;
export type FeeReturn = bigint;
export type FeeRecipientReturn = `0x${string}`;
export type IsResolverReturn = boolean;
export type HashReturn = `0x${string}`;
export type TransactionReceiptReturn = TransactionReceipt;
export type WriteContractReturn = WriteContractReturnType;

// Utility types
export type ChainId = SupportedChain;
export type Address = `0x${string}`;
export type Hash = `0x${string}`;

// Helper function return types
export type GetContractAddressReturn = Address;
export type GetChainIdReturn = ChainId;

// Re-export ContractName from addresses
export type ContractName =
	| "SYBEX_ORACLE"
	| "TRANSPARENT_UPGRADEABLE_PROXY"
	| "PROXY_ADMIN"
	| "SYBEX_BINARY_RESOLVER"
	| "SYBEX_CATEGORICAL_RESOLVER"
	| "SYBEX_NUMERICAL_RESOLVER"
	| "SYBEX_RANGE_NUMERICAL_RESOLVER";
