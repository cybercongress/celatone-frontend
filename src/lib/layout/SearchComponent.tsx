/* eslint-disable sonarjs/no-duplicate-string */
import {
  Button,
  Flex,
  FormControl,
  Input,
  Kbd,
  List,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";

import { trackUseMainSearch } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
  // useTierConfig,
} from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import { EmptyState } from "lib/components/state";
import { useEaster } from "lib/hooks";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import { useSearchHandler } from "lib/services/searchService";
import type { Addr, Nullable, Option } from "lib/types";
import { splitModule } from "lib/utils";

interface ResultItemProps {
  index: number;
  type: SearchResultType;
  value: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}

const getZeroState = ({
  isWasm,
  isPool,
  isMove,
  isGov,
}: {
  isWasm: boolean;
  isPool: boolean;
  isMove: boolean;
  isGov: boolean;
}) => {
  const starter = ["Account Address", "TX Hash", "Block Height"];
  const govText = isGov ? ["Validator Address", "Proposal ID"] : [];
  const wasmText = isWasm ? ["Code ID", "Contract Address"] : [];
  const moveText = isMove ? ["Module Path"] : [];
  const poolText = isPool ? ["Pool ID"] : [];

  const supportedItemsType = starter.concat(
    govText,
    wasmText,
    moveText,
    poolText
  );

  return (
    <Flex direction="column" gap={4} py={8}>
      <Text color="text.dark"> Please enter keyword, You can search with:</Text>
      <Flex
        direction="column"
        px={4}
        py={2}
        border="1px solid"
        borderColor="gray.700"
        borderRadius={8}
      >
        {supportedItemsType.map((item) => (
          <Flex alignItems="center" gap={3}>
            <Flex w={1} h={1} borderRadius="full" bgColor="primary.darker" />
            <Text color="text.dark">{item}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

// const getResult = () => (
//   <Flex direction="column" gap={3}>
//     <Text variant="body2" color="text.dark">
//       5 Matched results...
//     </Text>
//     <Flex
//       py={1}
//       px={2}
//       gap={3}
//       alignItems="center"
//       borderRadius={8}
//       cursor="pointer"
//       transition="all 0.25s ease-in-out"
//       _hover={{
//         background: "gray.700",
//       }}
//     >
//       <CustomIcon name="code" />
//       <Flex alignItems="center" gap={1}>
//         <Text variant="body2" color="text.main">
//           123
//         </Text>
//         <Text variant="body2" color="text.dark">
//           - Code
//         </Text>
//       </Flex>
//     </Flex>
//   </Flex>
// );

const getNextCursor = (
  key: string,
  current: Option<number>,
  lastIndex: number
) => {
  switch (key) {
    case "ArrowUp":
      if (current === undefined) return lastIndex;
      return current <= 0 ? lastIndex : current - 1;
    case "ArrowDown":
      if (current === undefined) return 0;
      return current >= lastIndex ? 0 : current + 1;
    default:
      return undefined;
  }
};

const generateQueryObject = (params: string[], value: string | string[]) =>
  typeof value === "string"
    ? { [params[0]]: value }
    : params.reduce((acc, curr, idx) => ({ ...acc, [curr]: value[idx] }), {});

const getRouteOptions = (
  type: Option<SearchResultType>
): Nullable<{ pathname: string; query: string[] }> => {
  switch (type) {
    case "Account Address":
      return {
        pathname: "/accounts/[accountAddress]",
        query: ["accountAddress"],
      };
    case "Transaction Hash":
      return { pathname: "/txs/[txHash]", query: ["txHash"] };
    case "Code ID":
      return { pathname: "/codes/[codeId]", query: ["codeId"] };
    case "Contract Address":
      return {
        pathname: "/contracts/[contractAddress]",
        query: ["contractAddress"],
      };
    case "Block":
      return { pathname: "/blocks/[height]", query: ["height"] };
    case "Proposal ID":
      return { pathname: "/proposals/[proposalId]", query: ["proposalId"] };
    case "Validator Address":
      return {
        pathname: "/validators/[validatorAddress]",
        query: ["validatorAddress"],
      };
    case "Pool ID":
      return { pathname: "/pools/[poolId]", query: ["poolId"] };
    case "Module Path":
      return {
        pathname: "/modules/[address]/[moduleName]",
        query: ["address", "moduleName"],
      };
    default:
      return null;
  }
};

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account Address":
      return "admin" as IconKeys;
    case "Transaction Hash":
      return "file" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract Address":
    case "Module Path":
      return "contract-address" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Validator Address":
      return "validator" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    default:
      return "list" as IconKeys;
  }
};

const ResultItem = ({
  index,
  type,
  value,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;
  const normalizedIcnsValue = value.endsWith(`.${metadata.icns.bech32Prefix}`)
    ? value
    : `${value}.${metadata.icns.bech32Prefix}`;
  return (
    <Flex id={`item-${index}`}>
      {route && (
        <Flex
          p={2}
          w="full"
          gap={3}
          alignItems={
            metadata.icns.icnsNames?.primaryName ? "flex-start" : "center"
          }
          borderRadius="8px"
          _hover={{ bg: "gray.700", cursor: "pointer" }}
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          bg={index === cursor ? "gray.700" : undefined}
          onMouseMove={() => index !== cursor && setCursor(index)}
          onClick={() => {
            handleSelectResult(type, true);
            onClose?.();
          }}
        >
          <CustomIcon name={getIcon(type)} color="gray.600" />
          <Flex direction="column">
            <Text variant="body2">{metadata.icns.address || value}</Text>
            {metadata.icns.icnsNames?.primaryName && (
              <Flex gap={1} align="center" flexWrap="wrap">
                <Flex gap={1} align="center">
                  <PrimaryNameMark />
                  <Text variant="body3" color="text.dark">
                    {metadata.icns.icnsNames.primaryName}
                  </Text>
                </Flex>
                {value !== metadata.icns.address &&
                  normalizedIcnsValue !==
                    metadata.icns.icnsNames?.primaryName && (
                    <Text
                      variant="body3"
                      color="text.dark"
                      _before={{
                        content: '"/"',
                        fontSize: "12px",
                        color: "text.dark",
                        mr: 1,
                      }}
                    >
                      {normalizedIcnsValue}
                    </Text>
                  )}
              </Flex>
            )}
          </Flex>
          <Text variant="body2" fontWeight={500} color="text.disabled">
            <span>–</span> {type}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

const ResultRender = ({
  results,
  keyword,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: {
  results: SearchResultType[];
  keyword: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}) => (
  <>
    {!results.length ? (
      <EmptyState
        imageVariant="not-found"
        textVariant="body2"
        message="Matches not found. Please check your spelling or make sure you have
          selected the correct network."
      />
    ) : (
      results.map((type, index) => (
        <ResultItem
          key={type}
          index={index}
          type={type}
          value={keyword}
          cursor={cursor}
          metadata={metadata}
          setCursor={setCursor}
          handleSelectResult={handleSelectResult}
          onClose={onClose}
        />
      ))
    )}
  </>
);

export const SearchComponent = () => {
  // const isFullTier = useTierConfig() === "full";
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    currentChainId,
    chainConfig: {
      features: {
        gov: { enabled: isGov },
        wasm: { enabled: isWasm },
        move: { enabled: isMove },
        pool: { enabled: isPool },
      },
    },
  } = useCelatoneApp();

  const boxRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number>();

  const { results, isLoading, metadata } = useSearchHandler(keyword, () =>
    setIsTyping(false)
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setIsTyping(true);
    setCursor(0);
  };

  const handleSelectResult = useCallback(
    (type?: SearchResultType, isClick = false) => {
      trackUseMainSearch(isClick, type);
      const routeOptions = getRouteOptions(type);
      if (routeOptions) {
        const queryValues =
          type === "Module Path"
            ? (splitModule(keyword) as [Addr, string])
            : metadata.icns.address || keyword;
        navigate({
          pathname: routeOptions.pathname,
          query: generateQueryObject(routeOptions.query, queryValues),
        });
        setKeyword("");
        onClose();
      }
    },
    [keyword, metadata.icns.address, navigate, onClose]
  );

  const handleOnKeyEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          const lastIndex = results.length - 1;
          const nextCursor = getNextCursor(e.key, cursor, lastIndex);
          const listItem = document.getElementById(`item-${nextCursor}`);
          e.preventDefault();
          setCursor(nextCursor);
          listItem?.scrollIntoView({ block: "nearest", inline: "center" });
          break;
        }
        case "Enter":
          e.currentTarget.blur();
          handleSelectResult(results[cursor ?? 0]);
          break;
        default:
          break;
      }
    },
    [cursor, handleSelectResult, results]
  );

  useOutsideClick({
    ref: boxRef,
    handler: onClose,
  });

  useEaster(keyword);

  return (
    <>
      {isMobile ? (
        <Button variant="outline-gray" size="sm" onClick={onOpen}>
          <CustomIcon name="search" boxSize={3} />
        </Button>
      ) : (
        <Flex
          onClick={onOpen}
          w="full"
          maxH="40px"
          p={2}
          alignItems="center"
          justifyContent="space-between"
          border="1px solid"
          borderColor="gray.700"
          borderRadius={8}
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          _hover={{
            background: "gray.800",
          }}
        >
          <Flex gap={1}>
            <CustomIcon color="gray.600" name="search" boxSize={4} />
            <Text variant="body1" color="text.disabled">
              Search on {currentChainId}
            </Text>
          </Flex>
          <Flex pb={1} borderRadius={4}>
            <span>
              <Kbd>⌘</Kbd> <Kbd>K</Kbd>
            </span>
          </Flex>
        </Flex>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          w={{ base: "90%", md: "800px" }}
          bg="gray.800"
          maxW="100vw"
        >
          <ModalHeader
            position="relative"
            p={0}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
          >
            <FormControl ref={boxRef} zIndex={3}>
              <Input
                w="100%"
                minW="200px"
                size="lg"
                placeholder="Enter your keyword..."
                style={{ maxHeight: "54px", border: "none" }}
                mr={24}
                value={keyword}
                onChange={handleSearchChange}
                // onFocus={onOpen}
                onKeyDown={handleOnKeyEnter}
                autoComplete="off"
              />
            </FormControl>
            <Tag
              variant="accent-darker"
              size="sm"
              position="absolute"
              right={4}
            >
              {currentChainId}
            </Tag>
          </ModalHeader>
          <ModalBody px={3}>
            {keyword.length > 0 ? (
              <>
                {isLoading || isTyping ? (
                  <Flex
                    py={5}
                    gap={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Spinner color="gray.600" size="sm" />
                    <Text
                      color="text.disabled"
                      variant="body2"
                      fontWeight={500}
                    >
                      Looking for results ...
                    </Text>
                  </Flex>
                ) : (
                  <List>
                    {results.length > 0 && (
                      <Text variant="body2" color="text.dark" mb={3}>
                        {results.length} Matched results...
                      </Text>
                    )}
                    <ResultRender
                      results={results}
                      keyword={keyword}
                      cursor={cursor}
                      metadata={metadata}
                      setCursor={setCursor}
                      handleSelectResult={handleSelectResult}
                    />
                  </List>
                )}
              </>
            ) : (
              <Flex justifyContent="center">
                {getZeroState({ isWasm, isPool, isMove, isGov })}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
