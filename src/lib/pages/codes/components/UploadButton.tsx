import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

interface UploadButtonProps {
  isAllowed: boolean;
}
export const UploadButton = ({ isAllowed }: UploadButtonProps) => {
  const navigate = useInternalNavigate();

  return (
    <Tooltip
      label="Only allowed address can upload Wasm file without opening proposal"
      isDisabled={isAllowed}
    >
      <Button
        disabled={!isAllowed}
        onClick={() => navigate({ pathname: "/upload" })}
        rightIcon={
          <CustomIcon
            name="upload"
            color={!isAllowed ? "pebble.600" : "text.main"}
            boxSize="12px"
          />
        }
      >
        Upload New Code
      </Button>
    </Tooltip>
  );
};
