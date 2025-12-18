import type { PublicClient, WalletClient } from "viem";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { bsc } from "../constants/chains";
import type {
	Address,
	ChainId,
	ContractName,
	GetContractAddressReturn,
} from "../types";

export function getContractAddress(
	chainId: ChainId,
	contractName: ContractName,
): GetContractAddressReturn {
	const contracts = CONTRACT_ADDRESSES[chainId];
	if (!contracts) {
		throw new Error(`No contracts found for chain ID: ${chainId}`);
	}

	const address = contracts[contractName];
	if (!address) {
		throw new Error(
			`Contract ${contractName} not found for chain ID: ${chainId}`,
		);
	}

	return address as Address;
}

export function getChainId(
	client: PublicClient | WalletClient,
): Promise<ChainId> {
	return client.getChainId() as Promise<ChainId>;
}

export function getChain(chainId: ChainId) {
	switch (chainId) {
		case 56:
			return bsc;
		default:
			throw new Error(`Chain ID ${chainId} is not supported`);
	}
}

export function validateChainId(chainId: number): ChainId {
	const supportedChains = [56] as const;
	if (!supportedChains.includes(chainId as ChainId)) {
		throw new Error(
			`Chain ID ${chainId} is not supported. Supported chains: ${supportedChains.join(", ")}`,
		);
	}
	return chainId as ChainId;
}

export function validateAddress(address: Address): void {
	if (!address || !address.startsWith("0x") || address.length !== 42) {
		throw new Error(`Invalid address: ${address}`);
	}
}

export function validateQuestionText(questionText: string): void {
	if (!questionText || questionText.trim().length === 0) {
		throw new Error("Question text cannot be empty");
	}
	if (questionText.length > 1000) {
		throw new Error("Question text too long (max 1000 characters)");
	}
}

export function validateTimeout(timeout: bigint): void {
	if (timeout <= 0n) {
		throw new Error("Timeout must be greater than 0");
	}
	const maxTimeout = 86400n * 30n; // 30 days in seconds
	if (timeout > maxTimeout) {
		throw new Error(
			`Timeout cannot exceed ${maxTimeout.toString()} seconds (30 days)`,
		);
	}
}

export function validateQuestionId(questionId: bigint): void {
	if (questionId < 0n) {
		throw new Error("Question ID must be non-negative");
	}
}

export function validateCategoryIndex(categoryIndex: number): void {
	if (categoryIndex < 0 || categoryIndex > 255) {
		throw new Error("Category index must be between 0 and 255");
	}
}

export function validateBinaryOutcome(outcome: 0 | 1): void {
	if (outcome !== 0 && outcome !== 1) {
		throw new Error("Binary outcome must be 0 or 1");
	}
}

export function validateRange(lowerBound: bigint, upperBound: bigint): void {
	if (lowerBound >= upperBound) {
		throw new Error("Lower bound must be less than upper bound");
	}
}
