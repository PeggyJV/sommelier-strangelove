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
import { SommelierTab } from "./SommelierTab"
import { CustomTab } from "../../_tabs/CustomTab"
import { ExchangeTab } from "components/_tabs/ExchangeTab"

type WithdrawModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const WithdrawModal: VFC<WithdrawModalProps> = (props) => {
  const id = useRouter().query.id as string
  const exchanges = strategyPageContentData[id]?.exchange.length

  return (
    <BaseModal heading="Sell" {...props}>
      <Tabs variant="unstyled" isFitted>
        {exchanges && (
          <TabList gap={2}>
            <CustomTab>Sommelier</CustomTab>
            <CustomTab>Exchange</CustomTab>
          </TabList>
        )}
        <TabPanels>
          <TabPanel px={0}>
            <SommelierTab {...props} />
          </TabPanel>
          {exchanges && (
            <TabPanel px={0} pt={8}>
              <ExchangeTab />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </BaseModal>
  )
}
