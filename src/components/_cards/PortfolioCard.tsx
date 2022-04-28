import {
  Avatar,
  BoxProps,
  HStack,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react"
import { CardStat } from "components/CardStat"
import { CardStatRow } from "components/CardStatRow"
import { VFC } from "react"
import { DepositButton } from "components/_buttons/DepositButton"
import { BondButton } from "components/_buttons/BondButton"
import { WithdrawButton } from "components/_buttons/WithdrawButton"
import { UnbondButton } from "components/_buttons/UnbondButton"
import { ClaimButton } from "components/_buttons/ClaimButton"
import { tokenConfig } from "data/tokenConfig"
import { InlineImage } from "components/InlineImage"
import TransparentCard from "./TransparentCard"

export const PortfolioCard: VFC<BoxProps> = () => {
  return (
    <TransparentCard px={10} py={6}>
      <CardStatRow
        spacing={14}
        align="flex-start"
        justify="flex-start"
      >
        <SimpleGrid
          templateColumns="repeat(2, max-content)"
          spacing={4}
        >
          <CardStat label="net value" labelIcon="">
            $0.00
          </CardStat>
          <CardStat label="deposit assets">
            <HStack spacing={-1.5}>
              {tokenConfig.map((token) => {
                const { src, alt, address } = token

                return (
                  <Avatar
                    key={address}
                    size="xs"
                    src={src}
                    name={alt}
                    borderWidth={2}
                    borderColor="black"
                    bg="black"
                    _notLast={{
                      opacity: 0.65,
                    }}
                  />
                )
              })}
            </HStack>
          </CardStat>
          <CardStat label="apy" labelIcon="">
            0.00%
          </CardStat>
          <HStack>
            <DepositButton />
            <WithdrawButton />
          </HStack>
        </SimpleGrid>
        <SimpleGrid
          templateColumns="repeat(2, max-content)"
          spacing={4}
        >
          <VStack align="flex-start">
            <CardStat label="available tokens">
              <InlineImage
                src="/assets/icons/aave.svg"
                alt="aave logo"
              />
              0
            </CardStat>
            <BondButton />
          </VStack>
          <VStack align="flex-start">
            <CardStat label="bonded tokens">
              <InlineImage
                src="/assets/icons/aave.svg"
                alt="aave logo"
              />
              0
            </CardStat>
            <UnbondButton />
          </VStack>
        </SimpleGrid>
        <VStack align="flex-start">
          <CardStat label="rewards">
            <InlineImage
              src="/assets/icons/somm.svg"
              alt="aave logo"
            />
            0
          </CardStat>
          <ClaimButton />
        </VStack>
      </CardStatRow>
    </TransparentCard>
  )
}
