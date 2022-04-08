import { BoxProps, HStack, VStack } from '@chakra-ui/react'
import { CardStat } from 'components/CardStat'
import { CardStatRow } from 'components/CardStatRow'
import React, { VFC } from 'react'
import { Card } from './Card'
import { BaseButton } from 'components/_buttons/BaseButton'
import { DepositButton } from 'components/_buttons/DepositButton'
import { TertiaryButton } from 'components/_buttons/TertiaryButton'
import { BondButton } from 'components/_buttons/BondButton'

export const PortfolioCard: VFC<BoxProps> = () => {
  return (
    <Card p={2} bg='backgrounds.glassy'>
      <Card px={10} py={6} bg='backgrounds.black'>
        <CardStatRow spacing={14} align='flex-start' justify='flex-start'>
          <HStack spacing={6} align='flex-start'>
            <VStack align='flex-start'>
              <CardStat label='net value' labelIcon='' stat='$0.00' />
              <CardStat label='apy' labelIcon='' stat='%0.00' />
            </VStack>
            <VStack align='flex-start'>
              <CardStat label='deposit strategy' labelIcon='' stat='$0.00' />
              <HStack>
                <DepositButton />
              </HStack>
            </VStack>
          </HStack>
          <HStack spacing={6} align='flex-start'>
            <VStack align='flex-start'>
              <CardStat label='lp tokens' stat='0' />
              <BondButton />
            </VStack>
            <VStack align='flex-start'>
              <CardStat label='bonded lp tokens' stat='0' />
              <TertiaryButton isDisabled>Unbond</TertiaryButton>
            </VStack>
          </HStack>
          <VStack align='flex-start'>
            <CardStat label='rewards' stat='0' />
            <BaseButton isDisabled>Claim</BaseButton>
          </VStack>
        </CardStatRow>
      </Card>
    </Card>
  )
}
