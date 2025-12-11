import { SYBEX_CATEGORICAL_RESOLVER_ABI } from "../../../constants/abi/resolvers/categorical";
import type {
	HashReturn,
	ResolveCategoricalOptions,
	ResolveCategoricalParams,
	TransactionReceiptReturn,
	WalletClient,
	WriteContractReturn,
} from "../../../types";
import {
	getChain,
	getChainId,
	getContractAddress,
	validateCategoryIndex,
} from "../../../utils";

async function executeWithWait(
	_client: WalletClient,
	writeFn: () => Promise<WriteContractReturn>,
	waitForTx: boolean | undefined,
	_waitForOptions?: any,
): Promise<HashReturn | TransactionReceiptReturn> {
	const hash = await writeFn();

	if (waitForTx) {
		// For now, just return the hash
		// TODO: Implement proper transaction receipt waiting
		return hash;
	}

	return hash;
}

export async function resolveCategorical(
	{ questionId, categoryIndex }: ResolveCategoricalParams,
	{ client, waitForTransaction }: ResolveCategoricalOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	validateCategoryIndex(categoryIndex);

	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(
		chainId,
		"SYBEX_CATEGORICAL_RESOLVER",
	);
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
				abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
				functionName: "resolve",
				args: [BigInt(questionId), categoryIndex],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function grantResolverRole(
	{
		role,
		account: resolverAccount,
	}: { role: `0x${string}`; account: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | any },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(
		chainId,
		"SYBEX_CATEGORICAL_RESOLVER",
	);
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
				abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
				functionName: "grantRole",
				args: [role, resolverAccount],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function revokeResolverRole(
	{
		role,
		account: resolverAccount,
	}: { role: `0x${string}`; account: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | any },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(
		chainId,
		"SYBEX_CATEGORICAL_RESOLVER",
	);
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
				abi: SYBEX_CATEGORICAL_RESOLVER_ABI,
				functionName: "revokeRole",
				args: [role, resolverAccount],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}
