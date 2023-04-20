import { Box, Flex, Image, Text } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";

import { getUndefinedTokenIcon } from "../../utils";
import type { Option, Token, U, USD } from "lib/types";
import {
  getTokenLabel,
  formatPercentValue,
  formatUTokenWithPrecision,
} from "lib/utils";

interface AllocationBadgeProps {
  denom?: string;
  logo?: string;
  symbol?: string;
  precision?: number;
  amount: U<Token<Big>>;
  value: Option<USD<Big>>;
  liquidity: USD<Big>;
  mode: string;
}

export const AllocationBadge = ({
  denom,
  logo,
  symbol,
  precision,
  amount,
  value,
  liquidity,
  mode,
}: AllocationBadgeProps) => (
  <Flex
    bg="pebble.800"
    px={3}
    py={1}
    border="1px solid"
    borderColor="pebble.700"
    borderRadius="8px"
    transition="all .25s ease-in-out"
    alignItems="center"
    gap={2}
  >
    {denom && <Image boxSize={4} src={logo || getUndefinedTokenIcon(denom)} />}
    <Box w="full" minW="50px">
      <Text
        variant="body3"
        className="ellipsis"
        color="text.dark"
        fontWeight="600"
      >
        {denom ? symbol || getTokenLabel(denom) : "OTHERS"}
      </Text>
      <Text variant="body3" color="text.main">
        {mode === "percent-value"
          ? `${formatPercentValue((value ?? big(0)).div(liquidity).times(100))}`
          : `${formatUTokenWithPrecision(amount, precision || 0)}`}
      </Text>
    </Box>
  </Flex>
);
