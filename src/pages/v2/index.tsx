import { Avatar, AvatarGroup, Heading, Text } from "@chakra-ui/react"
import { PercentageText } from "components/PercentageText"
import { Layout } from "components/_layout/Layout"
import { StrategySection } from "components/_tables/StrategySection"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { tokenConfig } from "data/tokenConfig"
import type { NextPage } from "next"
import { CellValue } from "react-table"
import { protocolsImage } from "utils/protocolsImagePath"

const Home: NextPage = () => {
  const { data } = useAllStrategiesData()
  const getTradedAssets = (item: string) => {
    const asset = tokenConfig.find((v) => v.symbol === item)
    return asset
  }
  console.log(data)
  const getProtocols = (protocols: string) => {
    return {
      title: protocols,
      icon: protocolsImage[protocols],
    }
  }

  const columns = [
    {
      Header: "Strategy",
      accessor: "name",
      Cell: ({ row }: any) => {
        return (
          <StrategySection
            icon={row.original.logo}
            title={row.original.name}
            provider={row.original.provider.title}
            type={row.original.type}
          />
        )
      },
    },
    {
      Header: "Protocol",
      accessor: "protocols",
      Cell: ({ cell: { value } }: CellValue) => {
        const protocols = typeof value === "string" ? [value] : value
        return (
          <AvatarGroup size="sm" max={3}>
            {protocols.map((protocol: string) => {
              const data = getProtocols(protocol)
              return (
                <Avatar
                  name={data.title}
                  src={data.icon}
                  key={data.title}
                  bgColor="white"
                />
              )
            })}
          </AvatarGroup>
        )
      },
    },
    {
      Header: "Assets",
      accessor: "tradedAssets",
      Cell: ({ cell: { value } }: CellValue) => {
        const assets = value?.map((v: any) => v.symbol)
        if (!assets)
          return (
            <Text fontWeight={600} fontSize="12px">
              --
            </Text>
          )
        return (
          <AvatarGroup size="sm" max={3}>
            {assets?.map((asset: string) => {
              const data = getTradedAssets(asset)
              return (
                <Avatar
                  name={data?.symbol}
                  src={data?.src}
                  key={data?.symbol}
                />
              )
            })}
          </AvatarGroup>
        )
      },
    },
    {
      Header: "TVM",
      accessor: "tvm.formatted",
      Cell: ({ cell: { value } }: CellValue) => (
        <Text fontWeight={600} fontSize="12px">
          {value}
        </Text>
      ),
    },
    {
      Header: "Base APY",
      accessor: "baseApy",
      Cell: ({ cell: { value } }: CellValue) => (
        <Text fontWeight={600} fontSize="12px">
          {value?.formatted || "--"}
        </Text>
      ),
    },
    {
      Header: "1D",
      accessor: "changes.daily",
      Cell: ({ cell: { value } }: CellValue) => (
        <PercentageText data={value} arrow fontWeight={500} />
      ),
    },
  ]
  return (
    <Layout>
      <Heading fontSize="1.3125rem" mb="1.6rem">
        Strategies
      </Heading>
      {data ? (
        <StrategyTable columns={columns} data={data} />
      ) : (
        "loading..."
      )}
    </Layout>
  )
}

export default Home
