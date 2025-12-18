import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc } from "../src/constants/chains";

// Configuration for examples
export const config = {
	// BSC Mainnet
	mainnet: {
		chain: bsc,
		rpc: process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org/",
		// IMPORTANT: Never hardcode private keys in production!
		privateKey: process.env.PRIVATE_KEY || "",
	},

	// BSC Testnet (for testing)
	testnet: {
		chain: {
			...bsc,
			id: 97, // BSC Testnet Chain ID
			name: "BNB Smart Chain Testnet",
			rpcUrls: {
				default: {
					http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
				},
			},
			testnet: true,
		},
		rpc:
			process.env.BSC_TESTNET_RPC_URL ||
			"https://data-seed-prebsc-1-s1.binance.org:8545/",
		privateKey: process.env.PRIVATE_KEY || "",
	},
};

// Create clients for examples
export function createClients(network: "mainnet" | "testnet" = "testnet") {
	const cfg = config[network];

	if (!cfg.privateKey) {
		throw new Error("Please set PRIVATE_KEY in your environment variables");
	}

	const account = privateKeyToAccount(cfg.privateKey as `0x${string}`);

	const publicClient = createPublicClient({
		chain: cfg.chain,
		transport: http(cfg.rpc),
	});

	const walletClient = createWalletClient({
		chain: cfg.chain,
		transport: http(cfg.rpc),
		account,
	});

	return {
		publicClient,
		walletClient,
		account,
	};
}

// Common contract addresses (example addresses - replace with actual ones)
export const EXAMPLE_ADDRESSES = {
	// Example: A trusted data provider
	trustedResolver: "0x1234567890123456789012345678901234567890",
	// Example: Another resolver
	secondaryResolver: "0x0987654321098765432109876543210987654321",
} as const;
