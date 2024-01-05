import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useCollectionMutateEventsPagination } from "lib/services/collectionService";
import type { HexAddr } from "lib/types";

import { MutateEventsTable } from "./MutateEventsTable";

const MutateEvents = ({
  collectionAddress,
  totalCount,
}: {
  collectionAddress: HexAddr;
  totalCount: number;
}) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const { data: mutateEvents, isLoading } = useCollectionMutateEventsPagination(
    collectionAddress,
    pageSize,
    offset
  );

  return (
    <>
      <MutateEventsTable
        mutateEvents={mutateEvents}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message="Mutate events are not found."
            imageVariant="empty"
            withBorder
          />
        }
      />
      {totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};

export default MutateEvents;
