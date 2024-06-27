import { useMemo } from "react";

import type { HexAddr, HexAddr32 } from "lib/types";
import { isHexModuleAddress, isTxHash } from "lib/utils";

export const useCollectionsExpression = (search = "") =>
  useMemo(
    () =>
      search.trim().length > 0
        ? {
            _or: [
              { name: { _iregex: search } },
              { vm_address: { vm_address: { _eq: search } } },
            ],
          }
        : {},
    [search]
  );

export const useCollectionActivitiesExpression = (
  collectionAddress: HexAddr32,
  search = ""
) => {
  const isNftAddress = isHexModuleAddress(search);
  const isHash = isTxHash(search);

  const tokenIdSearch = {
    nft: isNftAddress
      ? { vm_address: { vm_address: { _eq: search.toLowerCase() } } }
      : { token_id: { _iregex: search } },
  };
  const txHashSearch = {
    transaction: {
      hash: {
        _eq: `\\x${search.toLowerCase()}`,
      },
    },
  };

  const searchOption = isHash ? txHashSearch : tokenIdSearch;

  return useMemo(
    () => ({
      collection: { vm_address: { vm_address: { _eq: collectionAddress } } },
      _and: search ? searchOption : {},
    }),
    [collectionAddress, search, searchOption]
  );
};

/**
 *
 * @param collectionAddress
 * @param search - NFT address or token ID
 * @returns
 */
export const useNftsExpression = (collectionAddress: HexAddr32, search = "") =>
  useMemo(() => {
    const orExpression = {
      _or: [
        { token_id: { _iregex: search } },
        ...(isHexModuleAddress(search)
          ? [{ vm_address: { vm_address: { _eq: search } } }]
          : []),
      ],
    };

    return {
      collectionByCollection: {
        vm_address: { vm_address: { _eq: collectionAddress } },
      },
      is_burned: { _eq: false },
      ...(search.trim().length > 0 ? orExpression : {}),
    };
  }, [collectionAddress, search]);

export const useNftsByAccountExpression = (
  accountAddress: HexAddr,
  collectionAddress?: HexAddr32,
  search = ""
) =>
  useMemo(() => {
    const orExpression = {
      _or: [
        { token_id: { _iregex: search } },
        ...(isHexModuleAddress(search)
          ? [{ vm_address: { vm_address: { _eq: search } } }]
          : []),
      ],
    };

    const collectionExpression = {
      collectionByCollection: {
        vm_address: { vm_address: { _eq: collectionAddress } },
      },
    };

    return {
      vmAddressByOwner: { vm_address: { _eq: accountAddress } },
      is_burned: { _eq: false },
      ...(collectionAddress ? collectionExpression : {}),
      ...(search.trim().length > 0 ? orExpression : {}),
    };
  }, [accountAddress, collectionAddress, search]);
