import { VFC } from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableProps,
  Flex,
  Tooltip,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { InlineImage } from "components/InlineImage"
import { ExternalLinkIcon, InformationIcon } from "components/_icons"
import { Link } from "components/Link"
import { InnerCard } from "./InnerCard"

interface BondingTableCardProps extends TableProps {
  data?: any
}

interface BondingPeriod {
  bondingPeriod: "7 Days" | "14 Days" | "21 Days"
  amount: number
  value: 1.1 | 1.25 | 1.5
  checked?: boolean
  canUnbond: boolean
}

const placeholderData: BondingPeriod[] = [
  {
    bondingPeriod: "14 Days",
    amount: 20.01,
    value: 1.25,
    canUnbond: false,
  },
  {
    bondingPeriod: "7 Days",
    amount: 63.99,
    value: 1.1,
    canUnbond: true,
  },
  {
    bondingPeriod: "21 Days",
    amount: 40,
    value: 1.5,
    canUnbond: false,
  },
]

const formatTrancheNumber = (number: number): string => {
  if (number < 10) {
    const modifiedNumber = number.toString().padStart(2, "0")

    return modifiedNumber
  }

  return number.toString()
}

const BondingTableCard: VFC<BondingTableCardProps> = ({
  data,
  ...rest
}) => {
  return (
    <InnerCard pb={6}>
      <TableContainer>
        <Heading fontSize="lg" pl={6} py={4}>
          Active Bonds
        </Heading>
        <Table variant="unstyled" {...rest}>
          <Thead>
            <Tr color="neutral.300">
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Tranche
              </Th>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
                placement="top"
                bg="surface.bg"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text as="span">LP Tokens</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                Period
              </Th>
              <Tooltip
                hasArrow
                arrowShadowColor="purple.base"
                label="Amount of SOMM earned and available to be claimed"
                placement="top"
                bg="surface.bg"
              >
                <Th
                  fontSize={10}
                  fontWeight="normal"
                  textTransform="capitalize"
                >
                  <HStack spacing={1} align="center">
                    <Text as="span">Reward Multiplier</Text>
                    <InformationIcon
                      color="neutral.300"
                      boxSize={3}
                    />
                  </HStack>
                </Th>
              </Tooltip>
              <Th />
            </Tr>
          </Thead>
          <Tbody fontWeight="bold">
            {placeholderData.map((data, i) => {
              const { amount, bondingPeriod, value, canUnbond } = data
              return (
                <Tr
                  key={i}
                  _hover={{
                    bg: "surface.secondary",
                    "td:first-of-type": {
                      borderRadius: "32px 0 0 32px",
                      overflow: "hidden",
                    },
                    "td:last-of-type": {
                      borderRadius: "0 32px 32px 0",
                      overflow: "hidden",
                    },
                  }}
                  _last={{
                    border: "none",
                  }}
                >
                  <Td>#{formatTrancheNumber(i + 1)}</Td>
                  <Td>
                    <Flex align="center">
                      <InlineImage
                        src="/assets/icons/aave.png"
                        alt="Aave logo"
                        boxSize={5}
                      />{" "}
                      {amount.toFixed(2)}
                    </Flex>
                  </Td>
                  <Td>{bondingPeriod}</Td>
                  <Td>{value}x</Td>
                  <Td fontWeight="normal">
                    <Flex justify="flex-end">
                      <HStack spacing={6} minW={230}>
                        <Link
                          href="https://wallet.keplr.app/#/dashboard" // TODO: update this href to point to tx
                          isExternal
                          display="flex"
                          alignItems="center"
                          _hover={{
                            textDecor: "underline",
                          }}
                        >
                          <Text as="span">View on Keplr</Text>
                          <ExternalLinkIcon
                            ml={2}
                            color="purple.base"
                          />
                        </Link>
                        {canUnbond && (
                          <SecondaryButton
                            size="sm"
                            onClick={() =>
                              window.alert(
                                `You've bonded for ${bondingPeriod}. You earned at a rate of ${value}x.`
                              )
                            }
                          >
                            Unbond
                          </SecondaryButton>
                        )}
                      </HStack>
                    </Flex>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </InnerCard>
  )
}

export default BondingTableCard
