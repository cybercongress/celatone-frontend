import { Box, Text } from "@chakra-ui/react";

import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenCard, UnsupportedToken } from "lib/components/token";
import { useEvmDenomByAddressLcd } from "lib/services/evm";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, HexAddr20, Option } from "lib/types";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  hexToBig,
  isSupportedToken,
} from "lib/utils";

import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";
import { InfoLabelValue } from "./InformationRow";

interface EvmTxTransferErc20Props {
  evmTxData: TxDataJsonRpc;
  assetInfos: Option<AssetInfos>;
}

export const EvmTxTransferErc20 = ({
  evmTxData,
  assetInfos,
}: EvmTxTransferErc20Props) => {
  const { from, input, to: erc20Contract } = evmTxData.tx;
  const { data: evmDenom } = useEvmDenomByAddressLcd(
    erc20Contract as HexAddr20
  );

  const to = `0x${evmTxData.tx.input.slice(34, 74)}`;
  const amountBig = hexToBig(evmTxData.tx.input.slice(74, 138));

  const amount = coinToTokenWithValue(
    evmDenom ?? "",
    amountBig.toString(),
    assetInfos
  );

  return (
    <EvmTxMethodAccordion
      msgIcon="send"
      content={
        <Box display="inline">
          <ExplorerLink
            type="user_address"
            value={from}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_send_address"
          />{" "}
          <EvmMethodChip txInput={input} width="110px" />{" "}
          {formatTokenWithValue(amount)} to{" "}
          {to ? (
            <ExplorerLink
              type="user_address"
              value={to}
              showCopyOnHover
              textVariant="body1"
            />
          ) : (
            <Text>-</Text>
          )}
        </Box>
      }
    >
      <InfoLabelValue
        label="From"
        value={
          <ExplorerLink type="user_address" value={from} showCopyOnHover />
        }
      />
      <InfoLabelValue
        label="To"
        value={
          to ? (
            <ExplorerLink type="user_address" value={to} showCopyOnHover />
          ) : (
            <Text>-</Text>
          )
        }
      />
      <InfoLabelValue
        label="Transferred Token"
        value={
          isSupportedToken(amount) ? (
            <TokenCard token={amount} minW={{ base: "full", md: "50%" }} />
          ) : (
            <UnsupportedToken
              token={amount}
              minW={{ base: "full", md: "50%" }}
            />
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
