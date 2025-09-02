# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
yarn dev  # Start development server on http://localhost:3000
yarn build  # Build production application
yarn start  # Start production server
```

### Linting and Type Checking
```bash
yarn lint  # Run ESLint on entire codebase
yarn lint:fix  # Auto-fix linting issues
yarn lint:scoped  # Run linting on specific scoped files
yarn typecheck  # Run TypeScript type checking (with skipLibCheck)
yarn typecheck:scoped  # Scoped typecheck with ox library conflicts resolved
```

### Testing
```bash
yarn test  # Run all tests with Jest
yarn test:watch  # Run tests in watch mode
yarn test:coverage  # Run tests with coverage report
yarn test:unit  # Run component tests only
yarn test:integration  # Run integration tests only
yarn test:api  # Run API tests only
yarn test:utils  # Run utility tests only
yarn test:hooks  # Run hook tests only
yarn test:all  # Run all tests with coverage and verbose output
```

### Performance Analysis
```bash
yarn analyze  # Analyze bundle with webpack-bundle-analyzer
yarn analyze:browser  # Analyze browser bundle
yarn analyze:server  # Analyze server bundle
yarn lighthouse  # Run Lighthouse performance tests
yarn size-limit  # Check bundle size limits
```

### Code Quality
```bash
yarn deadcode  # Find unused code with ts-prune
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15.3.2 with React 19.1.0
- **Blockchain**: Viem + Wagmi for Ethereum contract interactions
- **Wallet**: RainbowKit for wallet connection
- **State Management**: Zustand for global state, TanStack Query for server state
- **UI**: Chakra UI v2 with custom theme
- **Charts**: Nivo for data visualization
- **Cosmos**: Keplr wallet integration for Cosmos chains

### Project Structure

#### Key Directories
- `src/components/` - React components organized by type (_buttons, _cards, _charts, _modals, etc.)
- `src/data/` - Data layer with strategies, hooks, actions, and configurations
- `src/pages/` - Next.js pages and API routes
- `src/utils/` - Utility functions and configurations
- `src/abi/` - Smart contract ABIs and generated TypeScript types

#### Data Architecture
The app uses a multi-source data architecture:

**Strategy Configuration**:
- `src/data/strategies/` - Individual strategy definitions (40+ DeFi strategies)
- `src/data/cellarDataMap.ts` - Maps strategy slugs to configurations
- `src/utils/config.ts` - Contract addresses, ABIs, and core configuration

**Data Flow**:
- `src/data/hooks/` - Custom hooks for data fetching with TanStack Query
- `src/data/actions/` - Server actions for contract interactions
- API routes in `src/pages/api/` - Backend endpoints for external data

**Contract Interaction Pattern**:
Uses `useCreateContracts` hook to generate typed contract instances:
```typescript
const { cellarSigner } = useCreateContracts(cellarConfig)
const result = await cellarSigner?.read.functionName(args)
const hash = await cellarSigner?.write.functionName(args, options)
```

### Key Features

#### Multi-Chain Support
- **Ethereum**: Primary chain for most strategies
- **Arbitrum**: Layer 2 scaling with specific strategies
- **Optimism**: Additional Layer 2 support
- **Scroll**: Emerging Layer 2 integration
- **Cosmos**: Sommelier native chain via Keplr

#### Strategy Management
- **Cellars**: Smart contract-based investment strategies
- **Staking**: Additional yield through cellar token staking
- **Multi-Asset Deposits**: Support for various deposit tokens per strategy
- **Router Contracts**: Optimized deposit/withdrawal routing

#### UI Configuration System
- `src/data/uiConfig.ts` - Feature flags and conditional UI rendering per strategy
- `src/components/_pages/` - Page-level components for different views
- `src/theme/` - Centralized Chakra UI theme configuration

### Development Patterns

#### Adding New Strategies
1. Create strategy config in `src/data/strategies/new-strategy.ts`
2. Add contract configuration to `src/utils/config.ts`
3. Update `src/data/cellarDataMap.ts` with new mapping
4. Add corresponding entry in `src/data/strategies/index.ts`

#### Contract Interactions
Always use existing contract instances from `useCreateContracts` rather than creating new ones. The hook provides typed contract interfaces for all supported cellar versions.

#### Conditional UI Features
Use `src/data/uiConfig.ts` functions to conditionally render features based on strategy configuration:
```typescript
isRewardsEnabled(cellarConfig) && <RewardsComponent />
```

### Important Configuration Files
- `next.config.js` - Security headers, redirects, and build configuration
- `jest.json` - Test configuration and coverage settings
- `tsconfig.json` - TypeScript configuration with path aliases
- `package.json` - Comprehensive script commands and dependency management

### Security & Compliance
- IP-based geo-blocking via Vercel headers (`src/pages/api/geo.ts`)
- Content Security Policy headers
- X-Frame-Options: DENY for clickjacking protection
- Sentry integration for error monitoring

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Cross-component interaction testing
- **API Tests**: Backend endpoint validation
- **Utils/Hooks Tests**: Isolated logic testing
- **Coverage Reports**: Comprehensive test coverage tracking