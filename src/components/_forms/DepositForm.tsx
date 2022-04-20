import { useState, VFC } from 'react'
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  Text,
  VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { BaseButton } from 'components/_buttons/BaseButton'
import { AiOutlineInfo } from 'react-icons/ai'
import { SecondaryButton } from 'components/_buttons/SecondaryButton'
import { ModalInput } from 'components/_inputs/ModalInput'
import { ModalSelect } from 'components/_selects/ModalSelect'
import { CardHeading } from 'components/_typography/CardHeading'
import { TokenOption } from 'components/_inputs/TokenOption'

interface FormValues {
  depositAmount: number
}

export const DepositForm: VFC = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>()
  const [data, setData] = useState<any>()
  const watchDepositAmount = watch('depositAmount')
  const isDisabled = isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount
  const setMax = () => setValue('depositAmount', 100000)

  // need to do something meaningful with this data
  console.log({ data })

  const tokenConfig = [
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
  ]

  return (
    <VStack
      as='form'
      spacing={8}
      align='stretch'
      onSubmit={handleSubmit(data => setData(data))}
    >
      <FormControl>
        <ModalSelect placeholder='Select deposit asset'>
          {tokenConfig.map((address, i) => {
            return <TokenOption key={i} address={address} />
          })}
        </ModalSelect>
      </FormControl>
      <VStack align='flex-start'>
        <CardHeading>available</CardHeading>
        <Text as='span'>---</Text>
      </VStack>
      <FormControl isInvalid={isError as boolean | undefined}>
        <InputGroup display='flex' alignItems='center'>
          <ModalInput
            type='number'
            step='any'
            {...register('depositAmount', {
              required: 'Enter amount',
              valueAsNumber: true,
              validate: {
                positive: v => v > 0 || 'You must submit a positive amount.'
              }
            })}
          />
          <InputRightElement h='100%' mr={3}>
            <SecondaryButton size='sm' borderRadius={8} onClick={setMax}>
              Max
            </SecondaryButton>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage color='energyYellow'>
          <Icon
            p={0.5}
            mr={1}
            color='black'
            bg='energyYellow'
            borderRadius='50%'
            as={AiOutlineInfo}
          />{' '}
          {errors.depositAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <BaseButton
        type='submit'
        isDisabled={isDisabled}
        isLoading={isSubmitting}
        fontSize={21}
        py={6}
        px={12}
      >
        Deposit Liquidity
      </BaseButton>
    </VStack>
  )
}
