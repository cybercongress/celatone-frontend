/* eslint-disable sonarjs/no-duplicate-string */
import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import { wallets as compassWallets } from "@cosmos-kit/compass";
import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as staionWallets } from "@cosmos-kit/station";
import { assets, chains } from "chain-registry";
import _ from "lodash";
import { useMemo } from "react";

import type { ChainConfig, ChainConfigs } from "config/chain";
import { CHAIN_CONFIGS } from "config/chain";
import {
  initiatestnet,
  initiatestnetAssets,
} from "lib/chain-registry/initiatestnet";
import {
  localosmosis,
  localosmosisAsset,
} from "lib/chain-registry/localosmosis";
import { sei, seiAssets } from "lib/chain-registry/sei";
import {
  terra2testnet,
  terra2testnetAssets,
} from "lib/chain-registry/terra2testnet";
import { useChainConfigStore } from "lib/providers/store";

const getWallets = (wallets: SharedChainConfig["wallets"]) =>
  wallets.reduce(
    (acc, wallet) => {
      switch (wallet) {
        case "keplr":
          return [...acc, ...keplrWallets];
        case "initia":
          return [...acc, ...initiaWallets];
        case "compass":
          return [...acc, ...compassWallets];
        case "station":
          return [...acc, ...staionWallets];
        default:
          return acc;
      }
    },
    [] as ChainConfig["wallets"]
  );

export const useChainConfigs = (): {
  chainConfigs: ChainConfigs;
  registryChains: Chain[];
  registryAssets: AssetList[];
} => {
  const { chainConfigs } = useChainConfigStore();

  const local = useMemo(
    () =>
      Object.values(chainConfigs).reduce(
        (acc, each) => {
          if (!each) {
            return acc;
          }

          const localChainConfig: ChainConfig = {
            tier: each.tier,
            chain: each.chain,
            registryChainName: each.registryChainName,
            prettyName: each.prettyName,
            networkType: each.network_type,
            lcd: each.lcd,
            rpc: each.rpc,
            indexer: each.graphql || "",
            wallets: getWallets(each.wallets),
            features: each.features,
            gas: {
              gasPrice: {
                tokenPerGas: _.get(
                  each,
                  "fees.fee_tokens[0].fixed_min_gas_price",
                  0
                ),
                denom: _.get(each, "fees.fee_tokens[0].denom", ""),
              },
              gasAdjustment: each.gas.gasAdjustment,
              maxGasLimit: each.gas.maxGasLimit,
            },
            extra: each.extra,
          };

          const localRegistryChain: Chain = {
            chain_name: each.registryChainName,
            status: "live",
            network_type: each.network_type,
            pretty_name: each.prettyName,
            chain_id: each.chainId,
            bech32_prefix: each.registry?.bech32_prefix ?? "",
            slip44: 118,
            fees: each.fees,
            staking: each.registry?.staking,
            logo_URIs: each.logo_URIs,
          };

          const localRegistryAssets: AssetList = {
            $schema: "../assetlist.schema.json",
            chain_name: each.registryChainName,
            assets: each.registry?.assets ?? [],
          };

          return {
            ...acc,
            chainConfigs: {
              ...acc.chainConfigs,
              [each.chainId]: localChainConfig,
            },
            registryChains: [...acc.registryChains, localRegistryChain],
            registryAssets: [...acc.registryAssets, localRegistryAssets],
          };
        },
        {
          chainConfigs: {} as ChainConfigs,
          registryChains: [] as Chain[],
          registryAssets: [] as AssetList[],
        }
      ),
    [chainConfigs]
  );

  return {
    chainConfigs: _.merge(CHAIN_CONFIGS, local.chainConfigs),
    registryChains: [
      ...chains,
      localosmosis,
      sei,
      terra2testnet,
      ...initiatestnet,
      ...local.registryChains,
    ],
    registryAssets: [
      ...assets,
      localosmosisAsset,
      seiAssets,
      terra2testnetAssets,
      ...initiatestnetAssets,
      ...local.registryAssets,
    ],
  };
};
