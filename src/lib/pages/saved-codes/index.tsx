import { Heading, Flex, Badge, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { FilterByPermission } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { SavedCodeZeroState } from "lib/components/state";
import type { PermissionFilterValue } from "lib/hooks";
import { useMyCodesData } from "lib/model/code";

import { MySavedCodesSection } from "./components/MySavedCodesSection";
import { SaveCodeButton } from "./components/SaveCodeButton";

interface CodeFilterState {
  keyword: string;
  permissionValue: PermissionFilterValue;
}

const SavedCodes = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });
  // TODO refactor to useState
  const { watch, setValue } = useForm<CodeFilterState>({
    defaultValues: {
      permissionValue: "all",
      keyword: "",
    },
  });
  const { keyword, permissionValue } = watch();

  const {
    savedCodesCount,
    savedCodes: saved,
    isSavedCodesLoading,
  } = useMyCodesData(keyword, permissionValue);

  const isSearching = !!keyword || permissionValue !== "all";

  useEffect(() => {
    if (router.isReady && isSavedCodesLoading) {
      track(AmpEvent.TO_MY_SAVED_CODES, { savedCodesCount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isSavedCodesLoading]);

  return (
    <PageContainer>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Flex direction="column">
          <Flex align="center">
            <Heading
              variant="h5"
              as="h5"
              minH="36px"
              display="flex"
              alignItems="center"
            >
              Saved Codes
            </Heading>
            <Badge variant="primary" ml={2}>
              {savedCodesCount}
            </Badge>
          </Flex>
          <Text variant="body2" color="text.dark">
            Your saved codes will be stored locally
          </Text>
        </Flex>
        <SaveCodeButton />
      </Flex>
      <Flex gap={3} my={8}>
        <InputWithIcon
          placeholder="Search with Code ID or Code Name"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
          size="lg"
          amptrackSection="saved-code-search"
        />
        <FilterByPermission
          initialSelected="all"
          setPermissionValue={(newVal: PermissionFilterValue) => {
            if (newVal === permissionValue) return;
            setValue("permissionValue", newVal);
          }}
        />
      </Flex>
      {!savedCodesCount ? (
        <SavedCodeZeroState button={<SaveCodeButton />} />
      ) : (
        <MySavedCodesSection
          codes={saved}
          isLoading={isSavedCodesLoading}
          onRowSelect={onRowSelect}
          isSearching={isSearching}
        />
      )}
    </PageContainer>
  );
});

export default SavedCodes;
