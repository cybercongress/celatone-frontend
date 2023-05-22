import {
  Alert,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

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
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      variant="accent"
      alignItems="center"
      justifyContent="space-between"
      py="12px"
    >
      <Flex gap={2}>
        <CustomIcon name="wallet-solid" boxSize="4" />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{subtitle}</AlertDescription>
        </Box>
      </Flex>
      <Button size="sm" variant="ghost-accent" gap={2} onClick={onClickConnect}>
        <CustomIcon name="connect" /> Connect Wallet
      </Button>
    </Alert>
  ) : null;
};
