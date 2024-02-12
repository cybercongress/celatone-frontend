/* eslint-disable sonarjs/cognitive-complexity */
import { SkeletonText, Text } from "@chakra-ui/react";
import big from "big.js";

import type { ProposalOverviewProps } from "..";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import {
  extractParams,
  formatPrettyPercent,
  mapDeposit,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import type { Token, TokenWithValue, U } from "lib/types";
import { ProposalStatus } from "lib/types";
import { divWithDefault, formatTokenWithValueList } from "lib/utils";

const Passed = () => (
  <span
    style={{
      color: "var(--chakra-colors-success-main)",
      fontWeight: 700,
    }}
  >
    passed
  </span>
);

const Rejected = () => (
  <span
    style={{
      color: "var(--chakra-colors-error-main)",
      fontWeight: 700,
    }}
  >
    rejected
  </span>
);

export const SummaryStatusBody = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return (
      <Text variant="body2">
        The proposal has not received the necessary deposits to advance to the
        voting period.
      </Text>
    );

  if (proposalData.status === ProposalStatus.CANCELLED)
    return (
      <Text variant="body2">
        The proposal was cancelled by the proposer before the governance process
        is complete.
      </Text>
    );

  if (isLoading)
    return <SkeletonText mt={1} noOfLines={3} spacing={4} skeletonHeight={2} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  const { minDeposit, quorum, threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );
  const { yes, noWithVeto, nonAbstainVotes, totalVotes } =
    normalizeVotesInfo(votesInfo);
  const yesRatio = divWithDefault(yes, nonAbstainVotes, 0);
  const noWithVetoRatio = divWithDefault(noWithVeto, totalVotes, 0);

  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD) {
    const required = mapDeposit(proposalData.totalDeposit, minDeposit).reduce<
      TokenWithValue[]
    >((prev, pair) => {
      if (pair.current.amount.lt(pair.min.amount))
        prev.push({
          ...pair.min,
          amount: pair.min.amount.sub(pair.current.amount) as U<Token<Big>>,
        });
      return prev;
    }, []);

    return (
      <Text variant="body2">
        The proposal is currently in the deposit period and requires an
        additional deposit of {formatTokenWithValueList(required)} to advance to
        the voting period. Failure to make the required deposit will result in
        the rejection of the proposal.
      </Text>
    );
  }

  if (proposalData.status === ProposalStatus.VOTING_PERIOD) {
    if (totalVotes.lt(quorum))
      return (
        <Text variant="body2">
          As of now, the proposal has not yet reached the required quorum. If
          the voting period concludes without attaining the quorum, the proposal
          will be <Rejected />.
        </Text>
      );

    if (noWithVetoRatio.gte(vetoThreshold))
      return (
        <Text variant="body2">
          The proposal has{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            successfully met
          </span>{" "}
          the voting quorum. However, the &ldquo;No with veto&rdquo; vote
          proportion currently constitutes{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(noWithVetoRatio.toNumber())}
          </span>{" "}
          of the total votes, including &ldquo;Abstain&rdquo;, which exceeds the{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(vetoThreshold)} threshold
          </span>
          . If the proposal concludes with this voting outcome, it will be
          rejected regardless of &ldquo;Yes&rdquo; votes.
        </Text>
      );

    if (yesRatio.lt(threshold))
      return (
        <Text variant="body2">
          The proposal has{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            successfully met
          </span>{" "}
          the voting quorum. However, if the current voting tally remains
          unchanged when the voting period ends, the proposal will be{" "}
          <Rejected />.
        </Text>
      );

    return (
      <Text variant="body2">
        The proposal has successfully met the voting quorum. If the current
        voting tally remains unchanged when the voting period ends, the proposal
        will be <Passed />, and its content will be promptly implemented.
      </Text>
    );
  }

  if (proposalData.status === ProposalStatus.FAILED)
    return (
      <Text variant="body2">
        Although the proposal successfully reached the voting quorum with a{" "}
        {yesRatio.mul(100).round(2, big.roundHalfUp).toNumber()}%{" "}
        &ldquo;Yes&rdquo; rate, it was not implemented due to technical reasons.
      </Text>
    );

  if (proposalData.status === ProposalStatus.REJECTED) {
    if (totalVotes.lt(quorum))
      return (
        <Text variant="body2">
          This proposal did not meet the required quorum, resulting in its
          rejection regardless of the voting outcomes.
        </Text>
      );

    if (noWithVetoRatio.gte(vetoThreshold))
      return (
        <Text variant="body2">
          Due to the &ldquo;No with veto&rdquo; vote proportion constitutes{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(noWithVetoRatio.toNumber())}{" "}
          </span>
          of the total votes including &ldquo;Abstain&rdquo;, which exceeds the{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(vetoThreshold)} threshold
          </span>
          , the proposal is <Rejected /> regardless of &ldquo;Yes&rdquo; votes.
        </Text>
      );

    return (
      <Text variant="body2">
        The proposal has reached the voting quorum but fell short of reaching
        the &ldquo;Yes&rdquo; votes threshold, resulting in its rejection.
      </Text>
    );
  }

  return (
    <Text variant="body2">
      The proposal has successfully met the voting quorum with a{" "}
      <span
        style={{
          fontWeight: 700,
        }}
      >
        {yes.mul(100).round(2, big.roundHalfUp).toNumber()}% of
        &ldquo;Yes&rdquo;
      </span>{" "}
      rate. As a result, the proposal has been passed, and its content will now
      be implemented.
    </Text>
  );
};
