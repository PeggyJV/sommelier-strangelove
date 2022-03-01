import {
  HStack,
  Icon,
  Img,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack
} from '@chakra-ui/react'
import Link from 'components/Link'
import { links } from './links'
import { BsCircleFill, BsDiamondFill, BsFillSquareFill } from 'react-icons/bs'
import { Card } from 'components/_cards/Card'

export const SideNav = () => {
  return (
    <VStack
      as='nav'
      px={6}
      py={8}
      align='flex-start'
      borderRight='2px solid'
      borderColor='violentViolet'
    >
      <Link href='/' w='100%'>
        <HStack pb={6} borderBottom='2px solid' borderColor='violentViolet'>
          <Img src='/placeholders/logomark.png' boxSize={10} />
          <Text
            fontSize='lg'
            fontWeight='bold'
            fontFamily='brand'
            textTransform='uppercase'
          >
            Sommelier
          </Text>
        </HStack>
      </Link>
      <List fontFamily='brand' pb={16}>
        {links.map((link, i) => {
          const { href, title } = link
          return (
            <Link key={i} href={href}>
              <ListItem>
                <ListIcon as={BsDiamondFill} color='electricIndigo.400' />
                {title}
              </ListItem>
            </Link>
          )
        })}
      </List>
      <Card minW='28ch' bg='violentViolet'>
        <VStack align='flex-start'>
          <Text fontFamily='brand'>Join Our Community</Text>
          <Text pb={6}>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur.
          </Text>
          <HStack spacing={6}>
            <Icon as={BsFillSquareFill} boxSize={6} color='brilliantRose.500' />
            <Icon as={BsCircleFill} boxSize={6} color='deepSkyBlue.400' />
            <Icon as={BsDiamondFill} boxSize={6} color='electricIndigo.400' />
          </HStack>
        </VStack>
      </Card>
    </VStack>
  )
}
