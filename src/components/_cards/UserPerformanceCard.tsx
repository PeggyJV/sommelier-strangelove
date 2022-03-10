import { BoxProps } from '@chakra-ui/react'
import { CardStat } from 'components/CardStat'
import { CardStatRow } from 'components/CardStatRow'
import React, { VFC } from 'react'
import { Card } from './Card'
import { BsCurrencyDollar } from 'react-icons/bs'

export const UserPerformanceCard: VFC<BoxProps> = () => {
  return (
    <Card>
      <CardStatRow>
        <CardStat
          label='your principal'
          labelIcon=''
          stat='12.5K USDC'
          statIcon={BsCurrencyDollar}
        />
        <CardStat
          label='your net asset value'
          labelIcon=''
          stat='23.34K USDC'
          statIcon={BsCurrencyDollar}
        />
        <CardStat label='your yield' labelIcon='' stat='3.7%' />
        <CardStat
          label='your rewards'
          labelIcon=''
          stat='0.28K USDC'
          statIcon={BsCurrencyDollar}
        />
        <CardStat
          label='lp tokens'
          labelIcon=''
          stat='0.28K USDC'
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
  )
}
