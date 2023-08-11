import { Flex, Text } from "@chakra-ui/react";

import { AttachSchemaCard } from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface SchemaPanelProps {
  codeId: number;
  codeHash: string;
  attached: boolean;
  schema: Option<object>;
  openDrawer: () => void;
}

export const SchemaPanel = ({
  codeId,
  codeHash,
  attached,
  schema,
  openDrawer,
}: SchemaPanelProps) => {
  if (!attached)
    return (
      <Flex
        p="24px 16px"
        direction="column"
        alignItems="center"
        bgColor="gray.900"
        borderRadius="8px"
      >
        <Text variant="body1" fontWeight={700}>
          You haven&apos;t attached the JSON Schema for code {codeId} yet
        </Text>
        <Text
          variant="body2"
          textColor="text.disabled"
          fontWeight={500}
          mt={2}
          mb={4}
        >
          Your attached JSON schema will be stored locally on your device
        </Text>
        <AttachSchemaCard
          attached={false}
          codeId={String(codeId)}
          codeHash={codeHash}
          schema={undefined}
          openDrawer={openDrawer}
        />
      </Flex>
    );
  return (
    <JsonReadOnly text={jsonPrettify(JSON.stringify(schema ?? {}))} canCopy />
  );
};
