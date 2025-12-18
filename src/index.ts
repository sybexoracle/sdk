// Export all types

export { SYBEX_BINARY_RESOLVER_ABI } from "./constants/abi/resolvers/binary";
export { SYBEX_CATEGORICAL_RESOLVER_ABI } from "./constants/abi/resolvers/categorical";
export { SYBEX_NUMERICAL_RESOLVER_ABI } from "./constants/abi/resolvers/numerical";
export { SYBEX_RANGE_NUMERICAL_RESOLVER_ABI } from "./constants/abi/resolvers/range-numerical";
import { SYBEX_AMM_ABI } from "./constants/abi/markets/sybex-automated-market"
export { SYBEX_ORACLE_ABI } from "./constants/abi/sybexOracle";
export { CONTRACT_ADDRESSES } from "./constants/addresses";
// Export constants
export { bsc, SupportedChain } from "./constants/chains";
// Export private oracle functions
export {
	addResolver,
	askBooleanOracle,
	askNumericOracle,
	askOracle,
	grantRole,
	provideAnswer,
	removeResolver,
	renounceRole,
	revokeRole,
	setFee,
	setFeeRecipient,
} from "./functions/private/oracle";
// Export resolver functions
export {
	grantResolverRole as grantBinaryResolverRole,
	resolveBinary,
	revokeResolverRole as revokeBinaryResolverRole,
} from "./functions/private/resolvers/binary";
export {
	grantResolverRole as grantCategoricalResolverRole,
	resolveCategorical,
	revokeResolverRole as revokeCategoricalResolverRole,
} from "./functions/private/resolvers/categorical";
export {
	grantResolverRole as grantNumericalResolverRole,
	resolveNumerical,
	revokeResolverRole as revokeNumericalResolverRole,
} from "./functions/private/resolvers/numerical";
export {
	grantResolverRole as grantRangeNumericalResolverRole,
	resolveRangeNumerical,
	revokeResolverRole as revokeRangeNumericalResolverRole,
} from "./functions/private/resolvers/range-numeric";
// Export public oracle functions
export {
	getAnswer,
	getFeeDenominator,
	getFeeRecipient,
	getMaxQuestionLength,
	getMaxTimeout,
	getMinQuestionLength,
	getMinTimeout,
	getQuestion,
	getQuestionCount,
	getQuestionFee,
	getRefundPeriod,
	getRoleAdmin,
	hasRole,
	isResolver,
} from "./functions/public/oracle";
export type * from "./types";
// Export utilities
export * from "./utils";

import {
	addResolver as _addResolver,
	askBooleanOracle as _askBooleanOracle,
	askNumericOracle as _askNumericOracle,
	askOracle as _askOracle,
	grantRole as _grantRole,
	provideAnswer as _provideAnswer,
	removeResolver as _removeResolver,
	renounceRole as _renounceRole,
	revokeRole as _revokeRole,
	setFee as _setFee,
	setFeeRecipient as _setFeeRecipient,
} from "./functions/private/oracle";
import {
	grantResolverRole as _binaryGrantResolverRole,
	revokeResolverRole as _binaryRevokeResolverRole,
	resolveBinary as _resolveBinary,
} from "./functions/private/resolvers/binary";
import {
	grantResolverRole as _categoricalGrantResolverRole,
	revokeResolverRole as _categoricalRevokeResolverRole,
	resolveCategorical as _resolveCategorical,
} from "./functions/private/resolvers/categorical";
import {
	grantResolverRole as _numericalGrantResolverRole,
	revokeResolverRole as _numericalRevokeResolverRole,
	resolveNumerical as _resolveNumerical,
} from "./functions/private/resolvers/numerical";
import {
	grantResolverRole as _rangeGrantResolverRole,
	revokeResolverRole as _rangeRevokeResolverRole,
	resolveRangeNumerical as _resolveRangeNumerical,
} from "./functions/private/resolvers/range-numeric";
// Import functions for convenience exports
import {
	getAnswer as _getAnswer,
	getFeeDenominator as _getFeeDenominator,
	getFeeRecipient as _getFeeRecipient,
	getMaxQuestionLength as _getMaxQuestionLength,
	getMaxTimeout as _getMaxTimeout,
	getMinQuestionLength as _getMinQuestionLength,
	getMinTimeout as _getMinTimeout,
	getQuestion as _getQuestion,
	getQuestionCount as _getQuestionCount,
	getQuestionFee as _getQuestionFee,
	getRefundPeriod as _getRefundPeriod,
	getRoleAdmin as _getRoleAdmin,
	hasRole as _hasRole,
	isResolver as _isResolver,
} from "./functions/public/oracle";

// Re-export commonly used functions for convenience
export const oracle = {
	// Public functions
	getQuestion: _getQuestion,
	getAnswer: _getAnswer,
	getQuestionFee: _getQuestionFee,
	getQuestionCount: _getQuestionCount,
	getFeeRecipient: _getFeeRecipient,
	isResolver: _isResolver,
	hasRole: _hasRole,
	getRoleAdmin: _getRoleAdmin,
	getMaxQuestionLength: _getMaxQuestionLength,
	getMinQuestionLength: _getMinQuestionLength,
	getMaxTimeout: _getMaxTimeout,
	getMinTimeout: _getMinTimeout,
	getFeeDenominator: _getFeeDenominator,
	getRefundPeriod: _getRefundPeriod,

	// Private functions
	ask: _askOracle,
	askBoolean: _askBooleanOracle,
	askNumeric: _askNumericOracle,
	provideAnswer: _provideAnswer,
	addResolver: _addResolver,
	removeResolver: _removeResolver,
	setFee: _setFee,
	setFeeRecipient: _setFeeRecipient,
	grantRole: _grantRole,
	revokeRole: _revokeRole,
	renounceRole: _renounceRole,
};

// Re-export resolver functions
export const resolvers = {
	binary: {
		resolve: _resolveBinary,
		grantRole: _binaryGrantResolverRole,
		revokeRole: _binaryRevokeResolverRole,
	},
	categorical: {
		resolve: _resolveCategorical,
		grantRole: _categoricalGrantResolverRole,
		revokeRole: _categoricalRevokeResolverRole,
	},
	numerical: {
		resolve: _resolveNumerical,
		grantRole: _numericalGrantResolverRole,
		revokeRole: _numericalRevokeResolverRole,
	},
	rangeNumerical: {
		resolve: _resolveRangeNumerical,
		grantRole: _rangeGrantResolverRole,
		revokeRole: _rangeRevokeResolverRole,
	},
};
