import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type {
  ResourceGroup,
  ResourceGroupByAccount,
  MoveAccountAddr,
} from "lib/types";
import { truncate } from "lib/utils";

import { getAccountResources } from "./resource";

export interface AccountResourcesReturn {
  groupedByOwner: ResourceGroupByAccount[];
  groupedByName: ResourceGroup[];
  totalCount: number;
}

export const useAccountResources = ({
  address,
}: {
  address: MoveAccountAddr;
}): UseQueryResult<AccountResourcesReturn> => {
  const endpoint = useBaseApiRoute("accounts");
  const queryFn: QueryFunction<AccountResourcesReturn> = () =>
    getAccountResources(endpoint, address).then((resources) => {
      const groupedByOwner = resources.items.reduce<
        Record<string, ResourceGroupByAccount>
      >((acc, resource) => {
        const [ownerName, groupName] = resource.structTag.split("::");

        const ownerResources = acc[ownerName]?.resources ?? [];
        const groupResourcesIndex = ownerResources.findIndex(
          (ownerResource) => ownerResource.group === groupName
        );
        if (groupResourcesIndex === -1)
          ownerResources.push({
            group: groupName,
            account: ownerName as MoveAccountAddr,
            displayName: `${truncate(ownerName)}::${groupName}`,
            items: [resource],
          });
        else ownerResources[groupResourcesIndex].items.push(resource);

        return {
          ...acc,
          [ownerName]: {
            owner: ownerName as MoveAccountAddr,
            resources: ownerResources,
          },
        };
      }, {});

      const groupedByName = resources.items.reduce<
        Record<string, ResourceGroup>
      >((acc, resource) => {
        const [accountName, groupName] = resource.structTag.split("::");
        const groupResources = acc[groupName] ?? {};
        const items = groupResources?.items ?? [];
        items.push(resource);

        return {
          ...acc,
          [groupName]: {
            displayName: `${truncate(accountName)}::${groupName}`,
            account: accountName as MoveAccountAddr,
            group: groupName,
            items,
          },
        };
      }, {});

      return {
        totalCount: resources.total,
        groupedByOwner: Object.values(groupedByOwner),
        groupedByName: Object.values(groupedByName),
      };
    });
  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_RESOURCES, endpoint, address],
    queryFn,
    { enabled: Boolean(address), refetchOnWindowFocus: false, retry: 1 }
  );
};
