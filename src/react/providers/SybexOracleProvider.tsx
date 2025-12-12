import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useAccount } from "wagmi";
import { type SybexOracleConfig } from "../types";

const SybexOracleContext = createContext<SybexOracleConfig | undefined>(undefined);

interface SybexOracleProviderProps {
  children: ReactNode;
  config: SybexOracleConfig;
}

/**
 * Provider component for SybexOracle configuration
 *
 * @example
 * ```tsx
 * import { SybexOracleProvider } from '@sybexoracle/sdk/react';
 *
 * function App() {
 *   return (
 *     <SybexOracleProvider config={{ chainId: 56 }}>
 *       <YourApp />
 *     </SybexOracleProvider>
 *   );
 * }
 * ```
 */
export function SybexOracleProvider({ children, config }: SybexOracleProviderProps) {
  return (
    <SybexOracleContext.Provider value={config}>
      {children}
    </SybexOracleContext.Provider>
  );
}

/**
 * Hook to access the SybexOracle configuration
 *
 * @example
 * ```tsx
 * import { useSybexOracle } from '@sybexoracle/sdk/react';
 *
 * function Component() {
 *   const { chainId, contractAddress } = useSybexOracle();
 *   console.log('Current chain:', chainId);
 *   return <div>...</div>;
 * }
 * ```
 */
export function useSybexOracle(): SybexOracleConfig {
  const context = useContext(SybexOracleContext);
  const { chain } = useAccount();

  if (!context) {
    throw new Error("useSybexOracle must be used within a SybexOracleProvider");
  }

  // If user is connected, use their chain ID, otherwise use the provider's chain ID
  const finalChainId = chain?.id ?? context.chainId;

  return {
    ...context,
    chainId: finalChainId,
  };
}