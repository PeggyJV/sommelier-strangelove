import { VFC } from "react"
import {
  Breadcrumb as ChBreadcrumb,
  BreadcrumbItem,
  BreadcrumbProps,
} from "@chakra-ui/react"
import { ArrowLeftIcon, ChevronRightIcon } from "./_icons"
import { Link } from "./Link"

interface CustomBCProps extends BreadcrumbProps {
  id: string
  cellarName?: string
}

export const BreadCrumb: VFC<CustomBCProps> = ({
  id,
  cellarName,
  ...rest
}) => {
  // const router = useRouter()
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
        <Link
          href="/"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={3}
        >
          <ArrowLeftIcon />
          Back
        </Link>
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
