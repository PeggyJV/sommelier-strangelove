---
to: src/pages/<%= name %>.tsx
---

import type { NextPage } from 'next'
import { Page<%= Name %> } from 'components/_pages/Page<%= Name %>'

const <%= Name %>: NextPage = () => {
  return <Page<%= Name %> />
}

export default <%= Name %>
