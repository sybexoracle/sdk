import type { Config } from "wagmi";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { UseSimulateContractParameters } from "wagmi";
import type { UseWriteContractParameters } from "wagmi";
import type {
	Address,
	Question,
} from "../../types";

export interface SybexOracleConfig {
	chainId: number;
	contractAddress?: Address;
}

export interface WagmiConfig extends Config { }

export interface OracleReadOptions {
	chainId?: number;
	contractAddress?: Address;
}

export interface OracleWriteOptions extends OracleReadOptions {
	account?: Address;
}

// Parameters for ask functions
export interface AskOracleParams {
	question: string;
	timeout: bigint;
	fee: bigint;
	chainId: number;
	additionalData?: Address;
}

export interface AskBooleanOracleParams {
	question: string;
	timeout: bigint;
	fee: bigint;
	chainId: number;
	additionalData?: Address;
}

export interface AskNumericOracleParams {
	question: string;
	timeout: bigint;
	fee: bigint;
	chainId: number;
	additionalData?: Address;
}

export interface ProvideAnswerParams {
	questionId: bigint;
	answerData: Address;
	chainId: number;
}

export interface AddResolverParams {
	resolver: Address;
	chainId: number;
}

export interface RemoveResolverParams {
	resolver: Address;
	chainId: number;
}

export interface SetFeeParams {
	fee: bigint;
	chainId: number;
}

export interface SetFeeRecipientParams {
	feeRecipient: Address;
	chainId: number;
}

export interface GrantRoleParams {
	role: Address;
	account: Address;
	chainId: number;
}

export interface RevokeRoleParams {
	role: Address;
	account: Address;
	chainId: number;
}

export interface RenounceRoleParams {
	role: Address;
	account: Address;
	chainId: number;
}


// Query option types
export interface UseQuestionQueryOptions
	extends Omit<UseQueryOptions<Question>, "queryKey" | "queryFn"> {
	questionId: bigint;
	enabled?: boolean;
}

export interface UseQuestionFeeQueryOptions
	extends Omit<UseQueryOptions<bigint>, "queryKey" | "queryFn"> {
	enabled?: boolean;
}

export interface UseQuestionCountQueryOptions
	extends Omit<UseQueryOptions<bigint>, "queryKey" | "queryFn"> {
	enabled?: boolean;
}

export interface UseFeeRecipientQueryOptions
	extends Omit<UseQueryOptions<`0x${string}`>, "queryKey" | "queryFn"> {
	enabled?: boolean;
}

export interface UseIsResolverQueryOptions
	extends Omit<UseQueryOptions<boolean>, "queryKey" | "queryFn"> {
	resolver: `0x${string}`;
	enabled?: boolean;
}

// Mutations options
export interface UseAskOracleOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseAskBooleanOracleOptions extends UseAskOracleOptions { }

export interface UseAskNumericOracleOptions extends UseAskOracleOptions { }

export interface UseProvideAnswerOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseAddResolverOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseRemoveResolverOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseSetFeeOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseSetFeeRecipientOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseGrantRoleOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseRevokeRoleOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

export interface UseRenounceRoleOptions
	extends Omit<UseWriteContractParameters, "mutationFn"> {
	onSuccess?: (hash: `0x${string}`) => void;
	onError?: (error: Error) => void;
}

// Simulation options
export interface UseSimulateAskOracleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: AskOracleParams;
}

export interface UseSimulateAskBooleanOracleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: AskBooleanOracleParams;
}

export interface UseSimulateAskNumericOracleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: AskNumericOracleParams;
}

export interface UseSimulateProvideAnswerOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: ProvideAnswerParams;
}

export interface UseSimulateAddResolverOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: AddResolverParams;
}

export interface UseSimulateRemoveResolverOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: RemoveResolverParams;
}

export interface UseSimulateSetFeeOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: SetFeeParams;
}

export interface UseSimulateSetFeeRecipientOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: SetFeeRecipientParams;
}

export interface UseSimulateGrantRoleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: GrantRoleParams;
}

export interface UseSimulateRevokeRoleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: RevokeRoleParams;
}

export interface UseSimulateRenounceRoleOptions
	extends Omit<
		UseSimulateContractParameters,
		"address" | "abi" | "functionName"
	> {
	params: RenounceRoleParams;
}
