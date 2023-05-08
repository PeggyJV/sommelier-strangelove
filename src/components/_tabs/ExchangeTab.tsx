import { Text, Link, HStack, Image, Stack } from "@chakra-ui/react"

import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { useRouter } from "next/router"
import { analytics } from "utils/analytics"
import { cellarDataMap } from "data/cellarDataMap"

export const ExchangeTab = ({ title }: { title: string }) => {
  const id = useRouter().query.id as string
  const exchanges = cellarDataMap[id].exchanges

  return (
    <Stack>
      {exchanges &&
        exchanges.length > 1 &&
        exchanges
          .filter((item) => "url" in item)
          .map((item) => (
            <Link
              key={item.name}
              // @ts-expect-error - typescript expect url is undefined
              href={item.url}
              onClick={() => {
                analytics.track(
                  `${
                    title.toLocaleLowerCase() === "deposit"
                      ? "deposit"
                      : "withdraw"
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
