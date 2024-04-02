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
  VStack, // Importing VStack for vertical stacking
} from "@chakra-ui/react"
// Import InfoBanner
import { InfoBanner } from "components/_banners/InfoBanner"

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
            {/* Commenting out the campaigns mapping as details are not confirmed yet */}
            {/* {campaigns.map((campaign, index) => (
              <Tr key={index}>
                <Td fontSize={fontSize}>
                  <HStack spacing="10px">
                    <Image
                      src={
                        campaign.name === "Redstone Points"
                          ? "/assets/icons/redstone.png"
                          : "/assets/icons/ethos.png"
                      }
                      boxSize="16px"
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
            ))} */}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

export default CampaignTable
