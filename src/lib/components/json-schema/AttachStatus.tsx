import { Flex, Text } from "@chakra-ui/react";

import { ConnectingLine } from "../ConnectingLine";
import { CustomIcon } from "../icon";

interface AttachStatusProps {
  attached?: boolean;
  codeId?: string;
}
export const AttachStatus = ({
  attached = false,
  codeId,
}: AttachStatusProps) => {
  return (
    <Flex position="relative" gap={10} mb={4}>
      <Flex
        bgColor="gray.800"
        borderRadius={4}
        p={2}
        gap={2}
        w="full"
        justifyContent="center"
      >
        <CustomIcon name="code" color="gray.400" />
        Code ID: {codeId}
      </Flex>
      <ConnectingLine
        alignment="horizontal"
        isFilled={attached}
        style={{
          width: "full",
          top: "calc(50% - 6px)",
          left: "calc(50% - 24px)",
        }}
      />
      <Flex
        bgColor={attached ? "gray.800" : "transparent"}
        borderRadius={4}
        border={
          attached
            ? "1px solid var(--chakra-colors-gray-600)"
            : "1px dashed var(--chakra-colors-primary-light)"
        }
        p={2}
        gap={2}
        justifyContent="center"
        w="full"
      >
        <CustomIcon
          name={attached ? "edit" : "upload"}
          color={attached ? "gray.400" : "primary.light"}
        />
        <Text color={attached ? "gray.400" : "primary.light"}>
          {attached ? "Reattaching JSON Schema..." : "Attaching JSON Schema..."}
        </Text>
      </Flex>
    </Flex>
  );
};
