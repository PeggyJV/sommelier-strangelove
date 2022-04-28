import { VFC } from "react"
import {
  Breadcrumb as ChBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbProps,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ChevronRightIcon } from "./_icons"

interface CustomBCProps extends BreadcrumbProps {
  cellarName?: string
}

export const BreadCrumb: VFC<CustomBCProps> = ({
  cellarName,
  ...rest
}) => {
  const router = useRouter()
  // const asPathWithoutQuery = router.asPath.split("?")[0]
  // const asPathNestedRoutes = asPathWithoutQuery
  //   .split("/")
  //   .filter((v) => v.length > 0)

  return (
    <ChBreadcrumb
      separator={<ChevronRightIcon boxSize={3} color="white" />}
      {...rest}
    >
      <BreadcrumbItem color="text.body.lightMuted">
        <BreadcrumbLink href="/">Overview</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          isCurrentPage
          href={`/cellars/${router.query.id}`}
        >
          {cellarName}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {/* {asPathNestedRoutes.map((path, i) => {
        const hrefSlices = asPathNestedRoutes.slice(0, i + 1)
        const hrefMap = hrefSlices.map((path) => `/${path}`)
        const href = hrefMap.join("")
        const currentPage = href === router.asPath
        const color = currentPage
          ? "text.body.light"
          : "text.body.lightMuted"

        return (
          <BreadcrumbItem
            key={i}
            isCurrentPage={currentPage}
            color={color}
          >
            <BreadcrumbLink href={href}>{path}</BreadcrumbLink>
          </BreadcrumbItem>
        )
      })} */}
    </ChBreadcrumb>
  )
}
