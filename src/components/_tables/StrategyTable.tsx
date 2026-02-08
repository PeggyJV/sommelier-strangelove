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
import { memo, FC, type ReactNode } from "react"
import { useTable, useSortBy } from "react-table"
import { SortingArrowIcon } from "components/_icons/SortingArrowIcon"
import { isComingSoon } from "utils/isComingSoon"
import { useRouter } from "next/router"

interface BorderTrProps extends TableRowProps {
  slug: string
  name: string
}

export const BorderTr: FC<BorderTrProps> = ({
  slug,
  name,
  ...props
}) => {
  const router = useRouter()
  return (
    <Tr
      tabIndex={0}
      role="link"
      aria-label={`Open ${name}`}
      _notLast={{
        borderBottom: "1px solid",
        borderColor: "surface.secondary",
      }}
      _hover={{
        bg: "surface.secondary",
      }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "purple.base",
        outlineOffset: "2px",
      }}
      cursor="pointer"
      onClick={() => {
        router.push(slug)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          router.push(slug)
        }
      }}
      {...props}
    />
  )
}

export const HeroTr: FC<BorderTrProps> = ({
  slug,
  name,
  ...props
}) => {
  const router = useRouter()
  return (
    <Tr
      tabIndex={0}
      role="link"
      aria-label={`Open ${name}`}
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
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "purple.base",
        outlineOffset: "2px",
      }}
      onClick={() => {
        router.push(slug)
      }}
      cursor="pointer"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          router.push(slug)
        }
      }}
      {...props}
    />
  )
}

export const BorderTd: FC<TableCellProps & { href: string }> = ({
  href: _href,
  ...props
}) => {
  return (
    <Td py={7} {...props}>
      {props.children}
    </Td>
  )
}

export interface StrategyTableProps {
  data: unknown[]
  columns: unknown[]
  showHeader?: boolean
}

type TableRowShape = {
  slug?: string
  name?: string
  launchDate?: string | number
  deprecated?: boolean
  isHero?: boolean
  isSommNative?: boolean
  [key: string]: unknown
}

export const StrategyTable = memo(
  ({ columns, data, showHeader = true }: StrategyTableProps) => {
    StrategyTable.displayName = "StrategyTable"

    const safeData = (
      data && Array.isArray(data) ? data : []
    ).filter(Boolean) as Record<string, unknown>[]

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable<Record<string, unknown>>(
      {
        columns: columns as never,
        data: safeData,
      },
      useSortBy
    )

    if (!data || !Array.isArray(data) || data.length === 0) {
      return null
    }

    return (
      <TableContainer
        borderColor="surface.secondary"
        borderWidth={1}
        rounded="xl"
        // Ensure any button glow/outline is not cut off vertically on mobile
        overflow="visible"
      >
        <Table
          {...getTableProps()}
          variant="unstyled"
          sx={{
            borderCollapse: "collapse",
            // On mobile, show only the first column (which renders the full card)
            // to avoid squeezing and clipping action buttons inside complex cells.
            // Preserve tablet/desktop layouts unchanged.
            "@media (max-width: 768px)": {
              "thead th:nth-of-type(n+2)": { display: "none" },
              "tbody td:nth-of-type(n+2)": { display: "none" },
              // Make rows and cells block-level so the first cell can span full width
              "tbody tr": { display: "block", width: "100%" },
              "tbody td": { display: "block", width: "100%" },
            },
            // Let rows/cells render visual effects outside cell bounds
            "tbody tr": { overflow: "visible" },
            "tbody td": { overflow: "visible" },
          }}
          rounded="lg"
        >
          {showHeader && (
            <Thead border="none" color="neutral.400">
              {headerGroups.map((headerGroup, index) => (
                <Tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                  bg="surface.primary"
                  borderBottom="1px solid"
                  borderColor="surface.secondary"
                >
                  {headerGroup.headers.map((column, index) => {
                    const sortableColumn = column as unknown as {
                      canSort?: boolean
                      getHeaderProps: (
                        props?: unknown
                      ) => Record<string, unknown>
                      getSortByToggleProps: () => unknown
                      render: (type: "Header" | "Cell") => ReactNode
                    }
                    return sortableColumn.canSort ? (
                      <Th
                        {...sortableColumn.getHeaderProps(
                          sortableColumn.getSortByToggleProps()
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
                          {sortableColumn.render("Header")}
                          <Icon
                            as={SortingArrowIcon}
                            boxSize={3}
                            opacity={0.5}
                            cursor="default"
                          />
                        </Flex>
                      </Th>
                    ) : (
                      <Th
                        {...sortableColumn.getHeaderProps()}
                        userSelect="none"
                        textTransform="unset"
                        key={index}
                        maxW={1}
                      >
                        {sortableColumn.render("Header")}
                      </Th>
                    )
                  })}
                </Tr>
              ))}
            </Thead>
          )}
          <Tbody
            backgroundColor="surface.primary"
            {...getTableBodyProps()}
          >
            {rows.map((row, indexRow) => {
              prepareRow(row)
              const rowOriginal = row.original as unknown as TableRowShape

              const launchDate = rowOriginal.launchDate
                ? new Date(rowOriginal.launchDate)
                : undefined
              const countdown = isComingSoon(launchDate)
              const href = countdown
                ? "strategies/" + rowOriginal.slug
                : "strategies/" + rowOriginal.slug + "/manage"

              if (rowOriginal.isHero) {
                return (
                  <HeroTr
                    slug={href}
                    name={rowOriginal.name ?? "Vault"}
                    key={indexRow}
                  >
                    {(() => {
                      const totalColumns =
                        headerGroups?.[0]?.headers?.length ??
                        row.cells.length
                      const isSomm = Boolean(
                        rowOriginal?.isSommNative
                      )
                      return row.cells.map((cell, indexData) => {
                        const isFirst = cell.column.id === "name"
                        if (isSomm && !isFirst) return null
                        const colSpan =
                          isSomm && isFirst ? totalColumns : 1
                        return (
                          <BorderTd
                            {...cell.getCellProps({
                              colSpan,
                            } as Record<string, unknown>)}
                            key={indexData}
                            href={href}
                          >
                            {cell.render("Cell")}
                          </BorderTd>
                        )
                      })
                    })()}
                  </HeroTr>
                )
              }
              return (
                <BorderTr
                  opacity={rowOriginal.deprecated ? 0.5 : 1}
                  {...row.getRowProps()}
                  key={indexRow}
                  slug={href}
                  name={rowOriginal.name ?? "Vault"}
                >
                  {(() => {
                    const totalColumns =
                      headerGroups?.[0]?.headers?.length ??
                      row.cells.length
                    const isSomm = Boolean(rowOriginal?.isSommNative)
                    return row.cells.map((cell, indexData) => {
                      const isFirst = cell.column.id === "name"
                      if (isSomm && !isFirst) return null
                      const colSpan =
                        isSomm && isFirst ? totalColumns : 1
                      return (
                        <BorderTd
                          {...cell.getCellProps({
                            colSpan,
                          } as Record<string, unknown>)}
                          key={indexData}
                          href={href}
                        >
                          {cell.render("Cell")}
                        </BorderTd>
                      )
                    })
                  })()}
                </BorderTr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }
)
