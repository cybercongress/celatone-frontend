import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import Link from "next/link";
import { BiUserVoice } from "react-icons/bi";
import { BsMedium, BsGithub, BsTwitter, BsTelegram } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";

import { AmpEvent, AmpTrack, AmpTrackCelatone } from "lib/services/amplitude";

const Footer = () => {
  const socialMenu = [
    {
      url: "https://github.com/alleslabs",
      icon: BsGithub,
      slug: "github",
    },
    {
      url: "https://twitter.com/celatone_",
      icon: BsTwitter,
      slug: "twitter",
    },
    {
      url: "https://medium.com/alles-labs",
      icon: BsMedium,
      slug: "medium",
    },
    {
      url: "https://t.me/celatone",
      icon: BsTelegram,
      slug: "telegram",
    },
  ];
  return (
    <Flex
      as="footer"
      align="center"
      justifyContent="space-between"
      px={12}
      py={4}
      mx={1}
    >
      <Flex direction="row" gap={1} align="center">
        {socialMenu.map((item) => (
          <Link
            key={`social-${item.slug}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrackCelatone(item.url)}
          >
            <Button variant="ghost-gray" size="xs">
              <Icon
                as={item.icon}
                width="16px"
                height="16px"
                color="pebble.600"
              />
            </Button>
          </Link>
        ))}
        <Link
          href="https://feedback.alleslabs.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => AmpTrack(AmpEvent.FEEDBACK)}
        >
          <Button variant="ghost" size="xs">
            <Flex gap={1} align="center">
              <Icon
                as={BiUserVoice}
                width="18px"
                height="18px"
                color="pebble.600"
              />
              <Text variant="body3" color="text.dark">
                Feedback
              </Text>
            </Flex>
          </Button>
        </Link>
      </Flex>
      <Flex direction="column" alignItems="end" minW="60px">
        <Button
          variant="ghost"
          size="xs"
          sx={{ _hover: { "> div > svg": { opacity: "100" } } }}
        >
          <Link
            href="https://twitter.com/alleslabs"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrack(AmpEvent.ALLESLABS)}
          >
            <Flex
              gap={1}
              align="center"
              sx={{ _hover: { "> svg": { opacity: "100" } } }}
            >
              <Icon
                as={IoSparklesSharp}
                width="16px"
                height="16px"
                color="honeydew.light"
                opacity="0"
                transition="all .25s ease-in-out"
              />
              <Text variant="body3" color="text.dark">
                Made by
              </Text>
              <Text
                variant="body3"
                color="lilac.main"
                transition="all .25s ease-in-out"
                _hover={{ color: "lilac.light" }}
              >
                Alles Labs
              </Text>
            </Flex>
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};

export default Footer;
