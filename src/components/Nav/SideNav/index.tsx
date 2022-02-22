import { HStack, Icon, Img, Text, VStack } from '@chakra-ui/react'
import Link from 'components/Link'
import { links } from './links'
import { BsCircleFill, BsFillSquareFill } from 'react-icons/bs'

export const SideNav = () => {
  return (
    <VStack
      as='nav'
      px={6}
      py={8}
      align='flex-start'
      borderRight='2px solid'
      borderColor='gray.200'
      fontFamily='mono'
    >
      <Link href='/'>
        <VStack pb={6} align='flex-start'>
          <Img src='/placeholders/sommelier.svg' boxSize={10} />
          <Text
            fontSize='lg'
            fontWeight='bold'
            fontFamily='brand'
            textTransform='uppercase'
          >
            Sommelier
          </Text>
        </VStack>
      </Link>
      <VStack pb={16} align='flex-start'>
        {links.map((link, i) => {
          const { href, title } = link
          return (
            <Link key={i} href={href}>
              <Icon as={BsCircleFill} mr={2} /> {title}
            </Link>
          )
        })}
      </VStack>
      <VStack align='flex-start'>
        <Text>
          Join Our <br /> Community
        </Text>
        <HStack>
          <Icon as={BsFillSquareFill} boxSize={6} />
          <Icon as={BsFillSquareFill} boxSize={6} />
          <Icon as={BsFillSquareFill} boxSize={6} />
          <Icon as={BsFillSquareFill} boxSize={6} />
        </HStack>
      </VStack>
    </VStack>
  )
}
