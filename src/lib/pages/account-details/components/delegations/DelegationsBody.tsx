import { Flex, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { DelegationsTable, UnbondingsTable } from "../tables";
import { useTrack } from "lib/amplitude";
import type { Delegation, Unbonding } from "lib/pages/account-details/data";
import type { Option, TokenWithValue } from "lib/types";

import { RadioCard } from "./RadioCard";

interface DelegationsBodyProps {
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isLoadingDelegations: boolean;
  isLoadingUnbondings: boolean;
  defaultToken: TokenWithValue;
}

export const DelegationsBody = ({
  totalDelegations,
  delegations,
  totalUnbondings,
  unbondings,
  rewards,
  isLoadingDelegations,
  isLoadingUnbondings,
  defaultToken,
}: DelegationsBodyProps) => {
  // NOTE: set between "Delegated" and "Unbonding"
  const [value, setValue] = useState("Delegated");
  const { trackUseRadio } = useTrack();
  return (
    <Flex direction="column" gap={8}>
      <RadioGroup
        onChange={(newValue) => {
          trackUseRadio(newValue.toLocaleLowerCase());
          setValue(newValue);
        }}
        value={value}
        overflowX="scroll"
      >
        <Stack direction={{ base: "column", md: "row" }}>
          <RadioCard
            value="Delegated"
            total={totalDelegations}
            defaultToken={defaultToken}
            isLoading={isLoadingDelegations}
          />
          <RadioCard
            value="Unbonding"
            total={totalUnbondings}
            defaultToken={defaultToken}
            isLoading={isLoadingUnbondings}
          />
        </Stack>
      </RadioGroup>
      {value === "Delegated" ? (
        <DelegationsTable
          delegations={delegations}
          rewards={rewards}
          defaultToken={defaultToken}
          isLoading={isLoadingDelegations}
        />
      ) : (
        <UnbondingsTable
          unbondings={unbondings}
          isLoading={isLoadingUnbondings}
        />
      )}
    </Flex>
  );
};
