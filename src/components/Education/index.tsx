import { Box, Grid, Heading, List, ListItem } from "@chakra-ui/react"
import { GridHome } from "components/GridHome"
import { EducationCard } from "./EducationCard"
import { eduItems } from "./eduItems"
import { EduItem } from "./types"

export const Education: React.FC = () => {
  return (
    <Box>
      <Heading as="h3" size="md" mb={10}>
        Education
      </Heading>
      <GridHome>
        {eduItems.map((eduItem: EduItem) => {
          return (
            <EducationCard key={eduItem.title} as="li" {...eduItem} />
          )
        })}
      </GridHome>
    </Box>
  )
}
