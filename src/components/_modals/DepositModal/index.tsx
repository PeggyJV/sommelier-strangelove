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
import { SommelierTab } from "./SommelierTab"
import React from "react"
import { strategyPageContentData } from "data/strategyPageContentData"
import { useRouter } from "next/router"
import { ExchangeTab } from "./ExchangeTab"
import { CustomTab } from "../CustomTab"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const DepositModal: VFC<DepositModalProps> = (props) => {
  const id = useRouter().query.id as string
  const uniswap = strategyPageContentData[id].exchange.find(
    (v) => v.name === "Uniswap"
  )

  return (
    <BaseModal heading="Buy" {...props}>
      <Tabs variant="unstyled" isFitted>
        {uniswap && (
          <TabList gap={2}>
            <CustomTab>Sommelier</CustomTab>
            <CustomTab>Exchange</CustomTab>
          </TabList>
        )}
        <TabPanels>
          <TabPanel px={0}>
            <SommelierTab {...props} />
          </TabPanel>
          {uniswap && (
            <TabPanel px={0} pt={8}>
              <ExchangeTab />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </BaseModal>
  )
}
