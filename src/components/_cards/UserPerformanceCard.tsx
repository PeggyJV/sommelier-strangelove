import { BoxProps, VStack } from '@chakra-ui/react'
import { CardStat } from 'components/CardStat'
import { CardStatRow } from 'components/CardStatRow'
import React, { VFC } from 'react'
import { Card } from './Card'
import { BsCurrencyDollar } from 'react-icons/bs'
import { BaseButton } from 'components/_buttons/BaseButton'

export const UserPerformanceCard: VFC<BoxProps> = () => {
  return (
    <Card bg='backgrounds.purpleGlassGradient'>
      <Card bg='backgrounds.black'>
        <CardStatRow align='flex-start'>
          <VStack>
            <CardStat
              label='your principal'
              labelIcon=''
              stat='0 USDC'
              statIcon={BsCurrencyDollar}
            />
            <BaseButton variant='solid' size='sm'>
              Add Liquidity
            </BaseButton>
          </VStack>
          <VStack>
            <CardStat
              label='your net asset value'
              labelIcon=''
              stat='23.34K USDC'
              statIcon={BsCurrencyDollar}
            />
            <BaseButton variant='solid' size='sm' disabled>
              Remove Liquidity
            </BaseButton>
          </VStack>
          <VStack>
            <CardStat
              label='lp tokens'
              labelIcon=''
              stat='0 USDC'
              statIcon={BsCurrencyDollar}
            />
            <BaseButton variant='solid' size='sm' disabled>
              Bond LP Tokens
            </BaseButton>
          </VStack>
          <CardStat label='your yield' labelIcon='' stat='0%' />
          <CardStat
            label='your rewards'
            labelIcon=''
            stat='0 SOMM'
            statIcon={BsCurrencyDollar}
          />
          <CardStat
            label='your bonded total'
            labelIcon=''
            stat='10.25 USDC'
            statIcon={BsCurrencyDollar}
          />
        </CardStatRow>
      </Card>
    </Card>
  )
}
