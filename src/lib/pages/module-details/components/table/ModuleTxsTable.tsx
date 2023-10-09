import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { TransactionCard } from "lib/components/card/TransactionCard";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import type { ModuleTxType } from "lib/services/txService";
import { useModuleTxsByPagination } from "lib/services/txService";
import type { Nullable, Option } from "lib/types";

interface ModuleTxsTableProps {
  moduleId: Option<Nullable<number>>;
  txType: ModuleTxType;
  txCount: Option<number>;
  onViewMore?: () => void;
  scrollComponentId?: string;
  refetchCount: () => void;
}

export const ModuleTxsTable = ({
  moduleId,
  txType,
  txCount,
  onViewMore,
  scrollComponentId,
  refetchCount,
}: ModuleTxsTableProps) => {
  const { currentChainId } = useCelatoneApp();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txCount,
    initialState: {
      pageSize: onViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: moduleTxs,
    isLoading,
    error,
  } = useModuleTxsByPagination({
    moduleId,
    txType,
    pageSize,
    offset,
  });

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  const isMobile = useMobile();

  useEffect(() => {
    if (!onViewMore) setPageSize(10);
    setCurrentPage(1);
  }, [currentChainId, onViewMore, setCurrentPage, setPageSize]);
  // TODO - Might consider adding this state in all transaction table
  if (!moduleId || error)
    return (
      <EmptyState
        withBorder
        imageVariant="not-found"
        message="There is an error during fetching transactions."
      />
    );
  if (isMobile && isLoading)
    return (
      <>
        <Loading />
        {txCount && (
          <Pagination
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
            offset={offset}
            totalData={txCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            scrollComponentId={scrollComponentId}
          />
        )}
      </>
    );
  if (isMobile)
    return (
      <>
        {moduleTxs ? (
          <Flex direction="column" gap={4} w="full" mt={4}>
            {moduleTxs?.map((transaction) => (
              <TransactionCard
                transaction={transaction}
                key={transaction.hash}
                showRelations={false}
              />
            ))}
            {!onViewMore && txCount && txCount > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={txCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                scrollComponentId={scrollComponentId}
              />
            )}
          </Flex>
        ) : (
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions in this network."
          />
        )}
      </>
    );
  return (
    <>
      <TransactionsTable
        transactions={moduleTxs}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            withBorder
            imageVariant="empty"
            message="There are no transactions on this network."
          />
        }
        showAction={false}
        showRelations={false}
      />
      {onViewMore && <ViewMore onClick={onViewMore} />}
      {!onViewMore && txCount && txCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={txCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          scrollComponentId={scrollComponentId}
        />
      )}
    </>
  );
};
