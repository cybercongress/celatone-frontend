import type { FieldArrayWithId } from "react-hook-form";

import type { DecodeModuleQueryResponse } from "lib/services/moduleService";
import type { Option } from "lib/types";
import { UpgradePolicy } from "lib/types";

type Status = "error" | "info" | "init";

export interface PublishStatus {
  status: Status;
  text: string;
}

interface Module {
  file: Option<File>;
  base64File: string;
  decodeRes: Option<DecodeModuleQueryResponse>;
  publishStatus: PublishStatus;
}

export interface PublishModuleState {
  modules: Module[];
  upgradePolicy: UpgradePolicy;
}

export type FileField = FieldArrayWithId<PublishModuleState, "modules", "id">;
export type FileArrayFields = FileField[];

export const publishStatusDefault: { status: Status; text: string } = {
  status: "init",
  text: "",
};

export const emptyModule: Module = {
  base64File: "",
  decodeRes: undefined,
  publishStatus: publishStatusDefault,
  file: undefined,
};

export const policies = [
  {
    value: UpgradePolicy.ARBITRARY,
    description: "You can publish these modules again without any restrictions",
    condition: false,
  },
  {
    value: UpgradePolicy.COMPATIBLE,
    description:
      "This address can publish these modules again but need to maintain several properties.",
    condition: true,
  },
  {
    value: UpgradePolicy.IMMUTABLE,
    description: "You cannot publish these modules again with this address",
    condition: false,
  },
];

export const defaultValues: PublishModuleState = {
  modules: [emptyModule],
  upgradePolicy: UpgradePolicy.ARBITRARY,
};
