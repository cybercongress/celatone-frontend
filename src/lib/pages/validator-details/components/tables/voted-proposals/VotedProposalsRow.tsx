import { Box, Grid, Text } from "@chakra-ui/react";
import type { DividerProps, GridProps } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { StopPropagationBox } from "lib/components/StopPropagationBox";
import {
  Answer,
  StatusChip,
  TableRow,
  TableRowFreeze,
} from "lib/components/table";
import { ProposalTextCell } from "lib/components/table/proposals/ProposalTextCell";
import type { ValidatorVotedProposalsResponseItem } from "lib/services/validator";
import { ProposalStatus } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

export interface VotedProposalsTableRowProps {
  votedProposal: ValidatorVotedProposalsResponseItem;
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const VotedProposalsTableRow = ({
  votedProposal,
  templateColumns,
  boxShadow,
}: VotedProposalsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (proposalId: number) =>
    navigate({
      pathname: "/proposals/[proposalId]",
      query: { proposalId },
    });

  const isDepositOrVoting =
    votedProposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    votedProposal.status === ProposalStatus.VOTING_PERIOD;

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() => onRowSelect(votedProposal.id)}
      _hover={{
        "> div": {
          bgColor: "gray.900",
        },
      }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
    >
      <TableRowFreeze left="0">
        <ExplorerLink
          type="proposal_id"
          value={votedProposal.id.toString()}
          showCopyOnHover
          ampCopierSection="proposal-list"
        />
      </TableRowFreeze>
      <TableRowFreeze
        left={templateColumns?.toString().split(" ")[0]}
        boxShadow={boxShadow}
        color="gray.800"
      >
        <ProposalTextCell
          title={votedProposal.title}
          types={votedProposal.types}
          isExpedited={votedProposal.isExpedited}
          isDepositOrVoting={isDepositOrVoting}
        />
      </TableRowFreeze>
      <TableRow justifyContent="center">
        <StopPropagationBox>
          <StatusChip status={votedProposal.status} />
        </StopPropagationBox>
      </TableRow>
      <TableRow>
        <Answer
          isVoteWeighted={votedProposal.isVoteWeighted}
          yes={votedProposal.yes}
          no={votedProposal.no}
          noWithVeto={votedProposal.noWithVeto}
          abstain={votedProposal.abstain}
        />
      </TableRow>
      <TableRow>
        {votedProposal.votingEndTime ? (
          <Box>
            <Text variant="body2" color="text.dark">
              {formatUTC(votedProposal.votingEndTime)}
            </Text>
            <Text variant="body3" color="text.disabled">
              {`(${dateFromNow(votedProposal.votingEndTime)})`}
            </Text>
          </Box>
        ) : (
          <Text variant="body2" color="text.dark">
            -
          </Text>
        )}
      </TableRow>
    </Grid>
  );
};
