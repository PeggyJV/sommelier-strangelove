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
  Image, // Import the Image component
  HStack, // To stack image and text horizontally
  Text, // Import Text component for explicit text rendering
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
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Campaign</Th>
            <Th>SOMM Staking</Th>
            <Th>Vault Usage</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {campaigns.map((campaign, index) => (
            <Tr key={index}>
              <Td>
                <HStack spacing="10px">
                  {campaign.name === "Redstone Points" && (
                    <Image
                      src="/assets/icons/redstone.png"
                      boxSize="20px"
                      alt="Redstone Logo"
                    />
                  )}
                  {campaign.name === "Ethos" && (
                    <Image
                      src="/assets/icons/ethos.png" // Make sure the path is correct
                      boxSize="20px"
                      alt="Ethos Logo"
                    />
                  )}
                  <Text>{campaign.name}</Text>
                </HStack>
              </Td>
              <Td>
                {campaign.sommStaking.includes("1000 SOMM") ||
                campaign.sommStaking.includes("500 SOMM") ? (
                  <Link
                    href="https://www.sommelier.finance/staking"
                    isExternal
                    color="white"
                    textDecoration="underline"
                  >
                    {campaign.sommStaking}
                  </Link>
                ) : (
                  campaign.sommStaking
                )}
              </Td>
              <Td>
                {campaign.vaultUsage === "RYE on Arbitrum" ? (
                  <Link
                    href="https://app.sommelier.finance/strategies/real-yield-eth-arb/manage"
                    isExternal
                    color="white"
                    textDecoration="underline"
                  >
                    {campaign.vaultUsage}
                  </Link>
                ) : (
                  <Link
                    href="https://www.sommelier.finance/"
                    isExternal
                    color="white"
                    textDecoration="underline"
                  >
                    {campaign.vaultUsage}
                  </Link>
                )}
              </Td>
              <Td>{campaign.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CampaignTable
