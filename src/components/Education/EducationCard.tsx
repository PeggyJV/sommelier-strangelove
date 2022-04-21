import { Flex, Text } from "@chakra-ui/react"
import Link from "components/Link"

import { EduItem } from "./types"

export const EducationCard: React.FC<EduItem> = ({
  title,
  url,
  variant,
}) => {
  return (
    <Link href={url}>
      <Flex>
        <Text>{title}</Text>
        <Text>Read more</Text>
      </Flex>
    </Link>
  )
}
