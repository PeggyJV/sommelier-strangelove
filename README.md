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

There is a subgraph (elkdao/cellars) currently deployed on the hosted service at [https://api.thegraph.com/subgraphs/name/peggyjv/cellars](https://api.thegraph.com/subgraphs/name/peggyjv/cellars). You can view the schema and query the subgraph directly in a GraphQL playground by clicking the link. This is a great way to familiarize yourself with the data model exposed by the subgraph.

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

### IP Detection using Vercel's headers

In order to block access to the app from sanctioned and restricted countries we are using Vercel's `x-vercel-ip-country` and `x-vercel-ip-country-region` to detect IP addresses. This is setup via a Next.js API route which reads the file from disk and performs a lookup against the IP. See `src/pages/api/geo.ts`.

The endpoint is hardcoded to use a restricted region unless you set the env vars `IP_COUNTRY`, and `IP_COUTNRY_REGION` (eg. `IP_COUNTRY='CA'` `IP_COUNTRY_REGION='BC'`). This API endpoint is then used by our GeoProvider (see `src/context/geoContext.tsx`). You can import the `useGeo()` hook to get access to the user's country, region, and a boolean that determines if they are in a restricted region or not. It's currently beging used in the `<Layout />` component to display a "Service Unavailable" banner and to block a user from connecting their wallet to the app.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Notes

- [rafce](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- no `grep -v` on MacOS? :shrug:
- this repo requires node v16
