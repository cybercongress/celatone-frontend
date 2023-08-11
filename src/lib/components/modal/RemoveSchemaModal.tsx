import { useToast, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";

import { ActionModal } from "./ActionModal";

interface RemoveSchemaModalProps {
  codeId: string;
  codeHash: string;
  trigger: ReactNode;
}

export function RemoveSchemaModal({
  codeId,
  codeHash,
  trigger,
}: RemoveSchemaModalProps) {
  const { deleteSchema } = useSchemaStore();

  const toast = useToast();
  const handleRemove = () => {
    deleteSchema(codeHash);

    setTimeout(() => {
      toast({
        title: `Removed schema`,
        status: "success",
        duration: 5000,
        isClosable: false,
        position: "bottom-right",
        icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      });
    }, 1000);
  };

  return (
    <ActionModal
      title={`Removed JSON Schema for code '${codeId}'?`}
      icon="delete-solid"
      iconColor="error.light"
      trigger={trigger}
      mainBtnTitle="Yes, Remove list"
      mainVariant="error"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        This action will remove JSON schema for code `{codeId}` and other codes
        with the same following code hash:
      </Text>
      <Text mt={4}>{codeHash}</Text>
    </ActionModal>
  );
}
