import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";

import { Copier } from "lib/components/Copier";
import type { BalanceWithAssetInfo, Token } from "lib/types";
import {
  calAssetValueWithPrecision,
  formatPrice,
  formatTokenWithPrecision,
} from "lib/utils";

interface TokenCardProps {
  userBalance: BalanceWithAssetInfo;
}

export const TokenCard = ({ userBalance }: TokenCardProps) => {
  const { symbol, price, amount, precision, id } = userBalance.balance;
  const tokenInfoText = price
    ? `1 ${symbol} = $${formatPrice(price)}
    Token ID: ${id}`
    : "No Price Data";

  return (
    <Tooltip
      hasArrow
      label={tokenInfoText}
      placement="top"
      bg="honeydew.darker"
      maxW="240px"
      whiteSpace="pre-line"
      textAlign="center"
    >
      <Flex
        gap={2}
        p={2}
        background="pebble.900"
        borderRadius="8px"
        alignItems="center"
        _hover={{
          bgColor: "pebble.800",
          "& .copy-button": { display: "flex" },
        }}
      >
        <Image boxSize={8} src={userBalance.assetInfo?.logo} alt={symbol} />
        <div>
          <Flex gap={1} align="center">
            <Text fontWeight="700" variant="body2">
              {formatTokenWithPrecision(amount as Token, precision)}
            </Text>
            <Text variant="body2">{symbol}</Text>
            <Copier
              value={id}
              copyLabel="Token ID Copied!"
              ml="1px"
              display="none"
              className="copy-button"
            />
          </Flex>
          <Text variant="body3" color="text.dark">
            {price
              ? `$${formatPrice(
                  calAssetValueWithPrecision(userBalance.balance)
                )}`
              : "-"}
          </Text>
        </div>
      </Flex>
    </Tooltip>
  );
};
