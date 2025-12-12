import { useSimulateContract } from "wagmi";
import { SYBEX_ORACLE_ABI } from "../../constants/abi/sybexOracle";
import {
  type UseSimulateAskOracleOptions,
  type UseSimulateAskBooleanOracleOptions,
  type UseSimulateAskNumericOracleOptions,
  type UseSimulateProvideAnswerOptions,
  type UseSimulateAddResolverOptions,
  type UseSimulateRemoveResolverOptions,
  type UseSimulateSetFeeOptions,
  type UseSimulateSetFeeRecipientOptions,
  type UseSimulateGrantRoleOptions,
  type UseSimulateRevokeRoleOptions,
  type UseSimulateRenounceRoleOptions,
  type OracleWriteOptions
} from "../types";

/**
 * Hook for simulating askOracle transaction
 */
export function useSimulateAskOracle({
  params,
  ...options
}: UseSimulateAskOracleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "ask",
    args: [
      params.question,
      BigInt(params.timeout),
      params.additionalData ?? "0x"
    ],
    value: BigInt(params.fee),
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating askBooleanOracle transaction
 */
export function useSimulateAskBooleanOracle({
  params,
  ...options
}: UseSimulateAskBooleanOracleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "askBoolean",
    args: [
      params.question,
      BigInt(params.timeout),
      params.additionalData ?? "0x"
    ],
    value: BigInt(params.fee),
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating askNumericOracle transaction
 */
export function useSimulateAskNumericOracle({
  params,
  ...options
}: UseSimulateAskNumericOracleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "askNumeric",
    args: [
      params.question,
      BigInt(params.timeout),
      params.additionalData ?? "0x"
    ],
    value: BigInt(params.fee),
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating provideAnswer transaction
 */
export function useSimulateProvideAnswer({
  params,
  ...options
}: UseSimulateProvideAnswerOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "provideAnswer",
    args: [
      BigInt(params.questionId),
      params.answerData
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating addResolver transaction
 */
export function useSimulateAddResolver({
  params,
  ...options
}: UseSimulateAddResolverOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "addResolver",
    args: [
      params.resolver
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating removeResolver transaction
 */
export function useSimulateRemoveResolver({
  params,
  ...options
}: UseSimulateRemoveResolverOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "removeResolver",
    args: [
      params.resolver
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating setFee transaction
 */
export function useSimulateSetFee({
  params,
  ...options
}: UseSimulateSetFeeOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "setFee",
    args: [
      BigInt(params.fee)
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating setFeeRecipient transaction
 */
export function useSimulateSetFeeRecipient({
  params,
  ...options
}: UseSimulateSetFeeRecipientOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "setFeeRecipient",
    args: [
      params.feeRecipient
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating grantRole transaction
 */
export function useSimulateGrantRole({
  params,
  ...options
}: UseSimulateGrantRoleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "grantRole",
    args: [
      params.role,
      params.account
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating revokeRole transaction
 */
export function useSimulateRevokeRole({
  params,
  ...options
}: UseSimulateRevokeRoleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "revokeRole",
    args: [
      params.role,
      params.account
    ],
    chainId: params.chainId,
    query: options.query
  });
}

/**
 * Hook for simulating renounceRole transaction
 */
export function useSimulateRenounceRole({
  params,
  ...options
}: UseSimulateRenounceRoleOptions & OracleWriteOptions) {
  return useSimulateContract({
    address: options.contractAddress,
    abi: SYBEX_ORACLE_ABI,
    functionName: "renounceRole",
    args: [
      params.role,
      params.account
    ],
    chainId: params.chainId,
    query: options.query
  });
}