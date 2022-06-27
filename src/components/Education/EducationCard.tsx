import { Flex, Heading, Img, Text, FlexProps } from "@chakra-ui/react"
import { Link } from "components/Link"
import { EduItem } from "./types"
import { imageStyles } from "./imageStyles"
import { ExternalLinkIcon } from "components/_icons"

type Props = EduItem & FlexProps

export const EducationCard: React.FC<Props> = ({
  title,
  url,
  variant,
  ...rest
}) => {
  return (
    <Link href={url} isExternal role="group">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius={24}
        height="96px"
        boxShadow="0 0 0 1px rgba(78, 56, 156, 0.16)"
        padding="0 1rem"
        position="relative"
        overflow="hidden"
        boxSizing="border-box"
        backgroundColor="surface.primary"
        _hover={{
          backgroundColor: "surface.tertiary",
          boxShadow: "0 0 0 2px #6C4ED9",
        }}
        {...rest}
      >
        <Img
          src="assets/images/burst.png"
          position="absolute"
          width="160px"
          zIndex="1"
          {...imageStyles[variant]}
        />
        <Heading as="h3" size="sm" zIndex="2" fontWeight="bold">
          {title}
        </Heading>
        <Text
          fontSize="0.75rem"
          zIndex="2"
          fontWeight="bold"
          textDecor="underline"
        >
          Read more
          <ExternalLinkIcon
            color="purple.base"
            ml="8px"
            _groupHover={{
              color: "neutral.100",
            }}
          />
        </Text>
      </Flex>
    </Link>
  )
}
