import { defineRecipe } from "@chakra-ui/react";

export const components = {
  Button: defineRecipe({
    base: {
      borderRadius: 64,
      color: "text.body.dark",
    },
  }),
  Heading: defineRecipe({
    base: {
      color: "text.headlines.light",
    },
  }),
  Tooltip: defineRecipe({
    base: {
      px: 3,
      py: 3,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: "purple.base",
      "--popper-arrow-shadow-color": "colors.purple.base",
    },
  }),
  Input: defineRecipe({
    base: {
      "--focus-color": "purple.base",
    },
  }),
}
