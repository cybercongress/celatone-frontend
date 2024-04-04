import { Grid, Text } from "@chakra-ui/react";
import type { DividerProps, GridProps } from "@chakra-ui/react";

import { TableHeader, TableHeaderFreeze } from "lib/components/table";

interface VotedProposalsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const VotedProposalsTableHeader = ({
  templateColumns,
  boxShadow,
}: VotedProposalsTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
    <TableHeaderFreeze
      left={templateColumns?.toString().split(" ")[0]}
      boxShadow={boxShadow}
      color="gray.800"
    >
      <Text color="text.main" px={4}>
        Proposal Title/Type
      </Text>
    </TableHeaderFreeze>
    <TableHeader textAlign="center">Proposal Status</TableHeader>
    <TableHeader>Vote Answer</TableHeader>
    <TableHeader>Voted On</TableHeader>
  </Grid>
);
