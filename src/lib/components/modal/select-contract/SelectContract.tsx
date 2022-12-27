import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  Input,
  Flex,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { IoList } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";

import { useCelatoneApp } from "lib/app-provider";
import { DEFAULT_RPC_ERROR } from "lib/data";
import { useContractStore, useEndpoint } from "lib/hooks";
import { useInstantiatedByMe } from "lib/model/contract";
import { queryContract } from "lib/services/contract";
import type { ContractAddr, RpcContractError } from "lib/types";

import { AllContractLists } from "./AllContractLists";
import { ListDetail } from "./ListDetail";

interface SelectContractProps {
  notSelected: boolean;
  onContractSelect: (addr: string) => void;
}

export const SelectContract = ({
  notSelected,
  onContractSelect,
}: SelectContractProps) => {
  const {
    appContractAddress: { example: exampleContractAddress },
  } = useCelatoneApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSlug, setListSlug] = useState("");

  const [searchManual, setSearchManual] = useState("");
  const [invalid, setInvalid] = useState("");

  const { getContractLists } = useContractStore();
  const contractLists = [useInstantiatedByMe(true), ...getContractLists()];
  const contractList = contractLists.find((item) => item.slug === listSlug);

  const endpoint = useEndpoint();

  const resetOnClose = () => {
    setListSlug("");
    setSearchManual("");
    setInvalid("");
    onClose();
  };

  const onSelectThenClose = (contract: string) => {
    onContractSelect(contract);
    resetOnClose();
  };

  // TODO: Abstract query
  const { refetch, isFetching, isRefetching } = useQuery(
    ["query", "contract", searchManual],
    async () => queryContract(endpoint, searchManual as ContractAddr),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      refetchOnReconnect: false,
      onSuccess() {
        onSelectThenClose(searchManual);
      },
      onError(err: AxiosError<RpcContractError>) {
        setInvalid(err.response?.data.error || DEFAULT_RPC_ERROR);
      },
    }
  );

  const handleListSelect = (slug: string) => {
    setListSlug(slug);
  };

  return (
    <>
      <Button
        variant={notSelected ? "primary" : "outline-info"}
        py="6px"
        px="16px"
        onClick={onOpen}
      >
        {notSelected ? "SELECT CONTRACT" : "CHANGE"}
      </Button>
      <Modal isOpen={isOpen} onClose={resetOnClose} size="4xl">
        <ModalOverlay />
        {listSlug.length === 0 || !contractList ? (
          <ModalContent>
            <ModalHeader>
              <Icon as={IoList} color="text.dark" fontSize="24px" />
              <Heading as="h5" variant="h5">
                Select Contract
              </Heading>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody p="24px">
              <Heading as="h6" variant="h6" mb="8px">
                Fill contract address manually
              </Heading>
              <Flex gap="8px" alignItems="center">
                <Input
                  isInvalid={invalid !== ""}
                  value={searchManual}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setSearchManual(inputValue);
                  }}
                  placeholder={`ex. ${exampleContractAddress}`}
                  size="md"
                />
                <Button
                  isDisabled={searchManual.length === 0}
                  isLoading={isFetching || isRefetching}
                  onClick={() => {
                    refetch();
                  }}
                >
                  Submit
                </Button>
              </Flex>
              <Text variant="body3" color="error.main" mt={1} ml={3}>
                {invalid}
              </Text>

              <Flex my="24px" gap="8px" alignItems="center">
                <Divider borderColor="gray.500" />
                <Text variant="body1">OR</Text>
                <Divider borderColor="gray.500" />
              </Flex>

              <Heading as="h6" variant="h6" mb={4}>
                Select from your Contract List
              </Heading>
              <AllContractLists
                contractLists={contractLists}
                handleListSelect={handleListSelect}
                isReadOnly
                formLabelBgColor="gray.800"
              />
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>
              <Icon
                as={MdChevronLeft}
                color="text.dark"
                fontSize="24px"
                onClick={() => setListSlug("")}
                cursor="pointer"
              />
              <Heading as="h5" variant="h5">
                {contractList.name}
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ListDetail
                contractListInfo={contractList}
                isReadOnly
                onContractSelect={onSelectThenClose}
              />
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};
