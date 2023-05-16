import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import type Big from "big.js";

import { usePoolTxsCount } from "../../data";
import { CustomTab } from "lib/components/CustomTab";
import type { PoolDetail, TokenWithValue } from "lib/types";

import { PoolRelatedTxsTable } from "./tables/pool-txs";

interface PoolRelatedTxsProps {
  pool: PoolDetail<Big, TokenWithValue>;
}

export const PoolRelatedTxs = ({ pool }: PoolRelatedTxsProps) => {
  const { count: countAllTxs, countDisplay: countDisplayAllTxs } =
    usePoolTxsCount(pool.id, "is_all");
  const { count: countSwapTxs, countDisplay: countDisplaySwapTxs } =
    usePoolTxsCount(pool.id, "is_swap");
  const { count: countLpTxs, countDisplay: countDisplayLpTxs } =
    usePoolTxsCount(pool.id, "is_lp");
  const { count: countBondTxs, countDisplay: countDisplayBondTxs } =
    usePoolTxsCount(pool.id, "is_bond");
  const { count: countSuperfluidTxs, countDisplay: countDisplaySuperfluidTxs } =
    usePoolTxsCount(pool.id, "is_superfluid");

  const tableHeaderId = "poolTableHeader";
  return (
    <Box>
      <Flex mt={12} gap={2} alignItems="center">
        <Heading as="h6" variant="h6">
          Related Transactions
        </Heading>
      </Flex>
      <Tabs>
        <TabList
          id={tableHeaderId}
          mt={4}
          borderBottom="1px"
          borderColor="pebble.800"
        >
          <CustomTab count={countDisplayAllTxs}>All</CustomTab>
          <CustomTab count={countDisplaySwapTxs}>Swap</CustomTab>
          <CustomTab count={countDisplayLpTxs}>LP</CustomTab>
          <CustomTab count={countDisplayBondTxs}>Bonding</CustomTab>
          {pool.isSuperfluid && (
            <CustomTab count={countDisplaySuperfluidTxs}>Superfluid</CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countAllTxs}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countSwapTxs}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countLpTxs}
              type="is_lp"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countBondTxs}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countSuperfluidTxs}
                type="is_superfluid"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
