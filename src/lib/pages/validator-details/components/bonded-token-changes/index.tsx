import { Flex } from "@chakra-ui/react";

import { RelatedTransactionTable } from "../tables/RelatedTransactionsTable";
import type { ValidatorAddr } from "lib/types";

import { VotingPowerChart } from "./VotingPowerChart";

interface BondedTokenChangesProps {
  validatorAddress: ValidatorAddr;
}

export const BondedTokenChanges = ({
  validatorAddress,
}: BondedTokenChangesProps) => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
      <VotingPowerChart validatorAddress={validatorAddress} />
      <RelatedTransactionTable />
    </Flex>
  );
};
