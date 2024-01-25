import React, { FC } from "react"
import { Flex, FormControl, HStack, IconButton, Image, Stack, Text } from "@chakra-ui/react"
import { ChainSelector } from "components/ChainSelector"
import { Chain, chainConfig, ChainType } from "data/chainConfig"
import { useFormContext } from "react-hook-form"
import { BridgeFormValues } from "components/_cards/BridgeCard/index"
import { Link } from "components/Link"
import { ExternalLinkIcon } from "components/_icons"

interface BridgeFormHeaderProps {
  isLoading: boolean,
  from: Chain,
  to: Chain
}
export const BridgeFormHeader : FC<BridgeFormHeaderProps> = ({ isLoading, from, to }) => {

  const {  setValue, watch } =
    useFormContext<BridgeFormValues>()
  const getTextForChosenChains = () => {
    const fromChainType = from.type;
    const toChainType = to.type;

    if(fromChainType === toChainType){
      return "Not a valid bridge."
    }
    if((fromChainType === ChainType.Ethereum && toChainType === ChainType.Cosmos)
      || (fromChainType === ChainType.Cosmos && toChainType === ChainType.Ethereum)) {
      return "Bridge your Ethereum SOMM back home to its native Cosmos\n" +
        "representation on Sommelier or from Sommelier to Ethereum. "
    }
    if((fromChainType === ChainType.L2 && toChainType === ChainType.Cosmos)
      || (fromChainType === ChainType.Cosmos && toChainType === ChainType.L2)) {
      return "Bridge from Ethereum <> Cosmos or from an L2 <> Cosmos"
    }
    if((fromChainType === ChainType.Ethereum && toChainType === ChainType.L2)
      || (fromChainType === ChainType.L2 && toChainType === ChainType.Ethereum)) {
      return "Bridge from Ethereum <> Cosmos, L2 <> Cosmos or from an Ethereum <> L2"
    }
  }
  const SwapButton = () => (
    <Flex
      justifyContent={"center"}
      alignSelf="flex-end"
      pb={2}
    >
      <IconButton
        aria-label="swap icon"
        variant="unstyled"
        size="sm"
        icon={
          <Image
            src="/assets/images/swap.svg"
            alt="swap icon"
          />
        }
        disabled={isLoading}
        onClick={() => {
          const fromValue = from.id;
          const toValue = to.id;

          setValue("to", fromValue);
          setValue("from", toValue);
        }
        }
      />
    </Flex>
  )
  return(
    <>
      <Text fontSize="md" mb="41px">
        {getTextForChosenChains()}
        <Link
          ml={1}
          fontSize="xs"
          fontWeight="semibold"
          textDecoration="underline"
          href="https://www.notion.so/Bridge-UI-88307640a6ab4f649b6a0b3cb6cb4d34"
          target="_blank"
        >
          Read More{" "}
          <ExternalLinkIcon boxSize={3} color="purple.base" />
        </Link>
      </Text>

      <HStack justifyContent="space-between">
        <Stack flex={1}>

          <FormControl>
            <ChainSelector
              chains={chainConfig}
              defaultValue={watch("from")}
              direction="from"
              otherChain={to}
            />

          </FormControl>
        </Stack>

        <SwapButton />

        <Stack flex={1}>
          <FormControl>
            <ChainSelector
              chains={chainConfig}
              defaultValue={watch("to")}
              direction="to"
              otherChain={from}
            />

          </FormControl>
        </Stack>
      </HStack>
    </>
  )
}
