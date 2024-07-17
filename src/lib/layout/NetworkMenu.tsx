import { track } from "@amplitude/analytics-browser";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { CHAIN_CONFIGS } from "config/chain";
import { AmpEvent } from "lib/amplitude";
import { useCelatoneApp, useMobile, useSelectChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const NetworkMenu = () => {
  const isMobile = useMobile();
  const { currentChainId, availableChainIds } = useCelatoneApp();
  const selectChain = useSelectChain();

  const width = isMobile ? "220px" : "170px";

  return (
    <Menu
      onOpen={() => track(AmpEvent.USE_SELECT_NETWORK)}
      autoSelect={!isMobile}
    >
      <MenuButton
        px={4}
        py={2}
        h="full"
        _hover={{ bg: "gray.900" }}
        transition="all 0.25s ease-in-out"
        w={width}
        borderRadius={isMobile ? "8px" : 0}
        borderWidth={isMobile ? "1px" : 0}
        borderColor={isMobile ? "gray.700" : "transparent"}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          display="flex"
          ml={1}
        >
          <Text
            textOverflow="ellipsis"
            variant="body2"
            overflow="hidden"
            whiteSpace="nowrap"
            maxW={width}
          >
            {currentChainId}
          </Text>
          <CustomIcon name="chevron-down" color="gray.600" />
        </Flex>
      </MenuButton>
      <MenuList
        zIndex="dropdown"
        maxH={{ base: "435px", md: "640px" }}
        overflowY="scroll"
        boxShadow="0px 20px 30px 10px var(--chakra-colors-background-main)"
      >
        {availableChainIds.map((chainId) => (
          <MenuItem
            key={chainId}
            onClick={() => selectChain(chainId)}
            transition="all 0.25s ease-in-out"
            isDisabled={!(chainId in CHAIN_CONFIGS)}
          >
            <Flex justify="space-between" align="center" w="full">
              <Flex direction="column">
                <Text variant="body2">
                  {CHAIN_CONFIGS[chainId]?.prettyName || chainId}
                </Text>
                <Text color="text.dark" variant="body3">
                  {chainId}
                </Text>
              </Flex>
              {chainId === currentChainId && (
                <CustomIcon name="check" boxSize={3} color="gray.600" />
              )}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
