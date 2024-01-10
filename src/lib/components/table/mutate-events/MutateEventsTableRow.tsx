import { Grid, Box, Text, Badge, Flex } from "@chakra-ui/react";

import { RemarkRender } from "../RemarkRender";
import { TableRow } from "../tableComponents";
import { CustomIcon } from "lib/components/icon";
import type { MutateEvent } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface MutateEventsTableRowProps extends MutateEvent {
  templateColumns: string;
}

export const MutateEventsTableRow = ({
  timestamp,
  templateColumns,
  mutatedFieldName,
  oldValue,
  newValue,
  remark,
}: MutateEventsTableRowProps) => {
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <Badge>{mutatedFieldName}</Badge>
        </TableRow>
        <TableRow>{oldValue}</TableRow>
        <TableRow px={10}>
          <CustomIcon name="arrow-right" color="gray.600" />
        </TableRow>
        <TableRow>{newValue}</TableRow>
        <TableRow>
          <Flex direction="column" gap={1}>
            <Text variant="body3">{formatUTC(timestamp)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(timestamp)})`}
            </Text>
          </Flex>
        </TableRow>
        <TableRow>
          <RemarkRender {...remark} />
        </TableRow>
      </Grid>
    </Box>
  );
};
