import { HStack, StackDivider, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'

interface BondingPeriod {
  title: string
  amount: string
  value: BondingValueOptions
}

type BondingValueOptions = 1.1 | 1.25 | 1.5

const bondingPeriodOptions: BondingPeriod[] = [
  {
    title: '7 Days',
    amount: '1.1x SOMM',
    value: 1.1
  },
  {
    title: '14 Days',
    amount: '1.25x SOMM',
    value: 1.25
  },
  {
    title: '21 Days',
    amount: '1.5x SOMM',
    value: 1.5
  }
]

// TODO: solve for multiple renders
export const BondingPeriodOptions: VFC = () => {
  const { getValues, setValue } = useFormContext()
  const bondVal = getValues('bondingPeriod')
  return (
    <HStack
      spacing={0}
      justify='space-evenly'
      border='1px solid'
      borderRadius={12}
      borderColor='text.body.lightMuted'
      overflow='hidden'
      divider={<StackDivider borderColor='inherit' />}
    >
      {bondingPeriodOptions.map(({ title, amount, value }, i) => {
        const bg = value === bondVal ? 'rgba(96, 80, 155, 0.4)' : ''

        return (
          <VStack
            key={value + i}
            as='button'
            type='button'
            flex={1}
            px={4}
            py={2}
            bg={bg}
            onClick={() => {
              console.log('bingus')
              setValue('bondingPeriod', value)
            }}
          >
            <Text as='span' fontWeight='bold'>
              {title}
            </Text>
            <Text as='span' fontSize='sm'>
              {amount}
            </Text>
          </VStack>
        )
      })}
    </HStack>
  )
}
