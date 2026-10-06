# Remove Sanity Runtime Dependency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render the Sommelier UI without a Sanity project, credentials, network request, or paid account while preserving the currently deployed legal copy and strategy landing-page behavior.

**Architecture:** Commit the last deployed legal Portable Text documents as local JSON, pass them directly to the existing renderers, and remove unused CMS props from strategy pages. Replace generated Sanity types with local structural types, delete the client/query modules, and remove Sanity packages from the dependency graph.

**Tech Stack:** Next.js 15 pages router, React 19, TypeScript, Jest, Portable Text, pnpm 9

**Spec:** `docs/superpowers/specs/2026-10-06-remove-sanity-runtime-design.md`

## Global Constraints

- Preserve the legal wording currently deployed at `/privacy-policy` and `/user-terms` without edits.
- Preserve visible strategy landing-page behavior.
- Keep `@portabletext/react` and `@portabletext/types`; they render committed local content without a Sanity service.
- Remove `next-sanity`, `sanity-codegen`, all Sanity client calls, and all Sanity environment requirements.
- Do not add a network fallback for missing local content.

## Review Focus

- A legal JSON file is present but has an empty `content` array: the content test must fail rather than ship a blank legal page.
- The vendored documents contain valid Portable Text blocks with stable deployed IDs and exact block counts: fixture tests must pin IDs and counts to detect accidental truncation or substitution.
- A strategy ID exists in `cellarDataMap` but has no local landing copy: the existing redirect-to-manage behavior must remain unchanged.
- Sanity environment variables are absent: production build must complete without reading or validating them.
- Legacy unused content components still import compatibility types: full TypeScript checking must prove the local type replacement covers their existing field access.

---

### Task 1: Vendor the deployed legal documents

**Files:**
- Create: `src/data/legal/privacy-policy.json`
- Create: `src/data/legal/user-terms.json`
- Create: `src/data/legal/index.ts`
- Create: `src/__tests__/data/legalContent.spec.ts`
- Modify: `src/types/sanity.ts`

**Interfaces:**
- Consumes: The `data` objects embedded in the deployed pages' `__NEXT_DATA__` payloads.
- Produces: `privacyPolicyContent: PrivacyAndTermsContent` and `userTermsContent: PrivacyAndTermsContent` from `data/legal`.

- [ ] **Step 1: Write the failing legal-content fixture test**

Create `src/__tests__/data/legalContent.spec.ts` with tests that import `privacyPolicyContent` and `userTermsContent`. Assert the privacy document has `_id` `b51262c2-eb5a-4b78-b480-b0bb642915ac`, `_type` `privacyPolicy`, and exactly 74 content blocks. Assert the terms document has `_id` `135527b3-17d7-49d5-9ace-751ba183c08d`, `_type` `userTerms`, and exactly 148 content blocks. Assert every content item has a non-empty `_type` and `_key`.

- [ ] **Step 2: Run the fixture test and verify it fails**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/data/legalContent.spec.ts`

Expected: FAIL because `data/legal` does not exist.

- [ ] **Step 3: Extract the deployed payloads into local JSON**

Download `https://app.somm.finance/privacy-policy` and `https://app.somm.finance/user-terms`, extract only `props.pageProps.data` from each `__NEXT_DATA__` script, and write those objects to the two JSON files. Preserve every value and array order exactly.

- [ ] **Step 4: Export typed local documents**

Add `_id: string` and `_type: "privacyPolicy" | "userTerms"` to `PrivacyAndTermsContent`. In `src/data/legal/index.ts`, import both JSON files and export them as `PrivacyAndTermsContent` values named `privacyPolicyContent` and `userTermsContent`.

- [ ] **Step 5: Run the fixture test and verify it passes**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/data/legalContent.spec.ts`

Expected: PASS with two non-empty, exact deployed documents.

- [ ] **Step 6: Commit**

```bash
git add src/data/legal src/__tests__/data/legalContent.spec.ts src/types/sanity.ts
git commit -m "feat: vendor deployed legal content"
```

### Task 2: Remove Sanity data fetching from active routes

**Files:**
- Modify: `src/pages/privacy-policy.tsx`
- Modify: `src/pages/user-terms.tsx`
- Modify: `src/pages/strategies/[id]/index.tsx`
- Modify: `src/components/_pages/PageStrategy.tsx`
- Create: `src/__tests__/pages/staticContent.spec.ts`

**Interfaces:**
- Consumes: `privacyPolicyContent` and `userTermsContent` from Task 1.
- Produces: Legal page components with no `getStaticProps`; `StrategyLandingPageProps` containing only `id: string`; strategy `getStaticProps` returning `{ props: { id } }`.

- [ ] **Step 1: Write failing route-source tests**

Create `src/__tests__/pages/staticContent.spec.ts` that reads the four route/component source files and asserts: legal pages import their matching `data/legal` export; neither legal page contains `getStaticProps`; neither strategy file contains `sanityClient`, `faqData`, `sectionCellars`, or `sectionStrategies`; and the strategy route retains `getStaticPaths` plus `getStaticProps`.

- [ ] **Step 2: Run the route-source tests and verify they fail**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/pages/staticContent.spec.ts`

Expected: FAIL because all three routes still import or call the Sanity client.

- [ ] **Step 3: Convert the legal pages to local imports**

Remove `GetStaticProps`, Sanity client, and query imports from both legal page modules. Pass the corresponding Task 1 content export directly to `PagePrivacyPolicy` or `PageUserTerms` from the page component.

- [ ] **Step 4: Simplify strategy landing-page props**

