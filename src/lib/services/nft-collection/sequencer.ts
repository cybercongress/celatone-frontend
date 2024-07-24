import axios from "axios";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import type { Activity, CollectionCreatorResponse } from "../types";
import {
  zCollectionByCollectionAddressResponseSequencer,
  zCollectionsByAccountResponseSequencer,
} from "../types";
import type { HexAddr, HexAddr32, Option } from "lib/types";
import {
  bech32AddressToHex,
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

export const getCollectionByCollectionAddressSequencer = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/${encodeURI(collectionAddress)}`
    )
    .then(({ data }) =>
      parseWithError(zCollectionByCollectionAddressResponseSequencer, data)
    );

export const getCollectionsByAccountSequencer = async (
  endpoint: string,
  accountAddress: HexAddr
) =>
  axios
    .get(
      `${endpoint}/indexer/nft/v1/collections/by_account/${encodeURI(accountAddress)}`,
      {
        params: {
          "pagination.count_total": false,
          "pagination.reverse": true,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zCollectionsByAccountResponseSequencer, data)
    );

export const getCollectionCreatorSequencer = async (
  endpoint: string,
  prefix: string,
  collectionAddress: HexAddr32
): Promise<CollectionCreatorResponse> => {
  const txByCollectionAddress = await getTxsByAccountAddressSequencer({
    endpoint,
    address: collectionAddress,
    limit: 1,
    reverse: false,
  });

  if (!txByCollectionAddress.items.length)
    throw new Error("No collection transaction found");

  const tx = txByCollectionAddress.items[0];

  const sender = bech32AddressToHex(
    convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix)
  );

  return {
    creatorAddress: sender,
    txhash: tx.hash,
    height: tx.height,
    timestamp: tx.created,
  };
};

export const getCollectionActivitiesSequencer = async (
  endpoint: string,
  paginationKey: Option<string>,
  collectionAddress: HexAddr32
) => {
  const txsByCollectionAddress = await getTxsByAccountAddressSequencer({
    endpoint,
    address: collectionAddress,
    paginationKey,
    limit: 10,
  });

  const collectionActivities: Activity[] = [];

  txsByCollectionAddress.items.forEach((tx) => {
    const { events, hash, created } = tx;

    events?.reverse()?.forEach((event) => {
      if (
        (!event.attributes[0].value.includes("0x1::object::") &&
          !event.attributes[0].value.includes("0x1::collection::")) ||
        event.attributes[0].value === "0x1::object::CreateEvent"
      )
        return;

      const eventValue = event.attributes[0].value.split("::")[2];
      // eslint-disable-next-line no-console
      console.log("txHash: ", hash);
      // eslint-disable-next-line no-console
      console.log("event: ", event);

      let tokenId;
      try {
        tokenId = JSON.parse(event.attributes[1].value).token_id;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Error getting tokenId: ", err);
      }

      collectionActivities.push({
        txhash: hash,
        timestamp: created,
        isNftBurn: eventValue === "BurnEvent",
        isNftMint: eventValue === "MintEvent",
        isNftTransfer: eventValue === "TransferEvent",
        tokenId,
        nftAddress: null,
        isCollectionCreate: eventValue === "CreateCollectionEvent",
      });
    });
  });

  return {
    items: collectionActivities,
    pagination: txsByCollectionAddress.pagination,
  };
};
