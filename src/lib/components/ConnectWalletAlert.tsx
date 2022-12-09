import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";
import { MdLink } from "react-icons/md";

interface ConnectWalletAlertProps extends AlertProps {
  title?: string;
  subtitle?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      variant="info"
      alignItems="center"
      justifyContent="space-between"
      py="12px"
    >
      <Flex>
        <AlertIcon />
        <Box>
          <AlertTitle>
            <Text variant="body1" fontWeight="600" color="info.main">
              {title}
            </Text>
          </AlertTitle>
          <AlertDescription>
            <Text variant="body2" color="info.main">
              {subtitle}
            </Text>
          </AlertDescription>
        </Box>
      </Flex>
      <Button variant="ghost" gap={2} onClick={onClickConnect}>
        <Icon as={MdLink} boxSize={4} color="info.main" />
        <Text color="info.main">Connect Wallet</Text>
      </Button>
    </Alert>
  ) : null;
};
