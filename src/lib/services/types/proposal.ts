import { capitalize } from "lodash";
import { z } from "zod";

import {
  zBechAddr,
  zBig,
  zCoin,
  zMessageResponse,
  zProposalStatus,
  zProposalType,
  zRatio,
  zUtcDate,
  zValidator,
} from "lib/types";
import type {
  Coin,
  Proposal,
  ProposalData,
  ProposalParams,
  ProposalStatus,
  ProposalValidatorVote,
  ProposalVote,
  ProposalVotesInfo,
  Token,
  U,
} from "lib/types";
import { zPagination } from "lib/types/rest";
import { parseTxHash, snakeToCamel } from "lib/utils";

import type { UploadAccessParams } from "./wasm";

export interface MinDeposit {
  amount: U<Token<Big>>;
  denom: string;
  formattedAmount: Token;
  formattedDenom: string;
  formattedToken: string;
  precision: number;
}

export const zDepositParamsLcd = z
  .object({
    min_deposit: zCoin.array(),
    max_deposit_period: z.string(),
    min_expedited_deposit: zCoin.array(),
    min_initial_deposit_ratio: z.string(),
  })
  .transform(snakeToCamel);
type DepositParamsLcd = z.infer<typeof zDepositParamsLcd>;

export interface DepositParams extends Omit<DepositParamsLcd, "minDeposit"> {
  minDeposit: MinDeposit;
  minInitialDeposit: Token;
}

export const zVotingParamsLcd = z
  .object({
    voting_period: z.string(),
    proposal_voting_periods: z
      .object({
        proposal_type: z.string(),
        voting_period: z.string(),
      })
      .array(),
    expedited_voting_period: z.string(),
  })
  .transform(snakeToCamel);
type VotingParamsLcd = z.infer<typeof zVotingParamsLcd>;

export interface GovParams {
  depositParams: DepositParams;
  uploadAccess: UploadAccessParams;
  votingParams: VotingParamsLcd;
}

export const zProposalParamsResponse = z
  .object({
    min_deposit: zCoin.array(),
    min_initial_deposit_ratio: z.coerce.number(),
    max_deposit_period: z.string(),
    voting_period: z.string(),
    veto_threshold: zRatio(z.coerce.number()),
    quorum: zRatio(z.coerce.number()),
    threshold: zRatio(z.coerce.number()),
    // expedited
    expedited_voting_period: z.string().optional(),
    expedited_threshold: zRatio(z.coerce.number()).optional(),
    expedited_min_deposit: zCoin.array().optional(),
    expedited_quorum: zRatio(z.coerce.number()).optional(), // only in sei
    // emergency - only in initia
    emergency_min_deposit: zCoin.array().optional(),
    emergency_tally_interval: z.string().optional(),
  })
  .transform<ProposalParams<Coin>>(snakeToCamel);

export const zProposal = z.object({
  deposit_end_time: zUtcDate,
  id: z.number().nonnegative(),
  is_expedited: z.boolean(),
  proposer: zBechAddr,
  resolved_height: z.number().nullable(),
  status: zProposalStatus,
  title: z.string(),
  types: zProposalType.array(),
  voting_end_time: zUtcDate.nullable(),
});

export const zProposalsResponseItem =
  zProposal.transform<Proposal>(snakeToCamel);

export const zProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ProposalsResponse = z.infer<typeof zProposalsResponse>;

export const zRelatedProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
});
export type RelatedProposalsResponse = z.infer<
  typeof zRelatedProposalsResponse
>;

