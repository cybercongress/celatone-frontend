import { Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import type { ProposalData } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatUTC } from "lib/utils";

import { Countdown } from "./Countdown";

interface StatusTimeProps {
  proposalData: ProposalData;
}

const getResolvedPrefix = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.DEPOSIT_FAILED:
      return "Failed";
    case ProposalStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Voting ended";
  }
};

export const SummaryStatusTime = ({ proposalData }: StatusTimeProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD)
    return (
      <Text variant="body2" textAlign={{ base: "end", md: "start" }}>
        Deposit ends in{" "}
        <Countdown endTime={proposalData.depositEndTime} isString={false} />
      </Text>
    );

  if (proposalData.status === ProposalStatus.VOTING_PERIOD)
    return (
      <Text variant="body2" textAlign={{ base: "end", md: "start" }}>
        Voting ends in{" "}
        {!isNull(proposalData.votingEndTime) ? (
          <Countdown endTime={proposalData.votingEndTime} isString={false} />
        ) : (
          "N/A"
        )}
      </Text>
    );

  return (
    <Text
      variant="body2"
      color="text.dark"
      textAlign={{ base: "end", md: "start" }}
    >
      {getResolvedPrefix(proposalData.status)}
      {" at "}
      {!isNull(proposalData.resolvedTimestamp)
        ? formatUTC(proposalData.resolvedTimestamp)
        : "N/A"}
    </Text>
  );
};
