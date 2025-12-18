import { useReadContract } from "wagmi";
import { SYBEX_ORACLE_ABI } from "../../constants/abi/sybexOracle";
import type {
	OracleReadOptions,
	UseFeeRecipientQueryOptions,
	UseIsResolverQueryOptions,
	UseQuestionCountQueryOptions,
	UseQuestionFeeQueryOptions,
	UseQuestionQueryOptions,
} from "../types";

/**
 * Hook for fetching a question by ID
 */
export function useQuestion({
	questionId,
	enabled = true,
	...queryOptions
}: UseQuestionQueryOptions & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "questions",
		args: [BigInt(questionId)],
		query: {
			enabled: enabled && !!queryOptions.contractAddress && !!questionId,
		},
	});
}

/**
 * Hook for fetching the current question fee
 */
export function useQuestionFee({
	enabled = true,
	...queryOptions
}: UseQuestionFeeQueryOptions & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "fee",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the total question count
 */
export function useQuestionCount({
	enabled = true,
	...queryOptions
}: UseQuestionCountQueryOptions & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "questionCount",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the fee recipient address
 */
export function useFeeRecipient({
	enabled = true,
	...queryOptions
}: UseFeeRecipientQueryOptions & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "feeRecipient",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for checking if an address is a resolver
 */
export function useIsResolver({
	resolver,
	enabled = true,
	...queryOptions
}: UseIsResolverQueryOptions & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "isResolver",
		args: [resolver as `0x${string}`],
		query: {
			enabled: enabled && !!queryOptions.contractAddress && !!resolver,
		},
	});
}

/**
 * Hook for fetching the maximum question length
 */
export function useMaxQuestionLength({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "maxQuestionLength",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the minimum question length
 */
export function useMinQuestionLength({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "minQuestionLength",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the maximum timeout
 */
export function useMaxTimeout({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "maxTimeout",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the minimum timeout
 */
export function useMinTimeout({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "minTimeout",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the fee denominator
 */
export function useFeeDenominator({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "FEE_DENOMINATOR",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching the refund period
 */
export function useRefundPeriod({
	enabled = true,
	...queryOptions
}: { enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "REFUND_PERIOD",
		query: {
			enabled: enabled && !!queryOptions.contractAddress,
		},
	});
}

/**
 * Hook for fetching an answer by question ID
 */
export function useAnswer({
	questionId,
	enabled = true,
	...queryOptions
}: { questionId: string | number; enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "answers",
		args: [BigInt(questionId)],
		query: {
			enabled: enabled && !!queryOptions.contractAddress && !!questionId,
		},
	});
}

/**
 * Hook for checking if an account has a specific role
 */
export function useHasRole({
	role,
	account,
	enabled = true,
	...queryOptions
}: { role: string; account: string; enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "hasRole",
		args: [role as `0x${string}`, account as `0x${string}`],
		query: {
			enabled:
				enabled &&
				!!queryOptions.contractAddress &&
				!!role &&
				!!account,
		},
	});
}

/**
 * Hook for fetching the role admin for a specific role
 */
export function useGetRoleAdmin({
	role,
	enabled = true,
	...queryOptions
}: { role: string; enabled?: boolean } & OracleReadOptions) {
	return useReadContract({
		abi: SYBEX_ORACLE_ABI,
		address: queryOptions.contractAddress,
		functionName: "getRoleAdmin",
		args: [role as `0x${string}`],
		query: {
			enabled: enabled && !!queryOptions.contractAddress && !!role,
		},
	});
}
