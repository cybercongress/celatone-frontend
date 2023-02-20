import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { CodeNameCell } from "lib/components/CodeNameCell";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { useGetAddressType } from "lib/hooks";
import type { ContractMigrationHistory } from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface MigrationRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ContractMigrationHistory;
}

const RemarkRender = ({
  remark,
}: {
  remark: ContractMigrationHistory["remark"];
}) => {
  const { operation, type, value } = remark;
  const isGovernance = type === "governance";
  if (
    operation === RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS
  )
    return <Text variant="body2">Genesis</Text>;

  const prefix =
    operation === RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT
      ? "Instantiate"
      : "Migrate";

  const textFormat = isGovernance ? "normal" : "truncate";
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
          mb: "2px",
        },
      }}
    >
      <p>{isGovernance ? `${prefix} Proposal ID` : `${prefix} Tx`}</p>
      <ExplorerLink
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value.toString()}
        canCopyWithHover
        textFormat={textFormat}
      />
    </Flex>
  );
};

export const MigrationRow = ({
  templateColumns,
  history,
}: MigrationRowProps) => {
  const getAddressType = useGetAddressType();
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={history.codeId.toString()}
          canCopyWithHover
        />
      </TableRow>
      <TableRow>
        <CodeNameCell
          code={{
            id: history.codeId,
            uploader: history.uploader,
            name: history.codeName,
          }}
        />
      </TableRow>
      <TableRow>
        <ExplorerLink
          type={getAddressType(history.sender)}
          value={history.sender}
          textFormat="truncate"
          canCopyWithHover
        />
      </TableRow>
      <TableRow>
        <ExplorerLink
          type="block_height"
          value={history.height.toString()}
          canCopyWithHover
        />
      </TableRow>
      <TableRow>
        <Flex
          direction="column"
          fontSize="12px"
          sx={{ "& p + p": { color: "text.dark", mt: "2px" } }}
        >
          <p>{formatUTC(history.timestamp)}</p>
          <p>({dateFromNow(history.timestamp)})</p>
        </Flex>
      </TableRow>
      <TableRow>
        <RemarkRender remark={history.remark} />
      </TableRow>
    </Grid>
  );
};
