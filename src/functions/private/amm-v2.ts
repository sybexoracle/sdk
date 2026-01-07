import { SYBEX_AMM_V2_ABI } from "../../constants/abi/markets/sybex-automated-market-v2";
import type {
	AddSupportedTokenOptions,
	AddSupportedTokenParams,
	CancelMarketOptions,
	CancelMarketParams,
	ClaimWinningsOptions,
	ClaimWinningsParams,
	CreateMarketOptions,
	CreateMarketParams,
	CreateMarketReturn,
	GrantRoleAmmOptions,
	GrantRoleAmmParams,
	InitializeMarketOptions,
	InitializeMarketParams,
	HashReturn,
	PlacePositionOptions,
	PlacePositionParams,
	PlacePositionWithTokenOptions,
	PlacePositionWithTokenParams,
	RefundOptions,
	RefundParams,
	RemoveSupportedTokenOptions,
	RemoveSupportedTokenParams,
	RenounceRoleAmmOptions,
	RenounceRoleAmmParams,
	ResolveMarketOptions,
	ResolveMarketParams,
	RevokeRoleAmmOptions,
	RevokeRoleAmmParams,
	SetFeePercentageAmmOptions,
	SetFeePercentageAmmParams,
	SetFeeRecipientAmmOptions,
	SetFeeRecipientAmmParams,
	SetOracleAmmOptions,
	SetOracleAmmParams,
	TransactionReceiptReturn,
	WalletClient,
	WaitForTransactionOptions,
	WriteContractReturn,
} from "../../types";
import { getChain, getChainId, getContractAddress } from "../../utils";

async function executeWithWait(
	_client: WalletClient,
	writeFn: () => Promise<WriteContractReturn>,
	waitForTx: boolean | WaitForTransactionOptions | undefined,
): Promise<HashReturn | TransactionReceiptReturn> {
	const hash = await writeFn();

	if (waitForTx) {
		// For now, just return the hash
		// TODO: Implement proper transaction receipt waiting
		return hash;
	}

	return hash;
}

export async function createMarket(
	{ question, outcomeLabels, questionType, token, deadline }: CreateMarketParams,
	{ client, value, waitForTransaction }: CreateMarketOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "createMarket",
				args: [question, outcomeLabels, questionType, token, deadline],
				value: value || undefined,
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function placePosition(
	{ marketId, outcomeId }: PlacePositionParams,
	{ client, value, waitForTransaction }: PlacePositionOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "placePosition",
				args: [marketId, outcomeId],
				value: value || undefined,
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function placePositionWithToken(
	{ marketId, outcomeId, amount, token }: PlacePositionWithTokenParams,
	{ client, waitForTransaction }: PlacePositionWithTokenOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "placePositionWithToken",
				args: [marketId, outcomeId, amount, token],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function claimWinnings(
	{ marketId }: ClaimWinningsParams,
	{ client, waitForTransaction }: ClaimWinningsOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "claimWinnings",
				args: [marketId],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function refund(
	{ marketId }: RefundParams,
	{ client, waitForTransaction }: RefundOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "refund",
				args: [marketId],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function resolveMarket(
	{ marketId }: ResolveMarketParams,
	{ client, waitForTransaction }: ResolveMarketOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "resolveMarket",
				args: [marketId],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function cancelMarket(
	{ marketId }: CancelMarketParams,
	{ client, waitForTransaction }: CancelMarketOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "cancelMarket",
				args: [marketId],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function setFeePercentageAmm(
	{ feePercentage }: SetFeePercentageAmmParams,
	{ client, waitForTransaction }: SetFeePercentageAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "setFeePercentage",
				args: [feePercentage],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function setFeeRecipientAmm(
	{ feeRecipient }: SetFeeRecipientAmmParams,
	{ client, waitForTransaction }: SetFeeRecipientAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "setFeeRecipient",
				args: [feeRecipient],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function setOracleAmm(
	{ oracle }: SetOracleAmmParams,
	{ client, waitForTransaction }: SetOracleAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "setOracle",
				args: [oracle],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function addSupportedToken(
	{ token }: AddSupportedTokenParams,
	{ client, waitForTransaction }: AddSupportedTokenOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "addSupportedToken",
				args: [token],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function removeSupportedToken(
	{ token }: RemoveSupportedTokenParams,
	{ client, waitForTransaction }: RemoveSupportedTokenOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "removeSupportedToken",
				args: [token],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function withdrawFees(
	{ token }: { token: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | WaitForTransactionOptions },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "withdrawFees",
				args: [token],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function grantRoleAmm(
	{ role, account }: GrantRoleAmmParams,
	{ client, waitForTransaction }: GrantRoleAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "grantRole",
				args: [role, account],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function revokeRoleAmm(
	{ role, account }: RevokeRoleAmmParams,
	{ client, waitForTransaction }: RevokeRoleAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "revokeRole",
				args: [role, account],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function renounceRoleAmm(
	{ role, callerConfirmation }: RenounceRoleAmmParams,
	{ client, waitForTransaction }: RenounceRoleAmmOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "renounceRole",
				args: [role, callerConfirmation],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}

export async function initializeMarket(
	{ oracle, feeRecipient, feePercentage, adminAddress }: InitializeMarketParams,
	{ client, waitForTransaction }: InitializeMarketOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_AMM_V2");
	const chain = getChain(chainId);

	if (!client.account) {
		throw new Error(
			"Wallet client must have an account to write transactions",
		);
	}

	return await executeWithWait(
		client,
		() =>
			client.writeContract({
				address: contractAddress,
				abi: SYBEX_AMM_V2_ABI,
				functionName: "initialize",
				args: [oracle, feeRecipient, feePercentage, adminAddress],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
	);
}
