import { Flex, Text } from "@chakra-ui/react";

import { PenaltyStatus } from "../types";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

// TODO add block height in interface
interface PenaltyStatusSectionProps {
  validatorName?: string;
  status: PenaltyStatus;
}
export const PenaltyStatusSection = ({
  validatorName = "This validator",
  status,
}: PenaltyStatusSectionProps) => {
  return (
    <Flex
      alignItems="center"
      gap={2}
      pt={4}
      borderTop="1px solid"
      borderTopColor="gray.700"
    >
      {status === PenaltyStatus.NEVER ? (
        <Text variant="body2" color="text.dark">
          {validatorName} never had any slash or jailed history within 90 days.
        </Text>
      ) : (
        <Flex alignItems="center" gap={1}>
          <CustomIcon
            name="alert-triangle"
            color={
              status === PenaltyStatus.SLASHED ? "error.main" : "warning.main"
            }
          />
          <Text variant="body2" color="text.main">
            {status} at block height
          </Text>
          <ExplorerLink type="block_height" value="123456789" showCopyOnHover />
        </Flex>
      )}
    </Flex>
  );
};
