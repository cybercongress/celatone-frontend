import { Box, Flex } from "@chakra-ui/react";
import type { Event } from "@cosmjs/stargate";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { useGetAddressType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { TxReceiptRender } from "lib/components/tx";
import type { TxReceipt } from "lib/types";
import { jsonPrettify, jsonValidate } from "lib/utils";

interface EventBoxProps {
  event: Event;
  msgIndex: number;
}

export const EventBox = ({ event, msgIndex }: EventBoxProps) => {
  const getAddressType = useGetAddressType();
  const [expand, setExpand] = useState(true);
  const [boxHeight, setBoxHeight] = useState<number>(0);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stackRef.current) {
      setBoxHeight(stackRef.current.clientHeight);
    }
  }, [stackRef]);

  const receipts = event.attributes.map<TxReceipt>(({ key, value }) => {
    const addrType = getAddressType(value);
    let valueComponent: ReactNode;

    switch (true) {
      case addrType !== "invalid_address":
        valueComponent = (
          <ExplorerLink
            type={addrType}
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
          />
        );
        break;
      case key === "code_id":
      case key === "proposal_id":
        valueComponent = (
          <ExplorerLink
            type={key as LinkType}
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
          />
        );
        break;
      case key === "_contract_address":
        valueComponent = (
          <ExplorerLink
            type="contract_address"
            value={value}
            showCopyOnHover
            textFormat="normal"
            maxWidth="full"
          />
        );
        break;
      case jsonValidate(value) === null:
        if (typeof JSON.parse(value) === "object")
          valueComponent = (
            <JsonReadOnly
              text={jsonPrettify(value)}
              canCopy
              fullWidth
              isExpandable
            />
          );
        else valueComponent = value;
        break;
      default:
        valueComponent = value;
        break;
    }

    return {
      title: key,
      ...(typeof valueComponent === "string"
        ? { value }
        : // Value is included to avoid receipt row key duplicate
          { html: valueComponent, value }),
    };
  });

  return (
    <Flex
      position="relative"
      direction="column"
      borderRadius="8px"
      transition="all .25s ease-in-out"
      backgroundColor="pebble.900"
      _hover={{ backgroundColor: "pebble.800" }}
    >
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setExpand((prev) => !prev)}
        p={4}
      >
        <Flex fontSize="14px" gap={2} fontWeight={500} align="center">
          <CustomIcon
            name="contract-list"
            boxSize={4}
            color="pebble.600"
            m={0}
          />
          {`[${msgIndex}] ${event.type}`}
        </Flex>
        <CustomIcon
          name="chevron-down"
          color="pebble.600"
          boxSize={4}
          transform={expand ? "rotate(180deg)" : "rotate(0)"}
          transition="all .25s ease-in-out"
          m={0}
        />
      </Flex>
      <Box
        overflow="hidden"
        h={expand ? boxHeight : 0}
        transition="all .25s ease-in-out"
      >
        <Flex direction="column" p={4} pt={0} ref={stackRef}>
          <Box mb={4} h="1px" bgColor="pebble.700" />
          <TxReceiptRender
            keyPrefix={msgIndex.toString() + event.type}
            variant="tx-page"
            receipts={receipts}
            gap={3}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
