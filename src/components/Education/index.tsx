import { Box, Heading, List, ListItem } from "@chakra-ui/react"
import { EducationCard } from "./EducationCard"
import { eduItems } from "./eduItems"
import { EduItem } from "./types"

export const Education: React.FC = () => {
  return (
    <Box>
      <Heading as="h3" my="h5">
        Education
      </Heading>
      <List>
        {eduItems.map((eduItem: EduItem) => {
          return (
            <ListItem key={eduItem.title}>
              <EducationCard {...eduItem} />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
