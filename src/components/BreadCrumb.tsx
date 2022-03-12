import React, { VFC } from 'react'
import {
  Breadcrumb as ChBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbProps
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const BreadCrumb: VFC<BreadcrumbProps> = props => {
  const router = useRouter()
  const asPathWithoutQuery = router.asPath.split('?')[0]
  const asPathNestedRoutes = asPathWithoutQuery
    .split('/')
    .filter(v => v.length > 0)

  return (
    <ChBreadcrumb {...props}>
      {asPathNestedRoutes.map((path, i) => {
        const hrefSlices = asPathNestedRoutes.slice(0, i + 1)
        const hrefMap = hrefSlices.map(path => `/${path}`)
        const href = hrefMap.join('')

        const currentPage = href === router.asPath

        return (
          <BreadcrumbItem
            key={i}
            isCurrentPage={currentPage}
            color={currentPage ? 'text.body.lightMuted' : 'text.body.light'}
          >
            <BreadcrumbLink href={href}>{path}</BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </ChBreadcrumb>
  )
}
