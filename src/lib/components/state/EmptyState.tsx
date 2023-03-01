import { Flex, Icon, Text, Image } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";

interface EmptyStateProps {
  icon?: IconType;
  image?: string;
  message: string;
  withBorder?: boolean;
}

export const EmptyState = ({
  icon,
  message,
  image,
  withBorder = false,
}: EmptyStateProps) => (
  <Flex
    py="64px"
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="pebble.700"
  >
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {icon && <Icon as={icon} color="pebble.600" boxSize="16" />}
      {image && (
        <Image
          src="https://assets.alleslabs.dev/illustration/search-not-found.svg"
          alt="result not found"
          width="200px"
        />
      )}
      <Text color="text.dark" w="540px" textAlign="center">
        {message}
      </Text>
    </Flex>
  </Flex>
);
