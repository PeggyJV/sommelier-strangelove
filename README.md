# somm-boilerplate

- [somm-boilerplate](#somm-boilerplate)
  - [Getting Started](#getting-started)
- [The Graph / Cellars Subgraph](#the-graph--cellars-subgraph)
  - [GraphQL Codegen](#graphql-codegen)
  - [Updating the schema.json](#updating-the-schemajson)
  - [Using hooks](#using-hooks)
  - [Parsing BigInt](#parsing-bigint)
  - [Learn more about graphql-codegen & urql](#learn-more-about-graphql-codegen--urql)
- [IP Detection using Vercel's headers](#ip-detection-using-vercels-headers)
- [Multiple Sources of Truth](#multiple-sources-of-truth)
  - [Hardcoded values](#hardcoded-values)
  - [The Subgraph](#the-subgraph)
  - [Directly querying the contracts](#directly-querying-the-contracts)
  - [Displaying/Branching UI output](#displayingbranching-ui-output)
- [Learn More](#learn-more)

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

# The Graph / Cellars Subgraph

There is a subgraph (elkdao/cellars) currently deployed on the hosted service at [https://api.thegraph.com/subgraphs/name/peggyjv/cellars](https://api.thegraph.com/subgraphs/name/peggyjv/cellars). You can view the schema and query the subgraph directly in a GraphQL playground by clicking the link. This is a great way to familiarize yourself with the data model exposed by the subgraph.

## GraphQL Codegen

[GraphQL Codgen](https://www.graphql-code-generator.com/docs/getting-started) is configured to automatically generate fully typed hooks based on the `.graphql` queries in the `src/queries` directory. This configuration is defined in `./codegen.yaml`. When adding a new query or modifying an existing one, you must run `yarn generate` to create / update the generated hook.

## Updating the schema.json

The `generated/schema.json` must be updated whenever there is a schema change in the subgraph. To pull the schema from the deployed subgraph directly run `yarn generate:schema`.

## Using hooks

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

## Parsing BigInt

The subgraph is written in AssemblyScript and supports representing 256 bit integers. These scalars are represented as strings when sent to the front end and must be parsed using a BigNumber library such as `@ethersproject/bignumber` in order to perform mathematical operations. See the `@ethersproject/bignumber` [docs](https://docs.ethers.io/v5/api/utils/bignumber/) for more information. Do not use `parseInt` on BigInt strings, the value could be greater than `MAX_SAFE_INTEGER`.

## Learn more about graphql-codegen & urql

- [GraphQL Codgen React](https://www.graphql-code-generator.com/docs/getting-started)
- [The Guild Best Practices](https://www.the-guild.dev/blog/graphql-codegen-best-practices)
- [urql Basics](https://formidable.com/open-source/urql/docs/basics/react-preact/)
- [urql SSR with NextJS](https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#using-getstaticprops-or-getserversideprops)

# IP Detection using Vercel's headers

In order to block access to the app from sanctioned and restricted countries we are using Vercel's `x-vercel-ip-country` and `x-vercel-ip-country-region` to detect IP addresses. This is setup via a Next.js API route which reads the file from disk and performs a lookup against the IP. See `src/pages/api/geo.ts`.

The endpoint is hardcoded to use a restricted region unless you set the env vars `IP_COUNTRY`, and `IP_COUTNRY_REGION` (eg. `IP_COUNTRY='CA'` `IP_COUNTRY_REGION='BC'`). This API endpoint is then used by our GeoProvider (see `src/context/geoContext.tsx`). You can import the `useGeo()` hook to get access to the user's country, region, and a boolean that determines if they are in a restricted region or not. It's currently beging used in the `<Layout />` component to display a "Service Unavailable" banner and to block a user from connecting their wallet to the app.

# Multiple Sources of Truth

Unfortunately, as of writing this (03.08.22), there are multiple sources of truth cobbled together to present data to the user in the UI.

## Hardcoded values

Files of note:

- [`config.ts`](./src/utils/config.ts)
- [`cellarDataMap.ts`](./src/data/cellarDataMap.ts)
- [`tokenConfig.ts`](./src/data/tokenConfig.ts)

I outline these because they are the hardcoded data used to present asset symbols, apy, supported chains, etc. `cellarDataMap.ts` in particular is extensible, but the most fragile. It depends on an up-to-date cellar address to display the data correctly at a given cellar route. We have it set up to pull in that string from the `config.ts` file, but this certainly needs to be refactored in the future as we continue to support more strategies.

## The Subgraph

Files of note:

- [`subgraph.ts`](./src/generated/subgraph.ts)
- [`graphql/`](./src/queries/)

Though the core workflow of the subgraph is covered above, writing queries and using the generated hooks are a large chunk of working with the cellar route. **An important note about generating hooks**: For whatever reason, if you've written a new gql query and ran the `yarn generate` command to get your new urql hooks, they may not appear. If this is the case, I just delete the `./src/generated/subgraph.ts` file and rerun the script. That usually works 🤘

## Directly querying the contracts

Files of note:

- [`config.ts`](./src/utils/config.ts)
- [`data/cellarDataMap.ts`](./src/data/cellarDataMap.ts)
- [`data/hooks/*`](./src/data/hooks/)
- [`data/actions/*`](./src/data/actions/)

Hooks per output
![query data](./querying-data.png)
If there's a new cellar with a different cellar or staker contract that has a different ABI and output value, we should create output actions for it inside `data/actions/{cellarContractname}/{outputName}` and branch those actions inside `data/hooks/{outputName}`. If we find the same method and calculation on the smart contract/output, we should put it inside `data/actions/common/{outputName}`

## Displaying/Branching UI output

In the case we don't show specific UI output per cellar, We can specify what will be displayed or not inside /src/data/uiConfig.ts. Each function needs to be passed ConfigProps.

example:
We show "Rewards" only on `aave v2` cellar

```tsx
// src/data/uiConfig.ts
export const isRewardsEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

// somewhere in ui component
isRewardsEnabled(cellarConfig) && <RewardsCard />
```

# Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
