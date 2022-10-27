import {
  ModalProps,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useTab,
} from "@chakra-ui/react"
import { VFC } from "react"
import { Token as TokenType } from "data/tokenConfig"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { BaseModal } from "../BaseModal"
import { SommelierTab } from "./SommelierTab"
import React from "react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"
import { ExchangeTab } from "./ExchangeTab"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  // eslint-disable-next-line react/display-name
  const CustomTab = React.forwardRef((props, ref) => {
    const tabProps = useTab({
      ...props,
      ref: ref as React.Ref<HTMLElement>,
    })

    const isSelected = !!tabProps["aria-selected"]

    return (
      <SecondaryButton
        {...tabProps}
        borderWidth={!isSelected ? 0 : 2}
        borderRadius={16}
        size="lg"
        backgroundColor="surface.tertiary"
        flex={1}
      >
        {tabProps.children}
      </SecondaryButton>
    )
  })
  const id = useRouter().query.id as string
  const buyUrl = strategyPageContentData[id]?.buyUrl

  return (
    <BaseModal heading="Buy" {...props}>
      <Tabs variant="unstyled" isFitted>
        {buyUrl && (
          <TabList>
            {/* @ts-ignore */}
            <CustomTab>Sommelier</CustomTab>
            {/* @ts-ignore */}
            <CustomTab>Exchange</CustomTab>
          </TabList>
        )}
        <TabPanels>
          <TabPanel px={0}>
            <SommelierTab {...props} />
          </TabPanel>
          {buyUrl && (
            <TabPanel px={0} pt={8}>
              <ExchangeTab />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </BaseModal>
  )
}
