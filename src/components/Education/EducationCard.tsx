import { Flex, Heading, Text } from "@chakra-ui/react"
import Link from "components/Link"
import LinkProps from "types/LinkProps"
import { EduItem } from "./types"

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
        height="80px"
        border="8px solid rgba(78, 56, 156, 0.08)"
        padding="0 1rem"
      >
        <Heading as="h3" size="sm">
          {title}
        </Heading>
        <Text fontSize="0.75rem">Read more</Text>
      </Flex>
    </Link>
  )
}
