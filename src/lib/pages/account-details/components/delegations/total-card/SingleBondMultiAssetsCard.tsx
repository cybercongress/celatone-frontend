import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { Big } from "big.js";

import { CustomIcon } from "lib/components/icon";
import type { Addr, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardModal } from "./TotalCardModal";
import { TotalCardTop } from "./TotalCardTop";

interface SingleBondMultiAssetsCardProps {
  title: string;
  message: string;
  address: Addr;
  tokens: Record<string, TokenWithValue>;
}

export const SingleBondMultiAssetsCard = ({
  title,
  message,
  address,
  tokens,
}: SingleBondMultiAssetsCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex direction="column" minW="233px" gap={1}>
      <TotalCardTop title={title} message={message} fontWeight={500} />
      <Heading variant="h6" as="h6">
        {formatPrice(totalValueTokenWithValue(tokens, Big(0) as USD<Big>))}
      </Heading>
      <Flex
        gap={1}
        align="center"
        cursor="pointer"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "secondary.light",
          "& > p": { color: "secondary.light" },
        }}
        onClick={onOpen}
      >
        <Text
          variant="body2"
          color="secondary.main"
          transition="all .25s ease-in-out"
        >
          View earned tokens
        </Text>
        <CustomIcon name="chevron-right" boxSize={4} color="secondary.main" />
      </Flex>
      <TotalCardModal
        title={title}
        message={message}
        address={address}
        tokens={tokens}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};
