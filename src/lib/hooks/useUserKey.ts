import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import { DEFAULT_ADDRESS } from "lib/data";
import { formatUserKey } from "lib/utils";

export const useUserKey = () => {
  const { currentChainName } = useWallet();
  return useMemo(() => {
    return formatUserKey(currentChainName, DEFAULT_ADDRESS);
  }, [currentChainName]);
};
