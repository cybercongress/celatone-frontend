import axios from "axios";

import {
  zActivitiesResponse,
  zCollectionByCollectionAddressResponse,
  zCollectionCreatorResponse,
  zNftCollectionsResponse,
} from "../types";
import type { HexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";

export const getNftCollections = async (
  endpoint: string,
  limit: number,
  offset: number,
  search = ""
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        search,
      },
    })
    .then(({ data }) => parseWithError(zNftCollectionsResponse, data));

export const getNftCollectionByCollectionAddress = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  axios
    .get(`${endpoint}/${encodeURI(collectionAddress)}`)
    .then(({ data }) =>
      parseWithError(zCollectionByCollectionAddressResponse, data)
    );

export const getNftCollectionCreatorByCollectionAddress = async (
  endpoint: string,
  collectionAddress: HexAddr32
) =>
  axios
    .get(`${endpoint}/${encodeURI(collectionAddress)}/creator`)
    .then(({ data }) => parseWithError(zCollectionCreatorResponse, data));

export const getNftCollectionActivitiesByCollectionAddress = async (
  endpoint: string,
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search: string
) =>
  axios
    .get(`${endpoint}/${encodeURI(collectionAddress)}/activities`, {
      params: {
        limit,
        offset,
        search,
      },
    })
    .then(({ data }) => parseWithError(zActivitiesResponse, data));
