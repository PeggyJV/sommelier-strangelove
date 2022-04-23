import { Flex, Heading, Img, Text } from "@chakra-ui/react"
import Link from "components/Link"
import LinkProps from "types/LinkProps"
import { EduItem } from "./types"
import { imageStyles } from "./imageStyles"
import { FaRegIdBadge } from "react-icons/fa"

type Props = EduItem & LinkProps

export const EducationCard: React.FC<Props> = ({
  title,
  url,
  variant,
  ...rest
}) => {
  return (
    <Link href={url} {...rest}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="16px"
        width="320px"
        height="96px"
        border="8px solid rgba(78, 56, 156, 0.08)"
        padding="0 1rem"
        position="relative"
        overflow="hidden"
        boxSizing="border-box"
        _hover={{
          backgroundColor: "rgba(78, 56, 156, 0.04)",
          border: "8px solid rgba(78, 56, 156, 0.12)",
        }}
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
        <Text fontSize="0.75rem" zIndex="2" fontWeight="bold">
          Read more
        </Text>
      </Flex>
    </Link>
  )
}
