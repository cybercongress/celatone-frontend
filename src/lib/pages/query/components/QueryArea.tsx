import { Box, Flex, Heading, TabList, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { MessageInputContent, MessageTabs } from "lib/components/json-schema";
import { UploadSchemaSection } from "lib/components/json-schema/UploadSchemaSection";
import { useSchemaStore } from "lib/providers/store";
import type { ContractAddr } from "lib/types";

import { JsonQuery } from "./JsonQuery";
import { SchemaQuery } from "./SchemaQuery";

interface QueryAreaProps {
  contractAddress: ContractAddr;
  codeId: string;
  codeHash: string;
  initialMsg: string;
}

export const QueryArea = observer(
  ({ contractAddress, codeId, codeHash, initialMsg }: QueryAreaProps) => {
    const [tab, setTab] = useState<MessageTabs>();

    const { getQuerySchema } = useSchemaStore();
    const schema = getQuerySchema(codeHash);

    useEffect(() => {
      if (!schema) setTab(MessageTabs.JSON_INPUT);
      else setTab(MessageTabs.YOUR_SCHEMA);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(schema)]);

    const currentTabIdx = Object.values(MessageTabs).indexOf(
      tab ?? MessageTabs.JSON_INPUT
    );

    return (
      <Box my={4}>
        <Heading variant="h6" as="h6" mr={2} mt={8} mb={4}>
          Query Message
        </Heading>
        <Tabs isLazy lazyBehavior="keepMounted" index={currentTabIdx}>
          <TabList mb={8} borderBottom="1px" borderColor="gray.800">
            <CustomTab onClick={() => setTab(MessageTabs.JSON_INPUT)}>
              JSON Input
            </CustomTab>
            <CustomTab onClick={() => setTab(MessageTabs.YOUR_SCHEMA)}>
              Your Schema
            </CustomTab>
          </TabList>
        </Tabs>
        <MessageInputContent
          currentTab={tab}
          jsonContent={
            <JsonQuery
              contractAddress={contractAddress}
              initialMsg={initialMsg}
            />
          }
          schemaContent={
            codeHash && schema ? (
              <SchemaQuery
                schema={schema}
                contractAddress={contractAddress}
                initialMsg={initialMsg}
              />
            ) : (
              <UploadSchemaSection
                codeId={codeId}
                codeHash={codeHash}
                title={
                  <Flex flexDirection="column" alignItems="center">
                    <Flex>
                      You haven&#39;t attached the JSON Schema for
                      <CustomIcon name="code" mx={1} color="gray.400" />
                      code {codeId} yet
                    </Flex>
                    <Flex>from which this contract is instantiated yet.</Flex>
                  </Flex>
                }
              />
            )
          }
        />
      </Box>
    );
  }
);
