import React, { ReactElement } from 'react'

import links from './links'

import { Grid } from '@chakra-ui/react'
import Link from 'components/Link'

const NavLinks = (): ReactElement => {
  return (
    <Grid>
      {links.map((link, i) => {
        const { href, title } = link
        return (
          <Link key={i} href={href}>
            {title}
          </Link>
        )
      })}
    </Grid>
  )
}

export default NavLinks
