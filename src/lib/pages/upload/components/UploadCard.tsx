import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import big from "big.js";
import type { ReactElement } from "react";
import { IoIosWarning } from "react-icons/io";
import { MdCheckCircle, MdDeleteOutline } from "react-icons/md";

import type { SimulateStatus } from "../types";
import { UploadIcon } from "lib/components/icon/UploadIcon";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
  simulateStatus: SimulateStatus;
  simulateError: string;
}

interface StatusDecorator {
  icon: JSX.Element | null;
  statusText: ReactElement | string;
  helperText?: string;
}

const getStatusDecorator = (
  status: SimulateStatus,
  error: string
): StatusDecorator => {
  switch (status) {
    case "Completed":
      return {
        icon: <Icon as={MdCheckCircle} boxSize="6" color="success.main" />,
        statusText: <span style={{ color: "#66BB6A" }}>Valid WASM file</span>,
      };
    case "Failed":
      return {
        icon: <Icon as={IoIosWarning} boxSize="6" color="error.main" />,
        statusText: <span style={{ color: "#EF5350" }}>Invalid WASM file</span>,
        helperText: error,
      };
    default:
      return {
        icon: <Spinner color="primary.main" w="40px" h="40px" />,
        statusText: "Loading",
      };
  }
};
export const UploadCard = ({
  file,
  deleteFile,
  simulateStatus,
  simulateError,
}: UploadCardProps) => {
  const isError = simulateStatus === "Failed";
  const {
    icon: StatusIcon,
    statusText,
    helperText,
  } = getStatusDecorator(simulateStatus, simulateError);
  return (
    <>
      <Flex
        align="center"
        p="16px"
        gap="16px"
        w="full"
        bgColor="gray.900"
        borderRadius="4px"
        border="1px solid"
        borderColor={isError ? "error.main" : "gray.900"}
      >
        <UploadIcon />
        <Flex direction="column">
          <Text variant="body1" color="text.main">
            {file.name}
          </Text>
          <Text variant="body2" color="text.dark">
            {big(file.size).div(1000).toFixed(0)} kb • {statusText}
          </Text>
        </Flex>
        <Flex align="center" gap="16px" ml="auto">
          <Icon
            as={MdDeleteOutline}
            color="text.dark"
            boxSize="6"
            onClick={deleteFile}
            cursor="pointer"
          />
          {StatusIcon}
        </Flex>
      </Flex>
      {isError && (
        <Text variant="body3" color="error.main" mt={1} alignSelf="start">
          {helperText}
        </Text>
      )}
    </>
  );
};