Change `StrategyLandingPageProps` in both strategy files to `{ id: string }`, remove the three unused content props, and make `getStaticProps` return only `{ props: { id } }`. Preserve `getStaticPaths`, SEO metadata, the redirect to `/strategies/${id}/manage`, `HeroStrategy`, and `Highlight`.

- [ ] **Step 5: Run the route-source tests and verify they pass**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/pages/staticContent.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/privacy-policy.tsx src/pages/user-terms.tsx src/pages/strategies/[id]/index.tsx src/components/_pages/PageStrategy.tsx src/__tests__/pages/staticContent.spec.ts
git commit -m "refactor: serve static content without Sanity"
```

### Task 3: Remove Sanity packages and generated types

**Files:**
- Modify: `src/types/sanity.ts`
- Delete: `src/lib/sanity/client.ts`
- Delete: `src/lib/sanity/queries.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/__tests__/data/noSanityDependency.spec.ts`

**Interfaces:**
- Consumes: Existing component field access documented by imports from `types/sanity`.
- Produces: Local `ContentDocument`, keyed Portable Text, FAQ, strategy, stablecoin, section, and home interfaces with the same exported public names currently consumed by components.

- [ ] **Step 1: Write the failing dependency-boundary test**

Create `src/__tests__/data/noSanityDependency.spec.ts`. Read `package.json` and production source files under `src` while excluding `src/__tests__`; assert that dependencies and devDependencies omit `next-sanity` and `sanity-codegen`, no source file imports those packages, and no source file imports `src/lib/sanity/client` or `src/lib/sanity/queries`.

- [ ] **Step 2: Run the dependency test and verify it fails**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/data/noSanityDependency.spec.ts`

Expected: FAIL on the two packages and the remaining Sanity modules/types.

- [ ] **Step 3: Replace generated types with local structural types**

In `src/types/sanity.ts`, import `PortableTextBlock` from `@portabletext/types` and define local keyed/reference/document/image interfaces for the fields already exposed by `Home`, `Strategy`, `FaqSection`, `FaqItem`, `FaqTab`, `StableCoin`, `BlockContent`, and the existing `*WithImage` aliases. Retain all currently imported export names so unused legacy components continue to typecheck.

- [ ] **Step 4: Delete the client and query modules**

Delete `src/lib/sanity/client.ts` and `src/lib/sanity/queries.ts`. Remove the empty `src/lib/sanity` directory if no files remain.

- [ ] **Step 5: Remove package dependencies and update the lockfile**

Run: `pnpm remove next-sanity sanity-codegen`

Expected: `package.json` and `pnpm-lock.yaml` no longer contain either direct package entry.

- [ ] **Step 6: Run the dependency test and TypeScript check**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/data/noSanityDependency.spec.ts && pnpm typecheck`

Expected: PASS; the local compatibility types satisfy every existing component.

- [ ] **Step 7: Commit**

```bash
git add src/types/sanity.ts src/lib/sanity package.json pnpm-lock.yaml src/__tests__/data/noSanityDependency.spec.ts
git commit -m "chore: remove Sanity dependencies"
```

### Task 4: Prove the application builds without Sanity

**Files:**
- Modify only if verification exposes a defect in Tasks 1-3.

**Interfaces:**
- Consumes: All outputs from Tasks 1-3.
- Produces: A branch that passes local tests, typechecking, linting, and production build without Sanity configuration.

- [ ] **Step 1: Run focused and full automated checks**

Run: `pnpm exec jest --config jest.json --runInBand src/__tests__/data/legalContent.spec.ts src/__tests__/pages/staticContent.spec.ts src/__tests__/data/noSanityDependency.spec.ts && pnpm exec jest --config jest.json --runInBand && pnpm typecheck`

Expected: All focused tests, all non-skipped repository tests, and TypeScript checking pass.

- [ ] **Step 2: Lint the changed TypeScript files**

Run: `pnpm exec eslint src/data/legal/index.ts src/types/sanity.ts src/pages/privacy-policy.tsx src/pages/user-terms.tsx 'src/pages/strategies/[id]/index.tsx' src/components/_pages/PageStrategy.tsx src/__tests__/data/legalContent.spec.ts src/__tests__/pages/staticContent.spec.ts src/__tests__/data/noSanityDependency.spec.ts`

Expected: Zero lint errors.

- [ ] **Step 3: Build with Sanity variables removed from the environment**

Run: `env -u NEXT_PUBLIC_SANITY_PROJECT_ID -u NEXT_PUBLIC_SANITY_DATASET -u SANITY_API_TOKEN pnpm build`

Expected: Next.js completes static generation for every route without a Sanity configuration error or network request.

- [ ] **Step 4: Verify repository boundaries and diff integrity**

Run these commands separately:

```bash
rg -n "from [\\\"']next-sanity|from [\\\"']sanity-codegen|sanityClient|NEXT_PUBLIC_SANITY|SANITY_API_TOKEN" src --glob '!src/__tests__/**'
rg -n 'next-sanity|sanity-codegen' package.json pnpm-lock.yaml
git diff --check
git status --short
```

Expected: Both `rg` commands exit 1 with no matches; `git diff --check` exits 0; `git status` lists only planned files.

- [ ] **Step 5: Commit any verification-driven corrections**

If Steps 1-4 required code corrections, commit only those files with `git commit -m "fix: complete Sanity-independent build"`. Otherwise, do not create an empty commit.

- [ ] **Step 6: Prepare integration**

Push `fix/remove-sanity-runtime`, open a PR against `main`, wait for required review and checks, merge after approval, verify the production deployment, then update PR #1921 from `main` and rerun its checks.
