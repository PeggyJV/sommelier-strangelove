import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react"
import { VFC } from "react"

import React from "react"
import { useRouter } from "next/router"
import { ExchangeTab } from "components/_tabs/ExchangeTab"
import { CustomTab } from "components/_tabs/CustomTab"
import { BaseModal, BaseModalProps } from "./BaseModal"
import { cellarDataMap } from "data/cellarDataMap"

interface ModalWithExchangeTabProps
  extends Pick<BaseModalProps, "onClose" | "isOpen" | "heading"> {
  sommelierTab: React.ReactNode
  id?: string
}

export const ModalWithExchangeTab: VFC<ModalWithExchangeTabProps> = (
  props
) => {
  const id = (useRouter().query.id as string) || props.id || ""
  const isHavingExchanges =
    Number(cellarDataMap[id]?.exchanges?.length) > 1

  return (
    <BaseModal {...props}>
      <Tabs variant="unstyled" isFitted>
        {isHavingExchanges && (
          <TabList gap={2}>
            <CustomTab>Sommelier</CustomTab>
            <CustomTab>Exchange</CustomTab>
          </TabList>
        )}
        <TabPanels>
          <TabPanel px={0}>{props.sommelierTab}</TabPanel>
          {isHavingExchanges && (
            <TabPanel px={0} pt={8}>
              <ExchangeTab
                title={props.heading?.toLowerCase() || ""}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </BaseModal>
  )
}
