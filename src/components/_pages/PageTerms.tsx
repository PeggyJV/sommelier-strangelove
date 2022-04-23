import { NextPage } from 'next'
import { Grid, Heading, Text, VStack } from '@chakra-ui/react'
import { Layout } from 'components/Layout'
import { Section } from 'components/_layout/Section'

export const PageTerms: NextPage = () => {
  return (
    <Layout>
      <VStack spacing={6} align='flex-start'>
        <Section>
          <Grid templateColumns='1fr 1fr' gap={6} justifyItems='center'>
            <VStack align='flex-start' spacing={4} maxW='70ch'>
              <Heading>Terms</Heading>
              <Text>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga.
              </Text>
            </VStack>
          </Grid>
        </Section>
      </VStack>
    </Layout>
  )
}
