import { LinkProps as ChLinkProps } from '@chakra-ui/react'
import Url from './Url'

interface LinkProps extends Omit<ChLinkProps, 'href'> {
  href?: Url
}

export default LinkProps
