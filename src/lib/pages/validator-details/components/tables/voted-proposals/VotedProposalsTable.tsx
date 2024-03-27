import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TableContainer, TableTitle, ViewMore } from "lib/components/table";
import { useValidatorVotedProposals } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

import { VotedProposalsTableRow } from "./VotedProposalsRow";
import { VotedProposalsTableHeader } from "./VotedProposalsTableHeader";

interface VotedProposalsTableProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

export const VotedProposalsTable = ({
  validatorAddress,
  onViewMore,
}: VotedProposalsTableProps) => {
  const isMobile = useMobile();

  const { setTotalData, pageSize, offset } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading, error } = useValidatorVotedProposals(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorFetching dataName="voted proposals" />;

  const templateColumns =
    "100px minmax(360px, 2fr) 150px 150px minmax(330px, 1fr)";
  const boxShadow = "16px 0 32px -10px";

  return (
    <>
      <TableTitle title="Voted Proposals" count={data?.total ?? 0} />
      {data?.total ? (
        <>
          {isMobile ? (
            <div>Mobile</div>
          ) : (
            <TableContainer>
              <VotedProposalsTableHeader
                templateColumns={templateColumns}
                boxShadow={boxShadow}
              />
              {data.items.map((votedProposal) => (
                <VotedProposalsTableRow
                  key={votedProposal.id}
                  votedProposal={votedProposal}
                  templateColumns={templateColumns}
                  boxShadow={boxShadow}
                />
              ))}
            </TableContainer>
          )}
          {onViewMore && data.total > 5 && (
            <ViewMore
              onClick={onViewMore}
              text={`View all proposed blocks (${data.total})`}
            />
          )}
        </>
      ) : (
        <EmptyState
          imageVariant={onViewMore ? undefined : "empty"}
          message="This validator had no eligibility to cast votes on any proposals."
          withBorder
        />
      )}
    </>
  );
};
