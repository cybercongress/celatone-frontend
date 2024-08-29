import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import plur from "plur";

import { AmpEvent, track } from "lib/amplitude";
import { useInitiaL1, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CelatoneSeo } from "lib/components/Seo";
import { TxReceiptRender } from "lib/components/tx";
import { feeFromStr } from "lib/utils";

import type { PublishCompleteState } from ".";
import { ModulePublishCard } from "./components/ModulePublishCard";

interface PublishCompletedProps {
  publishTxInfo: PublishCompleteState;
  resetState: () => void;
}

export const PublishCompleted = ({
  publishTxInfo: { txHash, txFee, upgradePolicy, modules },
  resetState,
}: PublishCompletedProps) => {
  const navigate = useInternalNavigate();
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });
  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Publish / Republish Modules" />
      <CustomIcon boxSize={8} color="success.main" name="check-circle-solid" />
      <Heading as="h4" variant="h4" mt={4} mb={2}>
        {modules.length} {plur("module", modules.length)} published!
      </Heading>
      <Text variant="body2" color="text.dark">
        Your .mv files are uploaded and published as modules.
      </Text>
      <TxReceiptRender
        receipts={[
          {
            title: "Tx Hash",
            html: <ExplorerLink type="tx_hash" value={txHash} />,
          },
          {
            title: "Tx Fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
          {
            title: "Upgrade Policy",
            value: capitalize(upgradePolicy),
          },
        ]}
        variant="full"
        my={12}
      />
      {isInitiaL1 && (
        <Flex direction="column" gap={4} w="full" mb={12}>
          <Heading as="h6" variant="h6">
            Module Verification
          </Heading>
          <Flex
            w="full"
            justifyContent="space-between"
            gap={6}
            alignItems="center"
          >
            <Text variant="body2" color="text.dark">
              Verifying modules enhances credibility by displaying a verified
              badge. Once verified, users will be able to access the
              module&apos;s source code on the details page.
            </Text>
            <Button
              variant="primary"
              minW={40}
              onClick={() =>
                navigate({
                  pathname: "/modules/verify",
                })
              }
            >
              Submit Verification
            </Button>
          </Flex>
        </Flex>
      )}
      <Flex direction="column" gap={6} w="full">
        <Heading as="h6" variant="h6">
          Published {modules.length} {plur("module", modules.length)}
        </Heading>
        {modules.map((module, idx) => (
          <ModulePublishCard
            key={`${module.base64EncodedFile}-${idx.toString()}`}
            module={module}
          />
        ))}
      </Flex>
      <Button
        variant="outline-primary"
        mt={6}
        rightIcon={<CustomIcon name="chevron-right" boxSize={3} />}
        w="full"
        onClick={() => {
          track(AmpEvent.USE_PUBLISH_MORE_MODULE_BUTTON);
          resetState();
        }}
      >
        Publish more modules
      </Button>
    </ActionPageContainer>
  );
};
