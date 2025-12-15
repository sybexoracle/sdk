import { SYBEX_ORACLE_ABI } from "../../constants/abi/sybexOracle";
import type {
	AddResolverOptions,
	AddResolverParams,
	AskBooleanOptions,
	AskBooleanParams,
	AskNumericOptions,
	AskNumericParams,
	AskOptions,
	AskParams,
	HashReturn,
	ProvideAnswerOptions,
	ProvideAnswerParams,
	RemoveResolverOptions,
	RemoveResolverParams,
	SetFeeOptions,
	SetFeeParams,
	SetFeeRecipientOptions,
	SetFeeRecipientParams,
	TransactionReceiptReturn,
	WalletClient,
	WriteContractReturn,
} from "../../types";
import {
	getChain,
	getChainId,
	getContractAddress,
	validateQuestionText,
	validateTimeout,
} from "../../utils";

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

export async function askOracle(
	{ questionText, timeout, additionalData = "0x" }: AskParams,
	{ client, value, waitForTransaction }: AskOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	validateQuestionText(questionText);
	validateTimeout(BigInt(timeout));

	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "askCategorical",
				args: [questionText, BigInt(timeout), additionalData],
				value: value || undefined,
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function askBooleanOracle(
	{ questionText, timeout, additionalData = "0x" }: AskBooleanParams,
	{ client, value, waitForTransaction }: AskBooleanOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	validateQuestionText(questionText);
	validateTimeout(BigInt(timeout));

	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "askBoolean",
				args: [questionText, BigInt(timeout), additionalData],
				value: value || undefined,
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function askNumericOracle(
	{ questionText, timeout, additionalData = "0x" }: AskNumericParams,
	{ client, value, waitForTransaction }: AskNumericOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	validateQuestionText(questionText);
	validateTimeout(BigInt(timeout));

	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "askNumeric",
				args: [questionText, BigInt(timeout), additionalData],
				value: value || undefined,
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function provideAnswer(
	{ questionId, answerData }: ProvideAnswerParams,
	{ client, waitForTransaction }: ProvideAnswerOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "provideAnswer",
				args: [BigInt(questionId), answerData],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function addResolver(
	{ resolver }: AddResolverParams,
	{ client, waitForTransaction }: AddResolverOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "addResolver",
				args: [resolver],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function removeResolver(
	{ resolver }: RemoveResolverParams,
	{ client, waitForTransaction }: RemoveResolverOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "removeResolver",
				args: [resolver],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function setFee(
	{ fee }: SetFeeParams,
	{ client, waitForTransaction }: SetFeeOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "setFee",
				args: [BigInt(fee)],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function setFeeRecipient(
	{ feeRecipient }: SetFeeRecipientParams,
	{ client, waitForTransaction }: SetFeeRecipientOptions,
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "setFeeRecipient",
				args: [feeRecipient],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function grantRole(
	{ role, account }: { role: `0x${string}`; account: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | any },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "grantRole",
				args: [role, account],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function revokeRole(
	{ role, account }: { role: `0x${string}`; account: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | any },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "revokeRole",
				args: [role, account],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}

export async function renounceRole(
	{
		role,
		callerConfirmation,
	}: { role: `0x${string}`; callerConfirmation: `0x${string}` },
	{
		client,
		waitForTransaction,
	}: { client: WalletClient; waitForTransaction?: boolean | any },
): Promise<HashReturn | TransactionReceiptReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");
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
				abi: SYBEX_ORACLE_ABI,
				functionName: "renounceRole",
				args: [role, callerConfirmation],
				chain,
				account: client.account as any,
			}),
		waitForTransaction,
		typeof waitForTransaction === "object" ? waitForTransaction : undefined,
	);
}
