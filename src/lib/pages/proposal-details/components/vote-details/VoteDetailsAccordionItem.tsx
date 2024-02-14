import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ProposalStepper } from "../proposal-stepper";
import type { ProposalData } from "lib/types";

export const VoteDetailsAccordionItem = ({
  step,
  proposalData,
  children,
}: {
  step: number;
  proposalData: ProposalData;
  children: ReactNode;
}) => (
  <AccordionItem borderTop="1px solid" borderColor="gray.700">
    <AccordionButton py={3} px={0}>
      <ProposalStepper step={step} proposalData={proposalData} />
      <AccordionIcon color="gray.600" ml="auto" />
    </AccordionButton>
    <AccordionPanel
      bg="transparent"
      py={3}
      px={0}
      borderTop="1px solid"
      borderColor="gray.700"
    >
      {children}
    </AccordionPanel>
  </AccordionItem>
);
