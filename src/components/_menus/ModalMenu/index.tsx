import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps
} from '@chakra-ui/react'
import { useState, VFC } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Token, tokenConfig } from './tokenConfig'

export const ModalMenu: VFC = () => {
  const [value, setValue] = useState<Token>()

  return (
    //@ts-ignore using string where number is expected. This is to ensure popover is always placed at the top of button, no matter the height value.
    <Menu offset={[0, '100%']} placement='bottom' matchWidth>
      <MenuButton
        as={Box}
        p={4}
        justifyContent='space-between'
        w='100%'
        bg='transparentPurple'
        border='none'
        borderRadius={16}
        appearance='none'
        textAlign='start'
        css={{
          'span:first-child': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }}
      >
        {value ? (
          <HStack>
            {value.icon} <span>{value.symbol}</span>
          </HStack>
        ) : (
          'Select deposit asset'
        )}
        <Icon as={FaChevronDown} />
      </MenuButton>
      <MenuList
        px={1}
        bg='black'
        borderColor='burntPink'
        borderRadius={16}
        zIndex='overlay'
      >
        <MenuOptionGroup defaultValue={tokenConfig[0].symbol} type='radio'>
          {tokenConfig.map(token => {
            const { address, icon, symbol } = token
            return (
              <MenuItemOption
                key={address}
                value={symbol}
                borderRadius={8}
                _hover={{ bg: 'rgba(96, 80, 155, 0.4)' }}
                onClick={() => setValue(token)}
              >
                <HStack>
                  {icon}
                  <span>{symbol}</span>
                </HStack>
              </MenuItemOption>
            )
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
