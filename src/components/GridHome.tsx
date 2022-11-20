import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"

export const GridHome: React.FC<SimpleGridProps> = ({
  children,
  ...rest
}) => {
  return (
    <SimpleGrid
      as="ul"
      listStyleType="none"
      gap={6}
      columns={{ base: 1, md: 2, lg: 3 }}
      {...rest}
    >
      {children}
    </SimpleGrid>
  )
}
