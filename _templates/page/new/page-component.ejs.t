---
to: src/components/_pages/Page<%= Name %>/index.tsx
---

import { Box } from '@chakra-ui/react'
import { Layout } from 'components/Layout'

export const Page<%= Name %>: React.FC = () => {
  return (
    <Layout>
      <Box>Page<%= Name %></Box>
    </Layout>
  )
}
