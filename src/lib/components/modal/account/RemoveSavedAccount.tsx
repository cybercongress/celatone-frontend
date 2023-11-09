import {
  useToast,
  Text,
  chakra,
  IconButton,
  Highlight,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { ActionModal } from "../ActionModal";
import { CustomIcon } from "lib/components/icon";
import { useAccountStore } from "lib/providers/store";
import type { AccountLocalInfo } from "lib/stores/account";
import { truncate } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface RemoveSavedAccountModalProps {
  accountLocalInfo: AccountLocalInfo;
  trigger?: JSX.Element;
}

export function RemoveSavedAccountModal({
  accountLocalInfo,
  trigger = (
    <StyledIconButton
      icon={<CustomIcon name="delete" />}
      variant="ghost-gray"
    />
  ),
}: RemoveSavedAccountModalProps) {
  const toast = useToast();
  const { removeSavedAccount } = useAccountStore();
  const displayName =
    accountLocalInfo.name ?? truncate(accountLocalInfo.address);

  const handleRemove = useCallback(() => {
    removeSavedAccount(accountLocalInfo.address);

    toast({
      title: `Removed \u2018${displayName}\u2019 from Saved Accounts`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  }, [accountLocalInfo.address, displayName, removeSavedAccount, toast]);

  return (
    <ActionModal
      title={`Remove account \u2018${displayName}\u2019?`}
      icon="delete-solid"
      iconColor="error.light"
      mainVariant="error"
      mainBtnTitle="Yes, Remove It"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
      trigger={trigger}
    >
      <Text>
        <Highlight
          query={[displayName, "Saved Accounts"]}
          styles={{ fontWeight: "bold", color: "inherit" }}
        >
          {`This action will remove \u2018${displayName}\u2019 from Saved Accounts. 
          You can save this address again later, but you will need to add its new account name and description.`}
        </Highlight>
      </Text>
    </ActionModal>
  );
}
