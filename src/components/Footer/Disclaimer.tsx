import { VFC } from "react"
import { Box, Flex, FlexProps, Text } from "@chakra-ui/react"

export const Disclaimer: VFC<FlexProps> = (props) => {
  return (
    <Flex {...props}>
      <Box marginTop="98px" color="neutral.300" fontSize="xs">
        <Text marginBottom="1rem">
          This website does not constitute an offer to sell or a
          solicitation of interest to purchase any securities in any
          country or jurisdiction in which such offer or solicitation
          is not permitted by law. Nothing on this website is meant to
          be construed as investment advice and we do not provide
          investment advisory services, nor are we regulated or
          permitted to do so. This website is provided for convenience
          only. Sommelier does not manage any portfolios. You must
          make an independent judgment as to whether to add liquidity
          to portfolios.
        </Text>
        <Text marginBottom="1rem">
          Users of the Sommelier website should familiarize themselves
          with smart contracts to further consider the risks
          associated with smart contracts before adding liquidity to
          any portfolios.
        </Text>
        <Text marginBottom="1.5rem">
          Note that the website may change, and we are under no
          obligation to update or advise as to these changes. There is
          no guarantee that the Sommelier Mainnet, including any
          software, products or token use cases mentioned on the
          website, will be built, or offered by Sommelier. In
          particular, actual results and developments may be
          materially different from any forecast, opinion or
          expectation expressed in this website, or documents
          contained in it, and the past performance of any portfolio
          must not be relied on as a guide to its future performance.
        </Text>
        <Text>
          To the extent permitted by law, the company and its
          directors, officers, employees, agents exclude all liability
          for any loss or damage arising from the use of, or reliance
          on, the material contained on this website whether or not
          caused by a negligent act or omission. The release,
          publication or distribution of this website and any
          materials herein may be restricted in some jurisdiction and
          therefore you must inform yourself of and observe any such
          restrictions.
        </Text>
      </Box>
    </Flex>
  )
}
