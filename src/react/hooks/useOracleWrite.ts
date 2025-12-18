import { useWriteContract } from "wagmi";
import { SYBEX_ORACLE_ABI } from "../../constants/abi/sybexOracle";
import type {
	OracleWriteOptions,
	UseAddResolverOptions,
	UseAskBooleanOracleOptions,
	UseAskNumericOracleOptions,
	UseAskOracleOptions,
	UseGrantRoleOptions,
	UseProvideAnswerOptions,
	UseRemoveResolverOptions,
	UseRenounceRoleOptions,
	UseRevokeRoleOptions,
	UseSetFeeOptions,
	UseSetFeeRecipientOptions,
} from "../types";

/**
 * Hook for asking a general oracle question
 */
export function useAskOracle({
	onSuccess,
	onError,
	...options
}: UseAskOracleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const askOracle = async (params: {
		question: string;
		timeout: number;
		fee: string;
		chainId: number;
		additionalData?: string;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "askCategorical",
			args: [
				params.question,
				BigInt(params.timeout),
				(params.additionalData as `0x${string}`) ?? "0x",
			],
			value: BigInt(params.fee),
			chainId: params.chainId,
		});
	};

	return {
		askOracle,
		...writeContractResult,
	};
}

/**
 * Hook for asking a boolean oracle question
 */
export function useAskBooleanOracle({
	onSuccess,
	onError,
	...options
}: UseAskBooleanOracleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const askBooleanOracle = async (params: {
		question: string;
		timeout: number;
		fee: string;
		chainId: number;
		additionalData?: string;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "askBoolean",
			args: [
				params.question,
				BigInt(params.timeout),
				(params.additionalData as `0x${string}`) ?? "0x",
			],
			value: BigInt(params.fee),
			chainId: params.chainId,
		});
	};

	return {
		askBooleanOracle,
		...writeContractResult,
	};
}

/**
 * Hook for asking a numeric oracle question
 */
export function useAskNumericOracle({
	onSuccess,
	onError,
	...options
}: UseAskNumericOracleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const askNumericOracle = async (params: {
		question: string;
		timeout: number;
		fee: string;
		chainId: number;
		additionalData?: string;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "askNumeric",
			args: [
				params.question,
				BigInt(params.timeout),
				(params.additionalData as `0x${string}`) ?? "0x",
			],
			value: BigInt(params.fee),
			chainId: params.chainId,
		});
	};

	return {
		askNumericOracle,
		...writeContractResult,
	};
}

/**
 * Hook for providing an answer to a question
 */
export function useProvideAnswer({
	onSuccess,
	onError,
	...options
}: UseProvideAnswerOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const provideAnswer = async (params: {
		questionId: string | number;
		answerData: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "provideAnswer",
			args: [
				BigInt(params.questionId),
				params.answerData as `0x${string}`,
			],
			chainId: params.chainId,
		});
	};

	return {
		provideAnswer,
		...writeContractResult,
	};
}

/**
 * Hook for adding a resolver
 */
export function useAddResolver({
	onSuccess,
	onError,
	...options
}: UseAddResolverOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const addResolver = async (params: {
		resolver: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "addResolver",
			args: [params.resolver as `0x${string}`],
			chainId: params.chainId,
		});
	};

	return {
		addResolver,
		...writeContractResult,
	};
}

/**
 * Hook for removing a resolver
 */
export function useRemoveResolver({
	onSuccess,
	onError,
	...options
}: UseRemoveResolverOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const removeResolver = async (params: {
		resolver: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "removeResolver",
			args: [params.resolver as `0x${string}`],
			chainId: params.chainId,
		});
	};

	return {
		removeResolver,
		...writeContractResult,
	};
}

/**
 * Hook for setting the question fee
 */
export function useSetFee({
	onSuccess,
	onError,
	...options
}: UseSetFeeOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const setFee = async (params: {
		fee: string | number;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "setFee",
			args: [BigInt(params.fee)],
			chainId: params.chainId,
		});
	};

	return {
		setFee,
		...writeContractResult,
	};
}

/**
 * Hook for setting the fee recipient
 */
export function useSetFeeRecipient({
	onSuccess,
	onError,
	...options
}: UseSetFeeRecipientOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const setFeeRecipient = async (params: {
		feeRecipient: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "setFeeRecipient",
			args: [params.feeRecipient as `0x${string}`],
			chainId: params.chainId,
		});
	};

	return {
		setFeeRecipient,
		...writeContractResult,
	};
}

/**
 * Hook for granting a role
 */
export function useGrantRole({
	onSuccess,
	onError,
	...options
}: UseGrantRoleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const grantRole = async (params: {
		role: string;
		account: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "grantRole",
			args: [
				params.role as `0x${string}`,
				params.account as `0x${string}`,
			],
			chainId: params.chainId,
		});
	};

	return {
		grantRole,
		...writeContractResult,
	};
}

/**
 * Hook for revoking a role
 */
export function useRevokeRole({
	onSuccess,
	onError,
	...options
}: UseRevokeRoleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const revokeRole = async (params: {
		role: string;
		account: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "revokeRole",
			args: [
				params.role as `0x${string}`,
				params.account as `0x${string}`,
			],
			chainId: params.chainId,
		});
	};

	return {
		revokeRole,
		...writeContractResult,
	};
}

/**
 * Hook for renouncing a role
 */
export function useRenounceRole({
	onSuccess,
	onError,
	...options
}: UseRenounceRoleOptions & OracleWriteOptions) {
	const { writeContractAsync, ...writeContractResult } = useWriteContract({
		mutation: {
			onSuccess: onSuccess,
			onError: onError,
			...options,
		},
	});

	const renounceRole = async (params: {
		role: string;
		account: string;
		chainId: number;
	}) => {
		if (!options.contractAddress) {
			throw new Error("Contract address is required");
		}

		return await writeContractAsync({
			abi: SYBEX_ORACLE_ABI,
			address: options.contractAddress,
			functionName: "renounceRole",
			args: [
				params.role as `0x${string}`,
				params.account as `0x${string}`,
			],
			chainId: params.chainId,
		});
	};

	return {
		renounceRole,
		...writeContractResult,
	};
}
