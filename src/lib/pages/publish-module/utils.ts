import type { DecodeModuleQueryResponse } from "lib/services/moduleService";
import type { Option } from "lib/types";
import { UpgradePolicy } from "lib/types";
import { truncate } from "lib/utils";

import type { FileArrayFields, PublishStatus } from "./formConstants";

const priority = Object.keys(UpgradePolicy);

const resolvePolicyPriority = (
  selected: UpgradePolicy,
  current: UpgradePolicy
) => priority.indexOf(selected) >= priority.indexOf(current);

export const statusResolver = ({
  data,
  fields,
  index,
  policy,
}: {
  data: Option<DecodeModuleQueryResponse>;
  fields: FileArrayFields;
  index: number;
  policy: UpgradePolicy;
}): PublishStatus => {
  if (!data) return { status: "init", text: "" };

  const { abi, validPublisher, currentPolicy, modulePath } = data;
  const priorUpload = fields
    .slice(0, index)
    .findLast((field) => field.decodeRes?.modulePath === modulePath);

  const policyUpdateText = `Its upgrade policy will be updated from ${currentPolicy} to ${policy}`;

  if (!validPublisher)
    return {
      status: "error",
      text: `This .mv file can be published by ${truncate(abi.address)} only.`,
    };
  if (currentPolicy) {
    if (currentPolicy === UpgradePolicy.IMMUTABLE)
      return {
        status: "error",
        text: `“${abi.name}” is published with “Immutable” policy, which cannot be republished.`,
      };
    if (currentPolicy === policy)
      return {
        status: "info",
        text: `The file will be uploaded to republish module “${abi.name}” in your address.`,
      };
    return resolvePolicyPriority(policy, currentPolicy)
      ? {
          status: "info",
          text: `The file will be uploaded to republish module “${
            abi.name
          }” in your address. ${
            currentPolicy === policy ? "" : policyUpdateText
          }`,
        }
      : {
          status: "error",
          text: `“${abi.name}” is published with “${currentPolicy}” policy, which cannot be republished to “${policy}”`,
        };
  }
  if (priorUpload)
    return {
      status: "info",
      text: `The file will be uploaded to republish module “${abi.name}” in your address.`,
    };
  return { status: "init", text: "" };
};
