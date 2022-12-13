import { Text, Link, HStack, Image, Stack } from "@chakra-ui/react"

import { ExternalLinkIcon } from "components/_icons"
import React from "react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"

export const ExchangeTab = () => {
  const id = useRouter().query.id as string
  const exchanges = strategyPageContentData[id].exchange

  return (
    <Stack>
      {exchanges
        .filter((item) => item.name !== "Sommelier")
        .map((item) => (
          <Link key={item.name} href={item.url} target="_blank">
            <HStack
              justifyContent="space-between"
              backgroundColor="surface.secondary"
              padding={4}
              borderRadius="xl"
            >
              <HStack spacing={4}>
                <Image alt={item.name} src={item.logo} boxSize={6} />
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
