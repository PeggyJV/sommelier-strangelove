import {
  HStack,
  ModalProps,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react"
import { DepositForm } from "components/_forms/DepositForm"
import { CardHeading } from "components/_typography/CardHeading"
import { VFC } from "react"
import { BaseModal } from "./BaseModal"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { ethers } from "ethers"
import { BigNumber } from "bignumber.js"
import { toEther } from "./../../utils/formatCurrency"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  const { cellarData, userData, aaveCellarSigner } = useAaveV2Cellar()
  console.log({ cellarData, userData, aaveCellarSigner })

  return (
    <BaseModal heading="Deposit" {...props}>
      <VStack pb={10} spacing={6} align="stretch">
        <HStack spacing={6}>
          <VStack align="flex-start">
            <CardHeading>cellar</CardHeading>
            <Text as="span">aave2-CLR-S</Text>
          </VStack>
          <VStack align="flex-start">
            <CardHeading>maximum deposit</CardHeading>
            <Text as="span">
              {userData?.loading ? (
                <Spinner size="xs" />
              ) : (
                toEther(userData?.maxDeposit)
              )}
              {" DAI"}
            </Text>
          </VStack>
          <VStack align="flex-start">
            <CardHeading>deposit clears in</CardHeading>
            <Text as="span">6d 4h 23m</Text>
          </VStack>
        </HStack>
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">
            {userData?.loading ? (
              <Spinner size="xs" />
            ) : (
              toEther(userData?.balances?.dai)
            )}
            {" DAI"}
          </Text>
        </VStack>
      </VStack>
      <DepositForm />
    </BaseModal>
  )
}
