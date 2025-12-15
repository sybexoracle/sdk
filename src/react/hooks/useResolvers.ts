import { useWriteContract, useSimulateContract } from "wagmi";
import { SYBEX_BINARY_RESOLVER_ABI } from "../../constants/abi/resolvers/binary";
import { SYBEX_CATEGORICAL_RESOLVER_ABI } from "../../constants/abi/resolvers/categorical";
import { SYBEX_NUMERICAL_RESOLVER_ABI } from "../../constants/abi/resolvers/numerical";
import { SYBEX_RANGE_NUMERICAL_RESOLVER_ABI } from "../../constants/abi/resolvers/range-numerical";
import { type OracleWriteOptions } from "../types";

/**
 * Binary Resolver Hooks
 */

/**
 * Hook for resolving a binary question
 */
export function useResolveBinary({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const resolveBinary = async (params: {
    chainId: number;
    questionId: string | number;
    answer: number; // 0 or 1 as per uint8
	proof: string;
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_BINARY_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "resolve",
      args: [BigInt(params.questionId), params.answer, params.proof],
      chainId: params.chainId,
    });
  };

  return {
    resolveBinary,
    ...writeContractResult
  };
}

/**
 * Hook for granting resolver role in binary resolver
 */
export function useGrantBinaryResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const grantRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_BINARY_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "grantRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    grantRole,
    ...writeContractResult
  };
}

/**
 * Hook for revoking resolver role in binary resolver
 */
export function useRevokeBinaryResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const revokeRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_BINARY_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "revokeRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    revokeRole,
    ...writeContractResult
  };
}

/**
 * Categorical Resolver Hooks
 */

/**
 * Hook for resolving a categorical question
 */
export function useResolveCategorical({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const resolveCategorical = async (params: {
    chainId: number;
    questionId: string | number;
    categoryIndex: number; // uint8
	proof: string;
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "resolve",
      args: [BigInt(params.questionId), params.categoryIndex, params.proof],
      chainId: params.chainId,
    });
  };

  return {
    resolveCategorical,
    ...writeContractResult
  };
}

/**
 * Hook for granting resolver role in categorical resolver
 */
export function useGrantCategoricalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const grantRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "grantRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    grantRole,
    ...writeContractResult
  };
}

/**
 * Hook for revoking resolver role in categorical resolver
 */
export function useRevokeCategoricalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const revokeRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "revokeRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    revokeRole,
    ...writeContractResult
  };
}

/**
 * Numerical Resolver Hooks
 */

/**
 * Hook for resolving a numerical question
 */
export function useResolveNumerical({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const resolveNumerical = async (params: {
    chainId: number;
    questionId: string | number;
    answer: string | number;
	proof: string;
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "resolve",
      args: [BigInt(params.questionId), BigInt(params.answer), params.proof],
      chainId: params.chainId,
    });
  };

  return {
    resolveNumerical,
    ...writeContractResult
  };
}

/**
 * Hook for granting resolver role in numerical resolver
 */
export function useGrantNumericalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const grantRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "grantRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    grantRole,
    ...writeContractResult
  };
}

/**
 * Hook for revoking resolver role in numerical resolver
 */
export function useRevokeNumericalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const revokeRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "revokeRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    revokeRole,
    ...writeContractResult
  };
}

/**
 * Range Numerical Resolver Hooks
 */

/**
 * Hook for resolving a range numerical question
 */
export function useResolveRangeNumerical({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const resolveRangeNumerical = async (params: {
    chainId: number;
    questionId: string | number;
    lowerBound: string | number; // int256
    upperBound: string | number; // int256
	proof: string;
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_RANGE_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "resolve",
      args: [BigInt(params.questionId), BigInt(params.lowerBound), BigInt(params.upperBound), params.proof],
      chainId: params.chainId,
    });
  };

  return {
    resolveRangeNumerical,
    ...writeContractResult
  };
}

/**
 * Hook for granting resolver role in range numerical resolver
 */
export function useGrantRangeNumericalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const grantRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_RANGE_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "grantRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    grantRole,
    ...writeContractResult
  };
}

/**
 * Hook for revoking resolver role in range numerical resolver
 */
export function useRevokeRangeNumericalResolverRole({
  onSuccess,
  onError,
  ...options
}: { onSuccess?: (hash: `0x${string}`) => void; onError?: (error: Error) => void } & OracleWriteOptions) {
  const { writeContractAsync, ...writeContractResult } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  const revokeRole = async (params: {
    chainId: number;
    role: string; // bytes32 role
    account: string; // address account
    contractAddress?: string;
  }) => {
    const address = params.contractAddress || options.contractAddress;
    if (!address) {
      throw new Error('Contract address is required');
    }

    return await writeContractAsync({
      abi: SYBEX_RANGE_NUMERICAL_RESOLVER_ABI,
      address: address as `0x${string}`,
      functionName: "revokeRole",
      args: [params.role as `0x${string}`, params.account as `0x${string}`],
      chainId: params.chainId,
    });
  };

  return {
    revokeRole,
    ...writeContractResult
  };
}
