import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";

import type {
  AccountTxsResponse,
  BlockTxsResponse,
  TxData,
  TxsResponse,
} from "../types/tx";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useInitia,
  useLcdEndpoint,
  useMoveConfig,
  useTierConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Option,
  TxFilters,
} from "lib/types";
import { extractTxLogs, isTxHash, snakeToCamel } from "lib/utils";

import {
  getTxData,
  getTxs,
  getTxsByAddress,
  getTxsByBlockHeight,
  getTxsCountByAddress,
} from "./api";
import {
  getTxDataLcd,
  getTxsByAccountAddressLcd,
  getTxsByContractAddressLcd,
  getTxsByHashLcd,
} from "./lcd";

export const useTxData = (
  txHash: Option<string>,
  enabled = true
): UseQueryResult<TxData> => {
  const { currentChainId } = useCelatoneApp();
  const isFullTier = useTierConfig() === "full";
  const apiEndpoint = useBaseApiRoute("txs");
  const lcdEndpoint = useLcdEndpoint();

  const endpoint = isFullTier ? apiEndpoint : lcdEndpoint;

  const queryFn = useCallback(
    async (hash: Option<string>) => {
      if (!hash) throw new Error("CELATONE_QUERY_KEYS.TX_DATA is undefined");

      const txData = isFullTier
        ? await getTxData(endpoint, hash)
        : await getTxDataLcd(endpoint, hash);

      const { txResponse } = txData;

      const logs = extractTxLogs(txResponse);

      const payload = snakeToCamel(txResponse);

      return {
        ...payload,
        logs,
        chainId: currentChainId,
        isTxFailed: Boolean(txResponse.code),
      };
    },
    [currentChainId, endpoint, isFullTier]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.TX_DATA, endpoint, txHash],
    async () => queryFn(txHash),
    {
      enabled: enabled && Boolean(txHash && isTxHash(txHash)),
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxs = (
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<TxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS,
      endpoint,
      limit,
      offset,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxs(endpoint, limit, offset, wasmEnable, moveEnable, isInitia),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  offset: number,
  limit: number
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<AccountTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
      limit,
      offset,
      isWasm,
      isMove,
    ],
    async () => {
      if (!address) throw new Error("No user address");
      return getTxsByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        limit,
        offset,
        isWasm,
        isMove,
        isInitia
      );
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByBlockHeight = (
  height: number,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<BlockTxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<BlockTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT,
      endpoint,
      limit,
      offset,
      height,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxsByBlockHeight(
        endpoint,
        height,
        limit,
        offset,
        wasmEnable,
        moveEnable,
        isInitia
      ),
    {
      ...options,
      keepPreviousData: true,
      enabled: !!height,
    }
  );
};

export const useTxsCountByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_COUNT_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
    ],
    async () => {
      if (!address)
        throw new Error("address is undefined (useTxsCountByAddress)");
      return getTxsCountByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        wasmEnable
      );
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByContractAddressLcd = (
  address: BechAddr32,
  offset: number,
  limit: number
) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.TXS_BY_CONTRACT_ADDRESS_LCD, endpoint, address],
    async () => getTxsByContractAddressLcd(endpoint, address, offset, limit),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByAccountAddressLcd = (
  address: Option<BechAddr20>,
  offset: number,
  limit: number
) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.TXS_BY_ACCOUNT_ADDRESS_LCD, endpoint, address],
    async () => {
      if (!address)
        throw new Error("address is undefined (useTxsByAccountAddressLcd)");
      return getTxsByAccountAddressLcd(endpoint, address, offset, limit);
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByAddressLcd = (
  address: Option<BechAddr20>,
  search: string,
  offset: number,
  limit: number,
  options: Pick<UseQueryOptions<TxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useLcdEndpoint();
  const { validateContractAddress } = useValidateAddress();

  const queryfn = useCallback(() => {
    if (isTxHash(search)) return getTxsByHashLcd(endpoint, search);

    if (!validateContractAddress(search))
      return getTxsByContractAddressLcd(
        endpoint,
        search as BechAddr32,
        offset,
        limit
      );

    if (!address) throw new Error("address is undefined (useTxsByAddressLcd)");
    return getTxsByAccountAddressLcd(endpoint, address, offset, limit);
  }, [address, endpoint, limit, offset, search, validateContractAddress]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_LCD,
      endpoint,
      address,
      search,
      offset,
      limit,
    ],
    queryfn,
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export * from "./gql";
