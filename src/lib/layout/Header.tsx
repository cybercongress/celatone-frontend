import {
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  Icon,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Link from "next/link";
import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

import { WalletSection } from "lib/components/Wallet";
import { CHAIN_NAMES, DEFAULT_CHAIN } from "lib/env";

const Header = () => {
  const { currentChainName, setCurrentChain } = useWallet();

  useEffect(() => {
    setCurrentChain(DEFAULT_CHAIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      as="header"
      width="100vw"
      height="full"
      align="center"
      justifyContent="space-between"
      px={6}
    >
      <Link href="/">
        <Heading as="h4" variant="h4">
          Celatone
        </Heading>
      </Link>
      <Flex gap={2}>
        <Menu>
          <MenuButton
            px={4}
            py="5px"
            transition="all 0.2s"
            borderRadius="4px"
            borderWidth="1px"
            _hover={{ bg: "gray.800" }}
            w="170px"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              display="flex"
            >
              <Text
                textOverflow="ellipsis"
                variant="body2"
                overflow="hidden"
                whiteSpace="nowrap"
                maxW="170px"
              >
                {currentChainName}
              </Text>
              <Icon as={FiChevronDown} />
            </Flex>
          </MenuButton>
          <MenuList>
            {CHAIN_NAMES.map((chainName) => (
              <MenuItem
                key={chainName}
                onClick={() => setCurrentChain(chainName)}
              >
                {chainName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <WalletSection />
      </Flex>
    </Flex>
  );
};

export default Header;
