import { BoxProps, Heading, Link } from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { CardBase } from "components/_cards/CardBase"
import { ArrowRightIcon } from "components/_icons"

const heading = "Want to become a strategy provider?"
const getInTouchUrl = "https://9ftvmgahdx6.typeform.com/to/h6LmcZOD"

export const BecomeProvider: React.FC<BoxProps> = (props) => {
  return (
    <CardBase
      px={10}
      py={7}
      flexDir="column"
      alignItems="flex-start"
      boxSizing="border-box"
      {...props}
    >
      <Heading as="h5" fontSize="button" mb={5}>
        {heading}
      </Heading>

      <Link isExternal href={getInTouchUrl} textDecoration="none">
        <SecondaryButton
          fontSize="md"
          px={4}
          py={2}
          rightIcon={<ArrowRightIcon />}
          textDecoration="none"
        >
          Get in touch
        </SecondaryButton>
      </Link>
    </CardBase>
  )
}
