import type { Coin } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Big } from "big.js";

import { useAssetInfos } from "../assetService";
import { useMovePoolInfos } from "../move/poolService";
import type { BalanceInfos } from "../types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useLcdEndpoint,
} from "lib/app-provider";
import { big } from "lib/types";
import type { BechAddr, TokenWithValue, USD } from "lib/types";
import {
  coinToTokenWithValue,
  compareTokenWithValues,
  filterSupportedTokens,
  totalValueTokenWithValue,
} from "lib/utils";

import { getBalances } from "./api";
import { getBalancesLcd } from "./lcd";

export const useBalances = (address: BechAddr): UseQueryResult<Coin[]> => {
  const {
    chainConfig: { chain },
  } = useCelatoneApp();
  const isSei = chain === "sei";
  const apiEndpoint = useBaseApiRoute("accounts");
  const lcdEndpoint = useLcdEndpoint();
  const endpoint = isSei ? apiEndpoint : lcdEndpoint;

  return useQuery(
    [CELATONE_QUERY_KEYS.BALANCES, endpoint, address, isSei],
    async () =>
      isSei
        ? getBalances(endpoint, address)
        : getBalancesLcd(endpoint, address),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useBalanceInfos = (address: BechAddr): BalanceInfos => {
  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });
  const { data: accountBalances, isLoading, error } = useBalances(address);

  const balances = accountBalances
    ?.map<TokenWithValue>((balance) =>
      coinToTokenWithValue(
        balance.denom,
        balance.amount,
        assetInfos,
        movePoolInfos
      )
    )
    .sort(compareTokenWithValues);

  // Supported assets should order by descending value
  const {
    supportedTokens: supportedAssets,
    unsupportedTokens: unsupportedAssets,
  } = filterSupportedTokens(balances);
  const totalSupportedAssetsValue = balances
    ? totalValueTokenWithValue(supportedAssets, big(0) as USD<Big>)
    : undefined;

  return {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading: isLoading || isAssetInfosLoading,
    totalData: balances?.length,
    error: error as Error,
  };
};
