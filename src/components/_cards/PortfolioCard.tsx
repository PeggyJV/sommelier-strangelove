import { BoxProps, Button, HStack, VStack } from '@chakra-ui/react'
import { CardStat } from 'components/CardStat'
import { CardStatRow } from 'components/CardStatRow'
import React, { VFC } from 'react'
import { Card } from './Card'
import { BaseButton } from 'components/_buttons/BaseButton'

export const PortfolioCard: VFC<BoxProps> = () => {
  return (
    <Card p={2} bg='backgrounds.glassy'>
      <Card px={10} py={6} bg='backgrounds.black'>
        <CardStatRow spacing={14} align='flex-start' justify='flex-start'>
          <HStack align='flex-start'>
            <VStack>
              <CardStat label='net value' labelIcon='' stat='$0.00' />
              <CardStat label='apy' labelIcon='' stat='%0.00' />
            </VStack>
            <VStack>
              <CardStat label='deposit strategy' labelIcon='' stat='$0.00' />
              <HStack>
                <BaseButton variant='solid'>Deposit</BaseButton>
                <Button variant='unstyled' color='warmPink' isDisabled>
                  Withdraw
                </Button>
              </HStack>
            </VStack>
          </HStack>
          <HStack>
            <VStack>
              <CardStat label='lp tokens' stat='0' />
              <BaseButton isDisabled>Bond</BaseButton>
            </VStack>
            <VStack>
              <CardStat label='bonded lp tokens' stat='0' />
              <Button variant='unstyled' color='warmPink' isDisabled>
                Unbond
              </Button>
            </VStack>
          </HStack>
          <VStack>
            <CardStat label='rewards' stat='0' />
            <BaseButton isDisabled>Claim</BaseButton>
          </VStack>
        </CardStatRow>
      </Card>
    </Card>
  )
}
