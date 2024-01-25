import React from "react"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SelectProps,
  Text,
  Image,
  HStack,
  Icon
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { Chain, chainConfigMap } from "data/chainConfig"
import { FaCaretDown } from "react-icons/fa"

interface Props extends SelectProps {
  chains: Chain[],
  direction: "from" | "to",
  otherChain: Chain
}

export const ChainSelector: React.FC<Props> = ({ chains, direction, otherChain }): React.ReactElement => {

  const { watch, setValue } = useFormContext<BridgeFormValues>();

  const handleSelect = (selectedValue: string) => {
    setValue(direction, selectedValue, { shouldValidate: true });
  };

  const selectedChain = chainConfigMap[watch(direction)]

  const isDisabled = (chain: Chain) => {
    return chain.id === otherChain.id || chain.type === otherChain.type
  }
  return (
    <>
      <Text fontWeight="bold" color="neutral.400" fontSize="xs">
        {direction.toUpperCase()}
      </Text>
      <Menu>
        <MenuButton as="div">
          <HStack
            borderRadius="16px"
            borderWidth="1px"
            borderColor="neutral.600"
            height="45px"
            p={2}
            px={1}
            align="center"
            justify="space-between"
          >
            <Image
              src={selectedChain.logoPath}
              alt={selectedChain.id}
              ml={1}
              w="16px"
              h="16px"
            />
            <Text fontWeight="bold">{selectedChain.displayName}</Text>
            <Icon as={FaCaretDown} />
          </HStack>

        </MenuButton>
        <MenuList>
          {chains.map((chain, i) => (
            <MenuItem
              key={i}
              value={chain.id}
              isDisabled={isDisabled(chain)}
              onClick={() => {
                handleSelect(chain.id);
              }}
            >
                <Image
                  src={chain.logoPath}
                  alt={chain.id}
                  mr="2"
                  w="16px"
                  h="16px"
                />
                <Text>{chain.displayName}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};
