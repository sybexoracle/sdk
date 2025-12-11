import { defineChain } from "viem";

export const bsc = defineChain({
	id: 56,
	name: "BNB Smart Chain",
	nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://bsc-dataseed1.binance.org/"] },
	},
	blockExplorers: {
		default: { name: "BscScan", url: "https://bscscan.com" },
	},
	testnet: false,
});

export const SupportedChain = [56] as const;
export type SupportedChain = (typeof SupportedChain)[number];
