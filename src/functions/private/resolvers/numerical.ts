import { SYBEX_NUMERICAL_RESOLVER_ABI } from "../../../constants/abi/resolvers/numerical";
import type {
	HashReturn,
	ResolveNumericalOptions,
	ResolveNumericalParams,
	TransactionReceiptReturn,
	WalletClient,
	WriteContractReturn,
} from "../../../types";
import { getChain, getChainId, getContractAddress } from "../../../utils";

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

export async function resolveNumerical(
	{ questionId, numericAnswer, proof }: ResolveNumericalParams,
	{ client, waitForTransaction }: ResolveNumericalOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(
		chainId,
		"SYBEX_NUMERICAL_RESOLVER",
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
				abi: SYBEX_NUMERICAL_RESOLVER_ABI,
				functionName: "resolve",
				args: [BigInt(questionId), BigInt(numericAnswer), proof],
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
		"SYBEX_NUMERICAL_RESOLVER",
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
				abi: SYBEX_NUMERICAL_RESOLVER_ABI,
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
		"SYBEX_NUMERICAL_RESOLVER",
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
				abi: SYBEX_NUMERICAL_RESOLVER_ABI,
				functionName: "revokeRole",
				args: [role, resolverAccount],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}
