import { Flex, Heading, Box, Text, Icon } from "@chakra-ui/react";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdSearch, MdInput } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { useContractStore, useUserKey } from "lib/hooks";

export const RecentActivities = observer(() => {
  const userKey = useUserKey();
  const { getRecentActivities, isHydrated } = useContractStore();
  const router = useRouter();

  const activities = useMemo(() => {
    return getRecentActivities(userKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecentActivities, userKey, isHydrated]);

  return (
    <Box py={8}>
      <Heading px={12} as="h6" variant="h6" mb={4}>
        Recent Activities on this device
      </Heading>
      {activities.length ? (
        <Flex px={12} gap={4} overflowX="scroll" w="100%">
          {activities.map((item) => (
            <Flex
              direction="column"
              gap={3}
              minW="360px"
              p={6}
              bg="gray.900"
              borderRadius="8px"
              _hover={{ bg: "hover.main" }}
              transition="all .25s ease-in-out"
              key={item.type + item.contractAddress + item.timestamp}
              onClick={() =>
                router.push(
                  `/${item.type}?contract=${item.contractAddress}&msg=${item.msg}`
                )
              }
            >
              <Flex alignItems="center" gap={1}>
                <Icon
                  as={item.type === "query" ? MdSearch : MdInput}
                  color="gray.600"
                  boxSize={4}
                />
                <Text variant="body2" color="text.dark">
                  {item.type === "query" ? "Query" : "Execute"}
                </Text>
              </Flex>
              <Flex alignItems="center" gap="4px">
                <Text
                  variant="body3"
                  color="text.main"
                  padding="4px 8px"
                  backgroundColor="hover.main"
                  borderRadius="16px"
                >
                  {item.action}
                </Text>
                <Text variant="body3">on</Text>
                <ExplorerLink
                  value={item.contractAddress}
                  type="contract_address"
                  canCopyWithHover
                />
              </Flex>
              <Flex gap={1}>
                <Text variant="body2" color="text.main">
                  {dayjs(item.timestamp).toNow(true)} ago{" "}
                </Text>
                {item.sender && (
                  <>
                    <Text variant="body2" color="text.main">
                      by
                    </Text>
                    <ExplorerLink
                      value={item.sender}
                      type="user_address"
                      canCopyWithHover
                    />
                  </>
                )}
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex
          px={12}
          borderTopWidth={1}
          borderBottomWidth={1}
          justifyContent="center"
          alignItems="center"
          minH="128px"
        >
          <Text color="text.dark" variant="body1">
            Your recent queries will display here.
          </Text>
        </Flex>
      )}
    </Box>
  );
});
