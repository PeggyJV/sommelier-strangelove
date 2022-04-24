import { Grid, GridProps } from "@chakra-ui/react"

export const GridHome: React.FC<GridProps> = ({
  children,
  ...rest
}) => {
  return (
    <Grid
      as="ul"
      listStyleType="none"
      gap={6}
      templateColumns={{
        base: "1fr",
        md: "1fr 1fr",
        lg: "1fr 1fr 1fr",
      }}
      gridAutoColumns={{ base: "minmax(0, 1fr)" }}
      {...rest}
    >
      {children}
    </Grid>
  )
}
