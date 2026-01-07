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
	proof: string;
}

export interface ResolveBinaryOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveCategoricalParams {
	questionId: bigint;
	categoryIndex: number;
	proof: string;
}

export interface ResolveCategoricalOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveNumericalParams {
	questionId: bigint;
	numericAnswer: bigint;
	proof: string;
}

export interface ResolveNumericalOptions extends BaseWalletOptions {
	waitForTransaction?: boolean & WaitForTransactionOptions;
}

export interface ResolveRangeNumericalParams {
	questionId: bigint;
	lowerBound: bigint;
	upperBound: bigint;
	proof: string;
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
	| "SYBEX_BINARY_RESOLVER"
	| "SYBEX_CATEGORICAL_RESOLVER"
	| "SYBEX_NUMERICAL_RESOLVER"
	| "SYBEX_RANGE_NUMERICAL_RESOLVER"
	| "SYBEX_AMM"
	| "SYBEX_AMM_V2";

// Market Types
export enum MarketStatus {
	ACTIVE = 0,
	CANCELLED = 1,
	RESOLVED = 2,
}

export interface Market {
	question: string;
	questionType: QuestionType;
	token: `0x${string}`;
	status: MarketStatus;
	totalPool: bigint;
	totalFees: bigint;
	winningOutcome: bigint;
	deadline: bigint;
	owner: `0x${string}`;
}

// AMM V2 Public Functions - Params & Options
export interface GetMarketParams {
	marketId: bigint;
}

export interface GetMarketOptions extends BaseOracleOptions {}

export interface GetOutcomeLabelParams {
	marketId: bigint;
	outcomeId: bigint;
}

export interface GetOutcomeLabelOptions extends BaseOracleOptions {}

export interface GetOutcomePoolParams {
	marketId: bigint;
	outcomeId: bigint;
}

export interface GetOutcomePoolOptions extends BaseOracleOptions {}

export interface GetUserPositionParams {
	marketId: bigint;
	outcomeId: bigint;
	user: `0x${string}`;
}

export interface GetUserPositionOptions extends BaseOracleOptions {}

export interface GetMarketCounterParams extends Record<string, never> {}

export interface GetMarketCounterOptions extends BaseOracleOptions {}

export interface GetAccumulatedFeesParams extends Record<string, never> {}

export interface GetAccumulatedFeesOptions extends BaseOracleOptions {}

export interface GetFeePercentageParams extends Record<string, never> {}

export interface GetFeePercentageOptions extends BaseOracleOptions {}

export interface GetFeeRecipientAmmParams extends Record<string, never> {}

export interface GetFeeRecipientAmmOptions extends BaseOracleOptions {}

export interface GetSybexOracleParams extends Record<string, never> {}

export interface GetSybexOracleOptions extends BaseOracleOptions {}

export interface GetAdminRoleParams extends Record<string, never> {}

export interface GetAdminRoleOptions extends BaseOracleOptions {}

export interface GetDefaultAdminRoleParams extends Record<string, never> {}

export interface GetDefaultAdminRoleOptions extends BaseOracleOptions {}

export interface HasRoleAmmParams {
	role: `0x${string}`;
	account: `0x${string}`;
}

export interface HasRoleAmmOptions extends BaseOracleOptions {}

export interface GetRoleAdminAmmParams {
	role: `0x${string}`;
}

export interface GetRoleAdminAmmOptions extends BaseOracleOptions {}

export interface SupportsInterfaceParams {
	interfaceId: `0x${string}`;
}

export interface SupportsInterfaceOptions extends BaseOracleOptions {}

export interface IsTokenSupportedParams {
	token: `0x${string}`;
}

export interface IsTokenSupportedOptions extends BaseOracleOptions {}

// AMM V2 Private Functions - Params & Options
export interface CreateMarketParams {
	question: string;
	outcomeLabels: string[];
	questionType: QuestionType;
	token: `0x${string}`;
	deadline: bigint;
}

export interface CreateMarketOptions extends BaseWalletOptions {
	value?: bigint;
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface PlacePositionParams {
	marketId: bigint;
	outcomeId: bigint;
}

export interface PlacePositionOptions extends BaseWalletOptions {
	value?: bigint;
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface PlacePositionWithTokenParams {
	marketId: bigint;
	outcomeId: bigint;
	amount: bigint;
	token: `0x${string}`;
}

export interface PlacePositionWithTokenOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface ClaimWinningsParams {
	marketId: bigint;
}

export interface ClaimWinningsOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface RefundParams {
	marketId: bigint;
}

export interface RefundOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface ResolveMarketParams {
	marketId: bigint;
}

export interface ResolveMarketOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface CancelMarketParams {
	marketId: bigint;
}

export interface CancelMarketOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface SetFeePercentageAmmParams {
	feePercentage: bigint;
}

export interface SetFeePercentageAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface SetFeeRecipientAmmParams {
	feeRecipient: `0x${string}`;
}

export interface SetFeeRecipientAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface SetOracleAmmParams {
	oracle: `0x${string}`;
}

export interface SetOracleAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface AddSupportedTokenParams {
	token: `0x${string}`;
}

export interface AddSupportedTokenOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface RemoveSupportedTokenParams {
	token: `0x${string}`;
}

export interface RemoveSupportedTokenOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface WithdrawFeesParams {
	token: `0x${string}`;
}

export interface WithdrawFeesOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface GrantRoleAmmParams {
	role: `0x${string}`;
	account: `0x${string}`;
}

export interface GrantRoleAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface RevokeRoleAmmParams {
	role: `0x${string}`;
	account: `0x${string}`;
}

export interface RevokeRoleAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface RenounceRoleAmmParams {
	role: `0x${string}`;
	callerConfirmation: `0x${string}`;
}

export interface RenounceRoleAmmOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

export interface InitializeMarketParams {
	oracle: `0x${string}`;
	feeRecipient: `0x${string}`;
	feePercentage: bigint;
	adminAddress: `0x${string}`;
}

export interface InitializeMarketOptions extends BaseWalletOptions {
	waitForTransaction?: boolean | WaitForTransactionOptions;
}

// AMM V2 Return Types
export type MarketReturn = Market;
export type OutcomeLabelReturn = string;
export type OutcomePoolReturn = bigint;
export type UserPositionReturn = bigint;
export type MarketCounterReturn = bigint;
export type AccumulatedFeesReturn = bigint;
export type FeePercentageAmmReturn = bigint;
export type FeeRecipientAmmReturn = `0x${string}`;
export type SybexOracleReturn = `0x${string}`;
export type AdminRoleReturn = `0x${string}`;
export type DefaultAdminRoleReturn = `0x${string}`;
export type HasRoleAmmReturn = boolean;
export type GetRoleAdminAmmReturn = `0x${string}`;
export type SupportsInterfaceReturn = boolean;
export type IsTokenSupportedReturn = boolean;
export type CreateMarketReturn = bigint;
export type ClaimWinningsReturn = void;
export type PlacePositionReturn = void;
export type PlacePositionWithTokenReturn = void;
export type RefundReturn = void;
export type ResolveMarketReturn = void;
export type CancelMarketReturn = void;
export type SetFeePercentageAmmReturn = void;
export type SetFeeRecipientAmmReturn = void;
export type SetOracleAmmReturn = void;
export type AddSupportedTokenReturn = void;
export type RemoveSupportedTokenReturn = void;
export type WithdrawFeesReturn = void;
export type GrantRoleAmmReturn = void;
export type RevokeRoleAmmReturn = void;
export type RenounceRoleAmmReturn = void;
export type InitializeMarketReturn = void;
