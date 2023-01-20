import {
  Box,
  Flex,
  Grid,
  Icon,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheck, MdClose, MdKeyboardArrowDown } from "react-icons/md";

import { RenderActionsMessages } from "lib/components/action-msg/ActionMessages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MsgDetail } from "lib/components/table/MsgDetail";
import type { PastTransaction } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { FurtherActionButton } from "./FurtherActionButton";

interface PastTxRowProps {
  transaction: PastTransaction;
  templateColumnsStyle: string;
}

export const PastTxRow = ({
  transaction,
  templateColumnsStyle,
}: PastTxRowProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isAccordion, setIsAccordion] = useState(false);

  useEffect(() => {
    if (transaction.messages.length > 1) setIsAccordion(true);
  }, [transaction.messages]);

  return (
    <Box w="full" minW="min-content">
      <Grid
        templateColumns={templateColumnsStyle}
        onClick={isAccordion ? onToggle : undefined}
        _hover={{ background: "divider.main" }}
        cursor={isAccordion ? "pointer" : "default"}
      >
        <TableRow pl="48px">
          <ExplorerLink
            value={transaction.hash.toLocaleUpperCase()}
            type="tx_hash"
            canCopyWithHover
          />
        </TableRow>
        <TableRow>
          <Icon
            as={transaction.success ? MdCheck : MdClose}
            fontSize="24px"
            color={transaction.success ? "success.main" : "error.main"}
          />
        </TableRow>
        <TableRow>
          <Flex gap={1} flexWrap="wrap">
            <RenderActionsMessages transaction={transaction} />
            {transaction.isIbc && (
              <Tag borderRadius="full" bg="rgba(164, 133, 231, 0.6)">
                IBC
              </Tag>
            )}
          </Flex>
        </TableRow>
        <TableRow>
          <Flex direction="row" justify="space-between" align="center" w="full">
            <Flex direction="column" gap={1}>
              <Text variant="body3">{formatUTC(transaction.created)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(transaction.created)})`}
              </Text>
            </Flex>
          </Flex>
        </TableRow>
        <TableRow>
          <FurtherActionButton transaction={transaction} />
        </TableRow>
        <TableRow>
          {isAccordion && (
            <Icon
              as={MdKeyboardArrowDown}
              transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
              boxSize="18px"
            />
          )}
        </TableRow>
      </Grid>
      {isAccordion && (
        <Grid w="full" py={4} hidden={!isOpen}>
          {transaction.messages.map((msg, index) => (
            <MsgDetail
              key={index.toString() + msg.type}
              allowFurtherAction
              message={msg}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};
