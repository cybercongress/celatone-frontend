import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { RecentContractsTable } from "./components/RecentContractsTable";

const RecentContracts = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CONTRACTS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <PageHeader
        title="Contracts"
        subtitle="This page displays all contracts on this network sorted by recency"
        docHref="user/introduction/block-explorer#recent-contracts"
      />
      <RecentContractsTable />
    </PageContainer>
  );
};

export default RecentContracts;
