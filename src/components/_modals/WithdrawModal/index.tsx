import {
  ModalProps,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import { VFC } from "react"
import { Token as TokenType } from "data/tokenConfig"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { BaseModal } from "../BaseModal"
import React from "react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"
import { ExchangeTab } from "./ExchangeTab"
import { SommelierTab } from "./SommelierTab"
import { CustomTab } from "../CustomTab"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const WithdrawModal: VFC<WithdrawModalProps> = (props) => {
  const id = useRouter().query.id as string
  const buyUrl = strategyPageContentData[id]?.buyUrl

  return (
    <BaseModal heading="Sell" {...props}>
      <Tabs variant="unstyled" isFitted>
        {buyUrl && (
          <TabList gap={2}>
            <CustomTab>Sommelier</CustomTab>
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
