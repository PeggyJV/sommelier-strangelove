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
} from "@chakra-ui/react"

interface Campaign {
  name: string
  sommStaking: string
  vaultUsage: string
  status: string
}

const campaigns: Campaign[] = [
  {
    name: "Redstone Points",
    sommStaking: "Points Multiplier; Minimum 1000 SOMM",
    vaultUsage: "RYE on Arbitrum",
    status: "Active",
  },
  {
    name: "Ethos",
    sommStaking: "Minimum 500 SOMM",
    vaultUsage: "N/A",
    status: "Active",
  },
]

const CampaignTable: React.FC = () => {
  // Dynamically adjust column visibility and table sizing
  const isVaultUsageVisible = useBreakpointValue({
    base: false,
    md: true,
  })
  const tableSize = useBreakpointValue({ base: "sm", md: "md" })
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" })

  return (
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
                      campaign.name === "Redstone Points"
                        ? "/assets/icons/redstone.png"
                        : "/assets/icons/ethos.png"
                    }
                    boxSize="16px" // Smaller icons for compact view
                    alt={`${campaign.name} Logo`}
                  />
                  <Text>{campaign.name}</Text>
                </HStack>
              </Td>
              <Td fontSize={fontSize}>
                <Link
                  href="https://www.sommelier.finance/staking"
                  isExternal
                  color="white.500"
                  textDecoration="underline"
                >
                  {campaign.sommStaking}
                </Link>
              </Td>
              {isVaultUsageVisible && (
                <Td fontSize={fontSize}>
                  {campaign.vaultUsage === "N/A" ? (
                    <Link
                      href="https://app.sommelier.finance/"
                      isExternal
                      color="white.500"
                      textDecoration="underline"
                    >
                      {campaign.vaultUsage}
                    </Link>
                  ) : (
                    <Link
                      href={
                        campaign.vaultUsage === "RYE on Arbitrum"
                          ? "https://app.sommelier.finance/strategies/real-yield-eth-arb/manage"
                          : "https://www.sommelier.finance/"
                      }
                      isExternal
                      color="white.500"
                      textDecoration="underline"
                    >
                      {campaign.vaultUsage}
                    </Link>
                  )}
                </Td>
              )}
              <Td fontSize={fontSize}>{campaign.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CampaignTable
