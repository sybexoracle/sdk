// Export all types

export { SYBEX_BINARY_RESOLVER_ABI } from "./constants/abi/resolvers/binary";
export { SYBEX_CATEGORICAL_RESOLVER_ABI } from "./constants/abi/resolvers/categorical";
export { SYBEX_NUMERICAL_RESOLVER_ABI } from "./constants/abi/resolvers/numerical";
export { SYBEX_RANGE_NUMERICAL_RESOLVER_ABI } from "./constants/abi/resolvers/range-numerical";
export { SYBEX_AMM_ABI } from "./constants/abi/markets/sybex-automated-market";
export { SYBEX_AMM_V2_ABI } from "./constants/abi/markets/sybex-automated-market-v2";
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
// Export private AMM V2 functions
export {
	addSupportedToken,
	cancelMarket,
	claimWinnings,
	createMarket,
	grantRoleAmm,
	initializeMarket,
	placePosition,
	placePositionWithToken,
	refund,
	removeSupportedToken,
	renounceRoleAmm,
	resolveMarket,
	revokeRoleAmm,
	setFeePercentageAmm,
	setFeeRecipientAmm,
	setOracleAmm,
	withdrawFees,
} from "./functions/private/amm-v2";
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
// Export public AMM V2 functions
export {
	getAccumulatedFees,
	getAdminRole,
 getDefaultAdminRole,
	getFeePercentageAmm,
	getFeeRecipientAmm,
	getMarket,
	getMarketCounter,
	getOutcomeLabel,
	getOutcomePool,
	getRoleAdminAmm,
	getSybexOracle,
	getUserPosition,
	hasRoleAmm,
	isTokenSupported,
	supportsInterface,
} from "./functions/public/amm-v2";
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
import {
	addSupportedToken as _addSupportedToken,
	cancelMarket as _cancelMarket,
	claimWinnings as _claimWinnings,
	createMarket as _createMarket,
	grantRoleAmm as _grantRoleAmm,
	initializeMarket as _initializeMarket,
	placePosition as _placePosition,
	placePositionWithToken as _placePositionWithToken,
	refund as _refund,
	removeSupportedToken as _removeSupportedToken,
	renounceRoleAmm as _renounceRoleAmm,
	resolveMarket as _resolveMarket,
	revokeRoleAmm as _revokeRoleAmm,
	setFeePercentageAmm as _setFeePercentageAmm,
	setFeeRecipientAmm as _setFeeRecipientAmm,
	setOracleAmm as _setOracleAmm,
	withdrawFees as _withdrawFees,
} from "./functions/private/amm-v2";
import {
	getAccumulatedFees as _getAccumulatedFees,
	getAdminRole as _getAdminRole,
	getDefaultAdminRole as _getDefaultAdminRole,
	getFeePercentageAmm as _getFeePercentageAmm,
	getFeeRecipientAmm as _getFeeRecipientAmm,
	getMarket as _getMarket,
	getMarketCounter as _getMarketCounter,
	getOutcomeLabel as _getOutcomeLabel,
	getOutcomePool as _getOutcomePool,
	getRoleAdminAmm as _getRoleAdminAmm,
	getSybexOracle as _getSybexOracle,
	getUserPosition as _getUserPosition,
	hasRoleAmm as _hasRoleAmm,
	isTokenSupported as _isTokenSupported,
	supportsInterface as _supportsInterface,
} from "./functions/public/amm-v2";

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

// Re-export AMM V2 functions
export const ammV2 = {
	// Public functions
	getMarket: _getMarket,
	getOutcomeLabel: _getOutcomeLabel,
	getOutcomePool: _getOutcomePool,
	getUserPosition: _getUserPosition,
	getMarketCounter: _getMarketCounter,
	getAccumulatedFees: _getAccumulatedFees,
	getFeePercentage: _getFeePercentageAmm,
	getFeeRecipient: _getFeeRecipientAmm,
	getSybexOracle: _getSybexOracle,
	getAdminRole: _getAdminRole,
	getDefaultAdminRole: _getDefaultAdminRole,
	hasRole: _hasRoleAmm,
	getRoleAdmin: _getRoleAdminAmm,
	supportsInterface: _supportsInterface,
	isTokenSupported: _isTokenSupported,

	// Private functions
	createMarket: _createMarket,
	placePosition: _placePosition,
	placePositionWithToken: _placePositionWithToken,
	claimWinnings: _claimWinnings,
	refund: _refund,
	resolveMarket: _resolveMarket,
	cancelMarket: _cancelMarket,
	setFeePercentage: _setFeePercentageAmm,
	setFeeRecipient: _setFeeRecipientAmm,
	setOracle: _setOracleAmm,
	addSupportedToken: _addSupportedToken,
	removeSupportedToken: _removeSupportedToken,
	withdrawFees: _withdrawFees,
	grantRole: _grantRoleAmm,
	revokeRole: _revokeRoleAmm,
	renounceRole: _renounceRoleAmm,
	initializeMarket: _initializeMarket,
};