export const zProposalDataResponse = z.object({
  info: zProposal
    .extend({
      failed_reason: z.string(),
      created_height: z.number().nullable(),
      created_timestamp: zUtcDate.nullable(),
      created_tx_hash: z.string().nullable(),
      description: z.string(),
      messages: z.array(zMessageResponse).nullable(),
      metadata: z.string(),
      proposal_deposits: z
        .object({
          amount: zCoin.array(),
          depositor: zBechAddr,
          timestamp: zUtcDate,
          tx_hash: z.string(),
        })
        .array(),
      resolved_timestamp: zUtcDate.nullable(),
      submit_time: zUtcDate,
      total_deposit: zCoin.array().nullable(),
      version: z.string(),
      voting_time: zUtcDate.nullable(),
    })
    .transform<ProposalData<Coin>>(
      ({ created_tx_hash, proposal_deposits, messages, ...val }) => ({
        ...snakeToCamel(val),
        createdTxHash: created_tx_hash ? parseTxHash(created_tx_hash) : null,
        proposalDeposits: proposal_deposits.map((deposit) => ({
          amount: deposit.amount,
          depositor: deposit.depositor,
          timestamp: deposit.timestamp,
          txHash: parseTxHash(deposit.tx_hash),
        })),
        messages,
      })
    )
    .nullable(),
});
export type ProposalDataResponse = z.infer<typeof zProposalDataResponse>;

export const zProposalVotesInfoResponse = z
  .object({
    yes: zBig,
    abstain: zBig,
    no: zBig,
    no_with_veto: zBig,
    total_voting_power: zBig.nullable(),
  })
  .transform<ProposalVotesInfo>(snakeToCamel);

const zProposalVotesResponseItem = z
  .object({
    proposal_id: z.number().nonnegative(),
    abstain: z.number().nonnegative(),
    no: z.number().nonnegative(),
    no_with_veto: z.number().nonnegative(),
    yes: z.number().nonnegative(),
    is_vote_weighted: z.boolean(),
    validator: zValidator.nullable(),
    voter: zBechAddr.nullable(),
    timestamp: zUtcDate.nullable(),
    tx_hash: z.string().nullable(),
  })
  .transform<ProposalVote>((val) => ({
    ...snakeToCamel(val),
    txHash: val.tx_hash ? parseTxHash(val.tx_hash) : null,
  }));

export const zProposalVotesResponse = z.object({
  items: z.array(zProposalVotesResponseItem),
  total: z.number().nonnegative(),
});
export type ProposalVotesResponse = z.infer<typeof zProposalVotesResponse>;

export interface ProposalValidatorVotesResponse {
  items: ProposalValidatorVote[];
  total: number;
}

const zProposalAnswerCounts = z.object({
  yes: z.number().nonnegative(),
  abstain: z.number().nonnegative(),
  no: z.number().nonnegative(),
  no_with_veto: z.number().nonnegative(),
  total: z.number().nonnegative(),
  weighted: z.number().nonnegative(),
});

export const zProposalAnswerCountsResponse = z
  .object({
    all: zProposalAnswerCounts,
    validator: zProposalAnswerCounts.extend({
      did_not_vote: z.number().nonnegative(),
      total_validators: z.number().nonnegative(),
    }),
  })
  .transform(snakeToCamel);
export type ProposalAnswerCountsResponse = z.infer<
  typeof zProposalAnswerCountsResponse
>;

export const zProposalsResponseItemLcd = z
  .object({
    id: z.coerce.number(),
    messages: z.array(zMessageResponse).nullable(),
    status: z.string(),
    final_tally_result: z.object({
      yes_count: z.string(),
      no_count: z.string(),
      abstain_count: z.string(),
      no_with_veto_count: z.string(),
    }),
    submit_time: zUtcDate,
    deposit_end_time: zUtcDate,
    total_deposit: zCoin.array(),
    voting_start_time: zUtcDate,
    voting_end_time: zUtcDate,
    metadata: z.string(),
    title: z.string(),
    summary: z.string(),
    proposer: zBechAddr,
    expedited: z.boolean().optional().default(false),
  })
  .transform<Proposal>((val) => ({
    ...snakeToCamel(val),
    status: val.status
      .replace("PROPOSAL_STATUS_", "")
      .split("_")
      .map((term: string) => capitalize(term.toLowerCase()))
      .join("") as ProposalStatus,
    resolvedHeight: null,
    types: val.messages?.map((msg) => msg["@type"]) ?? [],
    isExpedited: val.expedited,
  }));
export type ProposalsResponseItemLcd = z.infer<
  typeof zProposalsResponseItemLcd
>;

export const zProposalsResponseLcd = z.object({
  proposals: z.array(zProposalsResponseItemLcd),
  pagination: zPagination,
});
export type ProposalsResponseLcd = z.infer<typeof zProposalsResponseLcd>;
