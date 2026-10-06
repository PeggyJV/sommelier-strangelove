# Remove Sanity Runtime Dependency

## Goal

Make the Sommelier UI build and render without a Sanity project, credentials, network request, or paid Sanity account. Preserve the legal text currently deployed at `/privacy-policy` and `/user-terms`, and preserve the existing strategy landing-page behavior.

## Current behavior

Three statically generated routes call Sanity during every production build:

- `/strategies/[id]` fetches home and FAQ records even though `PageStrategy` does not render those fetched sections.
- `/privacy-policy` fetches its Portable Text document.
- `/user-terms` fetches its Portable Text document.

These calls make deployment depend on Sanity availability and billing. The current failure occurs after Next.js compilation, when static generation receives HTTP 402 from the blocked Sanity project. A separate CI environment fails earlier because no Sanity `projectId` is configured.

## Design

### Strategy pages

Remove the Sanity client calls from `getStaticProps`. The page will pass only the strategy ID to `PageStrategy`. Remove the unused FAQ, cellar-section, and strategy-section props from both components. The visible page remains unchanged because those sections are already commented out and the hero and highlight content come from `strategyPageContentData`.

### Legal pages

Store the last successfully deployed privacy-policy and user-terms Portable Text payloads as versioned local data. The source payloads will be extracted from the deployed pages' `__NEXT_DATA__` values without editing their wording.

The legal pages will import this local data directly and render it through the existing Portable Text components. They will no longer implement `getStaticProps`, so legal-page generation requires no remote service.

### Types and packages

Replace `sanity-codegen` types in `src/types/sanity.ts` with local structural types built from the existing `@portabletext/types` package and small interfaces for the fields used by components. Keep `@portabletext/react` and `@portabletext/types` because they render the preserved local documents; they do not require a Sanity service.

Delete the unused Sanity client and query modules. Remove `next-sanity` and `sanity-codegen` from `package.json` and the lockfile. A repository search must find no runtime or build imports of Sanity.

## Data flow

Legal content will flow from a committed local data module into the legal page component and then into the existing Portable Text renderer. Strategy content will continue to flow from `cellarDataMap` and `strategyPageContentData` without an intermediate CMS request.

No fallback network request will exist. Missing local legal content will be caught by tests and code review rather than hidden by an empty page or runtime fallback.

## Testing

Add tests that assert:

- Both local legal documents contain non-empty Portable Text blocks.
- The legal page modules render from local content and expose no static data-fetching function.
- Strategy static props complete without a Sanity client and return only the requested ID.
- The repository contains no `next-sanity` or `sanity-codegen` dependency after installation.

Run the focused tests, the full Jest suite, TypeScript checking, linting for changed files, and a production build with all Sanity environment variables unset. The production build is the acceptance test for removal of the external build dependency.

## Rollout

Land this change independently on `main`, verify a successful Vercel deployment, then update the RYUSD balance PR from `main` and rerun its checks. This keeps CMS removal separate from the user-balance fix and makes any deployment regression easy to identify.

## Risks

- Legal copy will no longer update through the Sanity editor. Future changes require a repository change and deployment.
- The vendored documents retain Portable Text formatting. Removing Portable Text itself is outside this change because converting legal copy to JSX or Markdown adds content-transformation risk without removing another external service.
- Unused legacy content components may still use the local compatibility types. They remain buildable but receive no remote content.
