import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { Option, Proposal } from "lib/types";

import { ProposalsTableHeader } from "./ProposalsTableHeader";
import { ProposalsTableMobileCard } from "./ProposalsTableMobileCard";
import { ProposalsTableRow } from "./ProposalsTableRow";

interface ProposalsTableProps {
  proposals: Option<Proposal[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const ProposalsTable = ({
  proposals,
  isLoading,
  emptyState,
}: ProposalsTableProps) => {
  const isFullTier = useTierConfig() === "full";
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!proposals?.length) return emptyState;

  const templateColumns = isFullTier
    ? "100px minmax(360px, 2fr) minmax(150px, 1fr) 330px 180px 180px"
    : "100px minmax(360px, 2fr) minmax(150px, 1fr) 330px 180px";
  const boxShadow = "16px 0 32px -10px";

  return isMobile ? (
    <MobileTableContainer>
      {proposals.map((proposal) => (
        <ProposalsTableMobileCard key={proposal.id} proposal={proposal} />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ProposalsTableHeader
        templateColumns={templateColumns}
        boxShadow={boxShadow}
      />
      {proposals.map((proposal) => (
        <ProposalsTableRow
          key={proposal.id}
          proposal={proposal}
          templateColumns={templateColumns}
          boxShadow={boxShadow}
        />
      ))}
    </TableContainer>
  );
};
