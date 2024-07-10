import {
  Badge,
  Button,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useInternalNavigate,
  useMobile,
  useTierConfig,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import {
  useCollectionActivitiesCount,
  useCollectionByCollectionAddress,
  useCollectionMutateEventsCount,
  useNfts,
} from "lib/services/nft";
import { isHexModuleAddress } from "lib/utils";

import { CollectionInfoSection } from "./components/CollectionInfoSection";
import { CollectionSupplies } from "./components/CollectionSupplies";
import { CollectionSuppliesOverview } from "./components/CollectionSuppliesOverview";
import { CollectionSupplyInfo } from "./components/CollectionSupplyInfo";
import { Activities } from "./components/tables";
import { CollectionMutateEvents } from "./components/tables/CollectionMutateEvents";
import { useCollectionInfos } from "./data";
import type { CollectionDetailQueryParams } from "./types";
import { TabIndex, zCollectionDetailQueryParams } from "./types";

const InvalidCollection = () => (
  <InvalidState title="Collection does not exist" />
);

const tabHeaderId = "collectionDetailTab";

const CollectionDetailsBody = ({
  collectionAddress,
  tab,
}: CollectionDetailQueryParams) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);
  const { data: nfts, isLoading: isNftLoading } = useNfts(
    collectionAddress,
    6,
    0
  );

  const { collectionInfos, isLoading: isCollectionInfosLoading } =
    useCollectionInfos(collectionAddress);
  const { data: activitiesCount } =
    useCollectionActivitiesCount(collectionAddress);
  const { data: mutateEventsCount } =
    useCollectionMutateEventsCount(collectionAddress);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/nft-collections/[collectionAddress]/[tab]",
        query: {
          collectionAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [collectionAddress, navigate, tab]
  );

  if (isCollectionLoading || isCollectionInfosLoading)
    return <Loading withBorder />;
  if (!collection || !collectionInfos)
    return <ErrorFetching dataName="collection information" />;
  if (!collection.data) return <InvalidCollection />;

  const { name, description, uri } = collection.data;
  const {
    supplies: { maxSupply, totalMinted, currentSupply },
    isUnlimited,
    royalty,
  } = collectionInfos;
  const totalBurned = totalMinted - currentSupply;

  const displayCollectionName =
    name.length > 20 ? `${name.slice(0, 20)}...` : name;

  const getCollectionName = () => {
    if (!name.length) return "Untitled Collection";
    return isMobile ? displayCollectionName : name;
  };

  return (
    <>
      <CelatoneSeo
        pageName={
          name.length > 0
            ? `Collection – ${name.length > 20 ? displayCollectionName : name}`
            : "NFT Collection Detail"
        }
      />
      <Breadcrumb
        items={[
          { text: "NFT Collections", href: "/nft-collections" },
          {
            text: getCollectionName(),
          },
        ]}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "start", md: "center" }}
        w="full"
      >
        <Flex
          direction="column"
          my={6}
          gap={1}
          overflow="hidden"
          minW={{ md: "680px" }}
          maxW="full"
        >
          <Heading
            as="h5"
            variant="h5"
            mb={1}
            className="ellipsis"
            color={name.length ? "text.main" : "text.disabled"}
            fontWeight={name.length ? "600" : "300"}
          >
            {name.length ? name : "Untitled Collection"}
          </Heading>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "start", md: "center" }}
          >
            <Text color="text.dark" variant="body2">
              Collection Address:
            </Text>
            <Tooltip label="View as Account Address">
              <ExplorerLink
                value={collectionAddress}
                type="contract_address"
                textFormat="normal"
                maxWidth="full"
                fixedHeight={false}
                ampCopierSection="collection-addresss-top"
              />
            </Tooltip>
          </Flex>
          <Flex gap={1} align="center">
            <Text color="text.dark" variant="body2">
              Type:
            </Text>
            <Badge textTransform="capitalize">
              {isUnlimited ? "Unlimited Supply" : "Fixed Supply"}
            </Badge>
          </Flex>
        </Flex>
        <Button
          variant="outline-primary"
          minW="140px !important"
          w={{ base: "full", md: "auto" }}
          size={{ base: "sm", md: "md" }}
          mb={{ base: 4, md: 0 }}
          onClick={() => {
            track(AmpEvent.USE_NFT_VIEW_RESOURCE_CTA, {
              amptrackSection: "nft-collection-details",
            });
            navigate({
              pathname: "/accounts/[accountAddress]/[tab]",
              query: {
                accountAddress: collectionAddress,
                tab: "resources",
              },
            });
          }}
        >
          View Resource
        </Button>
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
          id={tabHeaderId}
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            count={currentSupply}
            onClick={handleTabChange(TabIndex.Supplies)}
            isDisabled={!currentSupply}
          >
            Supplies
          </CustomTab>
          <CustomTab
            count={activitiesCount}
            onClick={handleTabChange(TabIndex.Activities)}
            isDisabled={activitiesCount === 0}
          >
            Activities
          </CustomTab>
          <CustomTab
            count={mutateEventsCount}
            onClick={handleTabChange(TabIndex.MutateEvents)}
            isDisabled={mutateEventsCount === 0}
          >
            Mutate Events
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex direction="column" gap={10}>
              <CollectionSupplyInfo
                totalBurned={totalBurned}
                totalMinted={totalMinted}
                currentSupply={currentSupply}
                maxSupply={maxSupply}
              />
              <CollectionSuppliesOverview
                totalCount={currentSupply}
                nfts={nfts}
                isLoading={isNftLoading}
                onViewMore={handleTabChange(TabIndex.Supplies)}
              />
              <CollectionInfoSection
                collectionAddress={collectionAddress}
                collectionName={name}
                desc={description}
                uri={uri}
                activities={activitiesCount}
                mutateEventes={mutateEventsCount}
                royalty={royalty}
                onClickActivities={handleTabChange(TabIndex.Activities)}
                onClickMutateEvents={handleTabChange(TabIndex.MutateEvents)}
              />
            </Flex>
            <UserDocsLink
              title="What does an NFT Collection consist of?"
              cta="Read more about NFT Collection"
              href="move/nfts/collection-detail"
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <CollectionSupplies
              collectionAddress={collectionAddress}
              totalSupply={currentSupply}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Activities
              collectionAddress={collectionAddress}
              totalCount={activitiesCount ?? 0}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <CollectionMutateEvents
              collectionAddress={collectionAddress}
              totalCount={mutateEventsCount ?? 0}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const CollectionDetails = () => {
  useTierConfig({ minTier: "full" });
  const router = useRouter();
  const validated = zCollectionDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_NFT_COLLECTION_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (
    !validated.success ||
    !isHexModuleAddress(validated.data.collectionAddress)
  )
    return <InvalidCollection />;

  return (
    <PageContainer>
      <CollectionDetailsBody {...validated.data} />
    </PageContainer>
  );
};

export default CollectionDetails;
