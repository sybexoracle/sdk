import { SYBEX_AMM_V2_ABI } from "../../constants/abi/markets/sybex-automated-market-v2";
import type {
	AccumulatedFeesReturn,
 AdminRoleReturn,
 ClaimWinningsReturn,
 DefaultAdminRoleReturn,
 FeePercentageAmmReturn,
 FeeRecipientAmmReturn,
 GetAccumulatedFeesOptions,
 GetAccumulatedFeesParams,
 GetAdminRoleOptions,
 GetAdminRoleParams,
 GetDefaultAdminRoleOptions,
 GetDefaultAdminRoleParams,
 GetFeePercentageOptions,
 GetFeePercentageParams,
 GetFeeRecipientAmmOptions,
 GetFeeRecipientAmmParams,
 GetMarketCounterOptions,
 GetMarketCounterParams,
 GetMarketOptions,
 GetMarketParams,
 GetOutcomeLabelOptions,
 GetOutcomeLabelParams,
 GetOutcomePoolOptions,
 GetOutcomePoolParams,
 GetRoleAdminAmmOptions,
 GetRoleAdminAmmParams,
 GetSybexOracleOptions,
 GetSybexOracleParams,
 GetUserPositionOptions,
 GetUserPositionParams,
 HasRoleAmmOptions,
 HasRoleAmmParams,
 IsTokenSupportedOptions,
 IsTokenSupportedParams,
 Market,
 MarketReturn,
 OutcomeLabelReturn,
 OutcomePoolReturn,
 PublicClient,
 SupportsInterfaceOptions,
 SupportsInterfaceParams,
 SybexOracleReturn,
 UserPositionReturn,
} from "../../types";
import { getChainId, getContractAddress } from "../../utils";

export async function getMarket(
	{ marketId }: GetMarketParams,
	{ client }: GetMarketOptions,
): Promise<MarketReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	const market = (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "getMarket",
		args: [marketId],
	})) as readonly [
		string,
		number,
		`0x${string}`,
		number,
		bigint,
		bigint,
		bigint,
		bigint,
		`0x${string}`,
	];

	return {
		question: market[0],
		questionType: market[1],
		token: market[2],
		status: market[3],
		totalPool: market[4],
		totalFees: market[5],
		winningOutcome: market[6],
		deadline: market[7],
		owner: market[8],
	};
}

export async function getOutcomeLabel(
	{ marketId, outcomeId }: GetOutcomeLabelParams,
	{ client }: GetOutcomeLabelOptions,
): Promise<OutcomeLabelReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "getOutcomeLabel",
		args: [marketId, outcomeId],
	})) as string;
}

export async function getOutcomePool(
	{ marketId, outcomeId }: GetOutcomePoolParams,
	{ client }: GetOutcomePoolOptions,
): Promise<OutcomePoolReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "getOutcomePool",
		args: [marketId, outcomeId],
	})) as bigint;
}

export async function getUserPosition(
	{ marketId, outcomeId, user }: GetUserPositionParams,
	{ client }: GetUserPositionOptions,
): Promise<UserPositionReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "getUserPosition",
		args: [marketId, outcomeId, user],
	})) as bigint;
}

export async function getMarketCounter(
	_params: GetMarketCounterParams,
	{ client }: GetMarketCounterOptions,
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "marketCounter",
	})) as bigint;
}

export async function getAccumulatedFees(
	_params: GetAccumulatedFeesParams,
	{ client }: GetAccumulatedFeesOptions,
): Promise<AccumulatedFeesReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "accumulatedFees",
	})) as bigint;
}

export async function getFeePercentageAmm(
	_params: GetFeePercentageParams,
	{ client }: GetFeePercentageOptions,
): Promise<FeePercentageAmmReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "feePercentage",
	})) as bigint;
}

export async function getFeeRecipientAmm(
	_params: GetFeeRecipientAmmParams,
	{ client }: GetFeeRecipientAmmOptions,
): Promise<FeeRecipientAmmReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "feeRecipient",
	})) as `0x${string}`;
}

export async function getSybexOracle(
	_params: GetSybexOracleParams,
	{ client }: GetSybexOracleOptions,
): Promise<SybexOracleReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "sybexOracle",
	})) as `0x${string}`;
}

export async function getAdminRole(
	_params: GetAdminRoleParams,
	{ client }: GetAdminRoleOptions,
): Promise<AdminRoleReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "ADMIN_ROLE",
	})) as `0x${string}`;
}

export async function getDefaultAdminRole(
	_params: GetDefaultAdminRoleParams,
	{ client }: GetDefaultAdminRoleOptions,
): Promise<DefaultAdminRoleReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "DEFAULT_ADMIN_ROLE",
	})) as `0x${string}`;
}

export async function hasRoleAmm(
	{ role, account }: HasRoleAmmParams,
	{ client }: HasRoleAmmOptions,
): Promise<boolean> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "hasRole",
		args: [role, account],
	})) as boolean;
}

export async function getRoleAdminAmm(
	{ role }: GetRoleAdminAmmParams,
	{ client }: GetRoleAdminAmmOptions,
): Promise<`0x${string}`> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "getRoleAdmin",
		args: [role],
	})) as `0x${string}`;
}

export async function supportsInterface(
	{ interfaceId }: SupportsInterfaceParams,
	{ client }: SupportsInterfaceOptions,
): Promise<boolean> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "supportsInterface",
		args: [interfaceId],
	})) as boolean;
}

export async function isTokenSupported(
	{ token }: IsTokenSupportedParams,
	{ client }: IsTokenSupportedOptions,
): Promise<boolean> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");

	return (await client.readContract({
		address: contractAddress,
		abi: SYBEX_AMM_V2_ABI,
		functionName: "supportedTokens",
		args: [token],
	})) as boolean;
}
