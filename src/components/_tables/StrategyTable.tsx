import {
  Flex,
  Icon,
  Table,
  TableCellProps,
  TableContainer,
  TableRowProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { memo, FC } from "react"
import { useTable, useSortBy } from "react-table"
import { SortingArrowIcon } from "components/_icons/SortingArrowIcon"
import { AllStrategiesData } from "data/actions/types"
import { isComingSoon } from "utils/isComingSoon"
import Link from "next/link"

interface BorderTrProps extends TableRowProps {
  slug: string
  name: string
}

export const BorderTr: FC<BorderTrProps> = ({
  slug,
  name,
  ...props
}) => {
  return (
    <Tr
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
      _hover={{
        bg: "surface.secondary",
      }}
      cursor="pointer"
      {...props}
    />
  )
}

export const HeroTr: FC<BorderTrProps> = ({
  slug,
  name,
  ...props
}) => {
  return (
    <Tr
      _hover={{
        backgroundImage: "url('/assets/images/waves-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      sx={{
        padding: "10px",
        fontSize: "40px",
        border: "2.5px solid",
        borderColor: "purple.base",
        borderRadius: "10px",
        height: "200px",
        backgroundImage: "url('/assets/images/waves-bg-simple.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: "0 0 15px 5px rgba(147, 51, 234, 0.3)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 0 20px 8px rgba(147, 51, 234, 0.5)",
        },
        "@media (max-width: 768px)": {
          backgroundImage: "url('/assets/images/waves-bg.svg')",
        },
      }}
      cursor="pointer"
      {...props}
    />
  )
}

export const BorderTd: FC<TableCellProps & { href: string }> = ({
  href,
  ...props
}) => {
  return (
    <Td py={7}>
      <Link
        href={href}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        {props.children}
      </Link>
    </Td>
  )
}

export interface StrategyTableProps {
  data: AllStrategiesData
  columns: any
}

export const StrategyTable = memo(
  ({ columns, data }: StrategyTableProps) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null
    }

    StrategyTable.displayName = "StrategyTable"

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable<any>(
      {
        columns,
        data,
      },
      useSortBy
    )
    return (
      <TableContainer
        borderColor="surface.secondary"
        borderWidth={1}
        rounded="xl"
      >
        <Table
          {...getTableProps()}
          variant="unstyled"
          sx={{
            borderCollapse: "collapse",
          }}
          rounded="lg"
        >
          <Thead border="none" color="neutral.400">
            {headerGroups.map((headerGroup, index) => (
              <Tr
                {...headerGroup.getHeaderGroupProps()}
                key={index}
                bg="surface.primary"
                borderBottom="1px solid"
                borderColor="surface.secondary"
              >
                {headerGroup.headers.map((column: any, index) => {
                  return column.canSort ? (
                    <Th
                      {...column.getHeaderProps(
                        column.getSortByToggleProps()
                      )}
                      userSelect="none"
                      textTransform="unset"
                      key={index}
                    >
                      <Flex
                        alignItems="center"
                        gap={2}
                        justifyContent="end"
                      >
                        {column.render("Header")}
                        <Icon as={SortingArrowIcon} boxSize={3} />
                      </Flex>
                    </Th>
                  ) : (
                    <Th
                      {...column.getHeaderProps()}
                      userSelect="none"
                      textTransform="unset"
                      key={index}
                      maxW={1}
                    >
                      {column.render("Header")}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody
            backgroundColor="surface.primary"
            {...getTableBodyProps()}
          >
            {rows.map((row, indexRow) => {
              prepareRow(row)

              const countdown = isComingSoon(row.original.launchDate)
              const href = countdown
                ? "strategies/" + row.original.slug
                : "strategies/" + row.original.slug + "/manage"

              if (row.original.isHero) {
                return (
                  <HeroTr
                    slug={href}
                    name={row.original.name}
                    key={indexRow}
                  >
                    {row.cells.map((cell, indexData) => {
                      return (
                        <BorderTd
                          {...cell.getCellProps()}
                          key={indexData}
                          href={href}
                        >
                          {cell.render("Cell")}
                        </BorderTd>
                      )
                    })}
                  </HeroTr>
                )
              }
              return (
                <BorderTr
                  opacity={row.original.deprecated ? 0.5 : 1}
                  {...row.getRowProps()}
                  key={indexRow}
                  slug={href}
                  name={row.original.name}
                >
                  {row.cells.map((cell, indexData) => {
                    return (
                      <BorderTd
                        {...cell.getCellProps()}
                        key={indexData}
                        href={href}
                      >
                        {cell.render("Cell")}
                      </BorderTd>
                    )
                  })}
                </BorderTr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }
)
