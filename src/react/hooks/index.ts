// Oracle read hooks
export {
	useAnswer,
	useFeeDenominator,
	useFeeRecipient,
	useGetRoleAdmin,
	useHasRole,
	useIsResolver,
	useMaxQuestionLength,
	useMaxTimeout,
	useMinQuestionLength,
	useMinTimeout,
	useQuestion,
	useQuestionCount,
	useQuestionFee,
	useRefundPeriod,
} from "./useOracleRead";
// Oracle simulation hooks
export {
	useSimulateAddResolver,
	useSimulateAskBooleanOracle,
	useSimulateAskNumericOracle,
	useSimulateAskOracle,
	useSimulateGrantRole,
	useSimulateProvideAnswer,
	useSimulateRemoveResolver,
	useSimulateRenounceRole,
	useSimulateRevokeRole,
	useSimulateSetFee,
	useSimulateSetFeeRecipient,
} from "./useOracleSimulation";
// Oracle write hooks
export {
	useAddResolver,
	useAskBooleanOracle,
	useAskNumericOracle,
	useAskOracle,
	useGrantRole,
	useProvideAnswer,
	useRemoveResolver,
	useRenounceRole,
	useRevokeRole,
	useSetFee,
	useSetFeeRecipient,
} from "./useOracleWrite";

// Resolver hooks
export {
	useGrantBinaryResolverRole,
	useGrantCategoricalResolverRole,
	useGrantNumericalResolverRole,
	useGrantRangeNumericalResolverRole,
	useResolveBinary,
	useResolveCategorical,
	useResolveNumerical,
	useResolveRangeNumerical,
	useRevokeBinaryResolverRole,
	useRevokeCategoricalResolverRole,
	useRevokeNumericalResolverRole,
	useRevokeRangeNumericalResolverRole,
} from "./useResolvers";
