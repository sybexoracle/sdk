// Oracle read hooks
export {
  useQuestion,
  useQuestionFee,
  useQuestionCount,
  useFeeRecipient,
  useIsResolver,
  useMaxQuestionLength,
  useMinQuestionLength,
  useMaxTimeout,
  useMinTimeout,
  useFeeDenominator,
  useRefundPeriod,
  useAnswer,
  useHasRole,
  useGetRoleAdmin,
} from "./useOracleRead";

// Oracle write hooks
export {
  useAskOracle,
  useAskBooleanOracle,
  useAskNumericOracle,
  useProvideAnswer,
  useAddResolver,
  useRemoveResolver,
  useSetFee,
  useSetFeeRecipient,
  useGrantRole,
  useRevokeRole,
  useRenounceRole,
} from "./useOracleWrite";

// Oracle simulation hooks
export {
  useSimulateAskOracle,
  useSimulateAskBooleanOracle,
  useSimulateAskNumericOracle,
  useSimulateProvideAnswer,
  useSimulateAddResolver,
  useSimulateRemoveResolver,
  useSimulateSetFee,
  useSimulateSetFeeRecipient,
  useSimulateGrantRole,
  useSimulateRevokeRole,
  useSimulateRenounceRole,
} from "./useOracleSimulation";

// Resolver hooks
export {
  useResolveBinary,
  useGrantBinaryResolverRole,
  useRevokeBinaryResolverRole,
  useResolveCategorical,
  useGrantCategoricalResolverRole,
  useRevokeCategoricalResolverRole,
  useResolveNumerical,
  useGrantNumericalResolverRole,
  useRevokeNumericalResolverRole,
  useResolveRangeNumerical,
  useGrantRangeNumericalResolverRole,
  useRevokeRangeNumericalResolverRole,
} from "./useResolvers";