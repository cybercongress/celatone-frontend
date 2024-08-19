import { Button, Text } from "@chakra-ui/react";

import { AppLink } from "../AppLink";
import { useInternalNavigate } from "lib/app-provider";

export const NotVerifiedDetails = () => {
  const navigate = useInternalNavigate();
  return (
    <>
      <Text variant="body2" color="text.dark">
        This module has not been verified. If you are the owner, you can{" "}
        <AppLink href="/modules/verify">
          <Text
            display="inline-flex"
            gap={1}
            size="sm"
            color="primary.main"
            transition="all .25s ease-in-out"
            _hover={{
              textDecoration: "underline",
              textDecorationColor: "primary.light",
              "& > p": { color: "primary.light" },
            }}
          >
            submit for verification
          </Text>
        </AppLink>{" "}
        with the new files.
      </Text>
      <Button
        onClick={() => {
          navigate({
            pathname: "/modules/verify",
          });
        }}
        variant="ghost-primary"
        size="sm"
      >
        Submit Verification
      </Button>
    </>
  );
};
