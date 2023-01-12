import type { BoxProps } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Link from "next/link";

import {
  getExplorerBlockUrl,
  getExplorerTxUrl,
  getExplorerUserAddressUrl,
  getProposalUrl,
} from "lib/app-fns/explorer";
import type { AddressReturnType } from "lib/hooks";
import { truncate } from "lib/utils";

import { Copier } from "./Copier";

export type LinkType =
  | AddressReturnType
  | "tx_hash"
  | "code_id"
  | "block"
  | "proposal";

interface ExplorerLinkProps extends BoxProps {
  value: string;
  type?: LinkType;
  copyValue?: string;
  canCopyWithHover?: boolean;
  isReadOnly?: boolean;
  textFormat?: "truncate" | "ellipsis" | "normal";
  maxWidth?: string;
}

const getNavigationUrl = (
  type: ExplorerLinkProps["type"],
  currentChainName: string,
  value: string
) => {
  let url = "";
  switch (type) {
    case "tx_hash":
      url = getExplorerTxUrl(currentChainName);
      break;
    case "contract_address":
      url = "/contract";
      break;
    case "user_address":
      url = getExplorerUserAddressUrl(currentChainName);
      break;
    case "code_id":
      url = "/code";
      break;
    case "block":
      url = getExplorerBlockUrl(currentChainName);
      break;
    case "proposal":
      url = getProposalUrl(currentChainName);
      break;
    case "invalid_address":
      return "";
    default:
      break;
  }
  return `${url}/${value}`;
};

const getValueText = (
  isOwnAddr: boolean,
  isTruncate: boolean,
  value: string
) => {
  if (isOwnAddr) {
    return "Me";
  }
  return isTruncate ? truncate(value) : value;
};

const LinkRender = ({
  isInternal,
  hrefLink,
  textValue,
  isEllipsis,
  maxWidth,
}: {
  isInternal: boolean;
  hrefLink: string;
  textValue: string;
  isEllipsis: boolean;
  maxWidth: ExplorerLinkProps["maxWidth"];
}) => {
  const textElement = (
    <Text
      variant="body2"
      color="primary.main"
      className={isEllipsis ? "ellipsis" : undefined}
      maxW={maxWidth}
      pointerEvents={hrefLink ? "auto" : "none"}
    >
      {textValue}
    </Text>
  );

  return isInternal ? (
    <Link href={hrefLink} passHref onClick={(e) => e.stopPropagation()}>
      {textElement}
    </Link>
  ) : (
    <a
      href={hrefLink}
      target="_blank"
      rel="noopener noreferrer"
      data-peer
      onClick={(e) => e.stopPropagation()}
    >
      {textElement}
    </a>
  );
};

export const ExplorerLink = ({
  value,
  type,
  copyValue,
  canCopyWithHover = false,
  isReadOnly = false,
  textFormat = "truncate",
  maxWidth = "150px",
  ...componentProps
}: ExplorerLinkProps) => {
  const { address, currentChainName } = useWallet();
  const isInternal = type === "code_id" || type === "contract_address";

  const [hrefLink, textValue] = [
    getNavigationUrl(type, currentChainName, copyValue || value),
    getValueText(value === address, textFormat === "truncate", value),
  ];

  const readOnly = isReadOnly || !hrefLink;

  return (
    <Box
      role="group"
      display="inline-flex"
      alignItems="center"
      _hover={{
        ...(!readOnly && {
          textDecoration: "underline",
          textDecorationColor: "primary.main",
        }),
      }}
      {...componentProps}
    >
      {readOnly ? (
        <Text variant="body2">{textValue}</Text>
      ) : (
        <>
          <LinkRender
            isInternal={isInternal}
            hrefLink={hrefLink}
            textValue={textValue}
            isEllipsis={textFormat === "ellipsis"}
            maxWidth={maxWidth}
          />
          <Box
            alignItems="center"
            display={canCopyWithHover ? "none" : undefined}
            _groupHover={canCopyWithHover ? { display: "flex" } : undefined}
          >
            <Copier value={copyValue || value} ml="8px" />
          </Box>
        </>
      )}
    </Box>
  );
};
