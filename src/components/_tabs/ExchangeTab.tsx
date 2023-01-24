import { Text, Link, HStack, Image, Stack } from "@chakra-ui/react"

import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"
import { analytics } from "utils/analytics"

export const ExchangeTab = ({ title }: { title: string }) => {
  const id = useRouter().query.id as string
  const exchanges = strategyPageContentData[id].exchange

  return (
    <Stack>
      {exchanges &&
        exchanges
          .filter((item) => !!item.url)
          .map((item) => (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => {
                analytics.track(
                  `${
                    title === "buy" ? "deposit" : "withdraw"
                  }.exchange`,
                  {
                    platformSelection: `${item.name}`,
                  }
                )
              }}
              target="_blank"
            >
              <HStack
                justifyContent="space-between"
                backgroundColor="surface.secondary"
                padding={4}
                borderRadius="xl"
              >
                <HStack spacing={4}>
                  <Image
                    alt={item.name}
                    src={item.logo}
                    boxSize={6}
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {item.name}
                  </Text>
                </HStack>
                <ExternalLinkIcon />
              </HStack>
            </Link>
          ))}
    </Stack>
  )
}
