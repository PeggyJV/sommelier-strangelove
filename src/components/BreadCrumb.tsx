import { VFC } from "react"
import {
  Breadcrumb as ChBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbProps,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ArrowLeftIcon, ChevronRightIcon } from "./_icons"

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
      separator={
        <ChevronRightIcon boxSize={3} color="neautral.300" />
      }
      {...rest}
    >
      <BreadcrumbItem color="neutral.300">
        <BreadcrumbLink
          href="/"
          width="14rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <ArrowLeftIcon /> Back to Strategies Overview
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* {asPathNestedRoutes.map((path, i) => {
        const hrefSlices = asPathNestedRoutes.slice(0, i + 1)
        const hrefMap = hrefSlices.map((path) => `/${path}`)
        const href = hrefMap.join("")
        const currentPage = href === router.asPath
        const color = currentPage
          ? "neutral.100"
          : "neutral.400"

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
