import type { ValidatorsResponse } from "lib/services/types";
import { big } from "lib/types";
import type { Option, Ratio, ValidatorData } from "lib/types";
import { divWithDefault } from "lib/utils";

import { ValidatorOrder } from "./types";

const getMinCommissionRate = (validators: ValidatorData[]) =>
  validators.reduce(
    (minRate, validator) =>
      minRate < validator.commissionRate ? minRate : validator.commissionRate,
    1 as Ratio<number>
  );

export const compareValidator =
  (order: ValidatorOrder, isDesc: boolean) =>
  (a: ValidatorData, b: ValidatorData) => {
    let isLower = true;
    if (order === ValidatorOrder.Commission)
      isLower = a.commissionRate < b.commissionRate;
    else if (order === ValidatorOrder.Moniker) isLower = a.moniker < b.moniker;
    else
      isLower = a.votingPower.eq(b.votingPower)
        ? a.moniker > b.moniker
        : a.votingPower.lt(b.votingPower);

    return (isLower ? -1 : 1) * (isDesc ? -1 : 1);
  };

export const indexValidatorsLcd = (data: Option<ValidatorData[]>) => {
  if (!data) return undefined;

  const active = data
    .filter((validator) => validator.isActive)
    .sort(compareValidator(ValidatorOrder.VotingPower, true))
    .map((validator, index) => ({
      ...validator,
      rank: index + 1,
    }));
  const inactive = data
    .filter((validator) => !validator.isActive)
    .map((validator) => ({
      ...validator,
      votingPower: big(0),
    }))
    .sort(compareValidator(ValidatorOrder.VotingPower, true));

  const totalVotingPower = active.reduce(
    (prev, validator) => prev.add(validator.votingPower),
    big(0)
  );
  const metadata: Omit<ValidatorsResponse["metadata"], "minCommissionRate"> = {
    totalVotingPower,
    activeCount: active.length,
    inactiveCount: inactive.length,
    percent33Rank: active.reduce(
      (prev, validator) =>
        divWithDefault(prev.accVp, totalVotingPower, 0).gte(0.33)
          ? prev
          : {
              rank: validator.rank,
              accVp: prev.accVp.add(validator.votingPower),
            },
      { rank: 0, accVp: big(0) }
    ).rank,
    percent66Rank: active.reduce(
      (prev, validator) =>
        divWithDefault(prev.accVp, totalVotingPower, 0).gte(0.66)
          ? prev
          : {
              rank: validator.rank,
              accVp: prev.accVp.add(validator.votingPower),
            },
      { rank: 0, accVp: big(0) }
    ).rank,
  };

  return {
    active,
    inactive,
    metadata,
    minActiveCommissionRate: getMinCommissionRate(active),
    minInactiveCommissionRate: getMinCommissionRate(inactive),
  };
};
