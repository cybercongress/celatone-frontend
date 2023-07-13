import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

import type { ChainConfig } from "./types";

export const DEFAULT_CHAIN_CONFIG: ChainConfig = {
  chain: "",
  registryChainName: "",
  prettyName: "",
  lcd: "",
  rpc: "",
  indexer: "",
  api: "",
  features: {
    faucet: {
      enabled: false,
    },
    wasm: {
      enabled: false,
    },
    pool: {
      enabled: false,
    },
    publicProject: {
      enabled: false,
    },
  },
  gas: {
    gasPrice: {
      tokenPerGas: 0,
      denom: "",
    },
    gasAdjustment: 1.0,
    maxGasLimit: 0,
  },
  exampleAddresses: {
    user: "" as HumanAddr,
    contract: "" as ContractAddr,
    validator: "" as ValidatorAddr,
  },
  explorerLink: {
    validator: "",
    proposal: "",
  },
  hasSubHeader: false,
};
