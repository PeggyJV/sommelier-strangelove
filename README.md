# somm-boilerplate

- [Getting Started](#getting-started)
- [Learn More](#learn-more)
- [Notes](#notes)

## Getting Started

First, run the development server:

```sh
# using npm
npm run dev

# using yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## The Graph / Cellars Subgraph

There is a subgraph (elkdao/cellars) currently deployed on the hosted service at [https://api.thegraph.com/subgraphs/name/elkdao/cellars](https://api.thegraph.com/subgraphs/name/elkdao/cellars/graphql). You can view the schema and query the subgraph directly in a GraphQL playground by clicking the link. This is a great way to familiarize yourself with the data model exposed by the subgraph.

### GraphQL Codegen

[GraphQL Codgen](https://www.graphql-code-generator.com/docs/getting-started) is configured to automatically generate fully typed hooks based on the `.graphql` queries in the `src/queries` directory. This configuration is defined in `./codegen.yaml`. When adding a new query or modifying an existing one, you must run `yarn generate` to create / update the generated hook.

### Updating the schema.json

The `generated/schema.json` must be updated whenever there is a schema change in the subgraph. To pull the schema from the deployed subgraph directly run `yarn generate:schema`.

### Using hooks

```jsx
import {useGetWalletQuery} from 'generated/subgraph'

const MyComponent = () => {
  const [result] = useGetWalletQuery({
    variables: {
      walletAddress: '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA',
  });
  const {data, fetching, error} = result;

  return <div>data.wallet?.id</div>
}
```

### Parsing BigInt

The subgraph is written in AssemblyScript and supports representing 256 bit integers. These scalars are represented as strings when sent to the front end and must be parsed using a BigNumber library such as `@ethersproject/bignumber` in order to perform mathematical operations. See the `@ethersproject/bignumber` [docs](https://docs.ethers.io/v5/api/utils/bignumber/) for more information. Do not use `parseInt` on BigInt strings, the value could be greater than `MAX_SAFE_INTEGER`.

### Learn more about graphql-codegen & urql

- [GraphQL Codgen React](https://www.graphql-code-generator.com/docs/getting-started)
- [The Guild Best Practices](https://www.the-guild.dev/blog/graphql-codegen-best-practices)
- [urql Basics](https://formidable.com/open-source/urql/docs/basics/react-preact/)
- [urql SSR with NextJS](https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#using-getstaticprops-or-getserversideprops)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Notes

- [rafce](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- no `grep -v` on MacOS? :shrug:
- this repo requires node v16
