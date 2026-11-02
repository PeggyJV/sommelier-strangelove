import {
  Box,
  Stack,
  Text,
  Button,
  Link,
  Flex,
} from "@chakra-ui/react"
import NextLink from "next/link"
import * as React from "react"
import NextImage from "next/image"

type Props = {
  targetDate: Date
  blogHref?: string
}

export default function TopLaunchBanner({
  targetDate: _targetDate,
  blogHref = "https://somm.finance/blog/putting-steth-to-work-where-it-matters-most",
}: Props) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      rounded="2xl"
      borderWidth="1px"
      borderColor="surface.tertiary"
      bg="surface.primary"
      // Soft brand glow instead of a full-bleed gradient
      bgImage="radial-gradient(ellipse 60% 120% at 100% 0%, rgba(108,78,217,0.28) 0%, rgba(108,78,217,0) 70%)"
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      mb={{ base: 6, md: 8 }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap={{ base: 6, md: 10 }}
      >
        <Stack spacing={4} maxW="640px">
          <Link
            href="https://lido.fi"
            isExternal
            _hover={{ textDecoration: "none", borderColor: "neutral.500" }}
            aria-label="Lido official website"
            display="inline-flex"
            alignItems="center"
            gap={2}
            w="fit-content"
            px={3}
            py={1}
            rounded="full"
            borderWidth="1px"
            borderColor="surface.tertiary"
            bg="blackAlpha.300"
          >
            <NextImage
              src="/assets/icons/lido.png"
              alt=""
              width={18}
              height={18}
            />
            <Text fontSize="xs" fontWeight={600} color="neutral.300">
              Powered by Lido
            </Text>
          </Link>

          <Stack spacing={2}>
            <Text
              as="h1"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight={700}
              lineHeight={1.1}
              letterSpacing="-0.02em"
              color="neutral.100"
            >
              Alpha stETH Vault
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="neutral.400">
              Alpha stETH is in migration-only mode. Eligible Real Yield
              ETH and Turbo stETH holders can move their positions with
              the guided migration flow. Ordinary deposits and
              withdrawals are unavailable.
            </Text>
          </Stack>

          <Stack
            spacing={3}
            direction={{ base: "column", sm: "row" }}
            pt={2}
          >
            <Button
              as={NextLink}
              href="/strategies/Alpha-stETH/manage"
              size="md"
              h="40px"
              px={5}
              fontSize="sm"
              fontWeight={600}
              bg="purple.base"
              color="white"
              _hover={{ bg: "#7B60E0" }}
              _active={{ bg: "#5E42C7" }}
              _focusVisible={{
                boxShadow: "0 0 0 3px var(--chakra-colors-purple-dark)",
              }}
            >
              Open Migration
            </Button>
            <Button
              as={Link}
              href={blogHref}
              isExternal
              size="md"
              h="40px"
              px={5}
              fontSize="sm"
              fontWeight={600}
              variant="outline"
              bg="transparent"
              color="neutral.200"
              borderWidth="1px"
              borderColor="surface.quartnerary"
              _hover={{
                textDecoration: "none",
                bg: "whiteAlpha.50",
                borderColor: "neutral.500",
              }}
            >
              Read the strategy
            </Button>
          </Stack>
        </Stack>

        <Box
          aria-hidden
          flexShrink={0}
          display={{ base: "none", md: "block" }}
          p={4}
          rounded="full"
          bg="whiteAlpha.50"
          borderWidth="1px"
          borderColor="surface.tertiary"
        >
          <NextImage
            src="/assets/icons/GG.png"
            alt=""
            width={72}
            height={72}
          />
        </Box>
      </Flex>
    </Box>
  )
}
