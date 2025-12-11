import { SYBEX_ORACLE_ABI } from "../../constants/abi/sybexOracle";
import type {
	Address,
	AnswerReturn,
	FeeRecipientReturn,
	FeeReturn,
	GetAnswerOptions,
	GetAnswerParams,
	GetQuestionCountOptions,
	GetQuestionCountParams,
	GetQuestionFeeOptions,
	GetQuestionFeeParams,
	GetQuestionOptions,
	GetQuestionParams,
	IsResolverOptions,
	IsResolverParams,
	IsResolverReturn,
	PublicClient,
	QuestionCountReturn,
	QuestionReturn,
} from "../../types";
import { getChainId, getContractAddress } from "../../utils";

export async function getQuestion(
	{ questionId }: GetQuestionParams,
	{ client }: GetQuestionOptions,
): Promise<QuestionReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	const question = await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "questions",
		args: [questionId],
	});

	return {
		questionType: question[0],
		questionText: question[1],
		timeout: question[2],
		additionalData: question[3],
		asker: question[4],
		isResolved: question[5],
		createdAt: question[6],
	};
}

export async function getAnswer(
	{ questionId }: GetAnswerParams,
	{ client }: GetAnswerOptions,
): Promise<AnswerReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	const result = (await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "getAnswer",
		args: [questionId],
	})) as readonly [`0x${string}`, `0x${string}`];

	return {
		answerData: result[0],
		resolver: result[1],
	};
}

export async function getQuestionFee(
	_params: GetQuestionFeeParams,
	{ client }: GetQuestionFeeOptions,
): Promise<FeeReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "fee",
	});
}

export async function getQuestionCount(
	_params: GetQuestionCountParams,
	{ client }: GetQuestionCountOptions,
): Promise<QuestionCountReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "questionCount",
	});
}

export async function getFeeRecipient(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<FeeRecipientReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "feeRecipient",
	});
}

export async function isResolver(
	{ resolver }: IsResolverParams,
	{ client }: IsResolverOptions,
): Promise<IsResolverReturn> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "isResolver",
		args: [resolver],
	});
}

export async function hasRole(
	{ role, account }: { role: `0x${string}`; account: Address },
	{ client }: { client: PublicClient },
): Promise<boolean> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "hasRole",
		args: [role, account],
	});
}

export async function getRoleAdmin(
	{ role }: { role: `0x${string}` },
	{ client }: { client: PublicClient },
): Promise<`0x${string}`> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "getRoleAdmin",
		args: [role],
	});
}

export async function getMaxQuestionLength(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "maxQuestionLength",
	});
}

export async function getMinQuestionLength(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "minQuestionLength",
	});
}

export async function getMaxTimeout(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "maxTimeout",
	});
}

export async function getMinTimeout(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "minTimeout",
	});
}

export async function getFeeDenominator(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "FEE_DENOMINATOR",
	});
}

export async function getRefundPeriod(
	_params: Record<string, never>,
	{ client }: { client: PublicClient },
): Promise<bigint> {
	const chainId = await getChainId(client);
	const contractAddress = getContractAddress(chainId, "SYBEX_ORACLE");

	return await client.readContract({
		address: contractAddress,
		abi: SYBEX_ORACLE_ABI,
		functionName: "REFUND_PERIOD",
	});
}
