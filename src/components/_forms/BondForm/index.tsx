import { useState, VFC } from 'react'
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { BaseButton } from 'components/_buttons/BaseButton'
import { AiOutlineInfo } from 'react-icons/ai'
import { SecondaryButton } from 'components/_buttons/SecondaryButton'
import { ModalInput } from 'components/_inputs/ModalInput'
import { CardHeading } from 'components/_typography/CardHeading'
import { BondingPeriodOptions } from './BondingPeriodOptions'

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

export const BondForm: VFC = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm<FormValues>()
  const watchDepositAmount = watch('depositAmount')
  const isDisabled = isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount
  const setMax = () => setValue('depositAmount', 100000)
  const [bondVal, setBondVal] = useState<number>(1)

  // need to do something meaningful with this data
  console.log({ isSubmitted })

  return (
    <VStack
      as='form'
      spacing={8}
      align='stretch'
      onSubmit={handleSubmit(data => console.log({ data }))}
    >
      <VStack align='stretch'>
        <CardHeading>Bonding Period</CardHeading>
        <BondingPeriodOptions bondVal={bondVal} onClick={() => setBondVal(1)} />
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
        Bond LP Tokens
      </BaseButton>
    </VStack>
  )
}
