import React from "react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Image,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
  Tooltip,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import { InfoBanner } from "components/_banners/InfoBanner"

interface Campaign {
  name: string
  sommStaking: string
  vaultUsage: string
  status: string
}

const campaigns: Campaign[] = [
  {
    name: "RedStone RSG Points",
    sommStaking: "Yes, Bonus Multiplier (min 750 SOMM)",
    vaultUsage: "Real Yield ETH on Arbitrum (new deposits)", // Original data placeholder
    status: "Active", // Now using "Active" instead of specific dates
  },
]

const CampaignTable: React.FC = () => {
  const isVaultUsageVisible = useBreakpointValue({
    base: true,
    md: true,
  })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" })

  return (
    <VStack spacing={4} align="stretch">
      <InfoBanner text="Details of upcoming campaigns are coming soon." />
      <TableContainer>
        <Table variant="simple" size={tableSize}>
          <Thead>
            <Tr>
              <Th fontSize={fontSize}>Campaign</Th>
              <Th fontSize={fontSize}>SOMM Staking</Th>
              {isVaultUsageVisible && (
                <Th fontSize={fontSize}>Vault Usage</Th>
              )}
              <Th fontSize={fontSize}>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.map((campaign, index) => (
              <Tr key={index}>
                <Td fontSize={fontSize}>
                  <HStack spacing="10px">
                    <Image
                      src={
                        campaign.name === "RedStone RSG Points"
                          ? "/assets/icons/redstone.png"
                          : "/assets/icons/default.png" // Adjust as needed
                      }
                      boxSize="16px"
                      alt={`${campaign.name} Logo`}
                    />
                    <Text>{campaign.name}</Text>
                  </HStack>
                </Td>
                <Td fontSize={fontSize}>
                  <Tooltip
                    hasArrow
                    label="Minimum of 750 SOMM"
                    placement="top"
                    arrowShadowColor="purple.base"
                    color="neutral.300"
                    bg="surface.bg"
                  >
                    <HStack>
                      <Link
                        href="https://www.sommelier.finance/staking"
                        isExternal
                        color="white.500"
                        textDecoration="underline"
                      >
                        Optional; Bonus Multiplier
                      </Link>
                      <InformationIcon
                        color="neutral.300"
                        boxSize={3}
                      />
                    </HStack>
                  </Tooltip>
                </Td>
                {isVaultUsageVisible && (
                  <Td fontSize={fontSize}>
                    <Tooltip
                      label="New deposits during campaign only"
                      hasArrow
                      placement="top"
                      arrowShadowColor="purple.base"
                      color="neutral.300"
                      bg="surface.bg"
                    >
                      <HStack>
                        <Link
                          href="https://app.sommelier.finance/strategies/real-yield-eth-arb/manage"
                          isExternal
                          color="white.500"
                          textDecoration="underline"
                        >
                          Mandatory; Arbitrum Real Yield ETH
                        </Link>
                        <InformationIcon
                          color="neutral.300"
                          boxSize={3}
                        />
                      </HStack>
                    </Tooltip>
                  </Td>
                )}
                <Td fontSize={fontSize}>
      
                    <HStack>
                      <Text>Completed</Text>
                    </HStack>
   
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

export default CampaignTable
