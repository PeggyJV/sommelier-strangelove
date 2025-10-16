# Testing Suite - Sommelier-Strangelove

This directory contains a comprehensive testing suite for the Sommelier-Strangelove application. The tests are designed to catch errors before they reach production and ensure the application works correctly across different scenarios.

## 🧪 Test Structure

```
src/__tests__/
├── setup.ts                    # Jest setup and global mocks
├── components/                 # Component unit tests
│   ├── VaultActionButton.spec.tsx
│   └── StrategyRow.spec.tsx
├── hooks/                      # Custom hook tests
│   └── useUserStrategyData.spec.ts
├── utils/                      # Utility function tests
│   └── rpcConnection.spec.ts
├── api/                        # API route tests
│   └── coingecko.spec.ts
├── integration/                # Integration tests
│   └── app.spec.ts
└── README.md                   # This file
```

## 🚀 Quick Start

### Run All Tests

```bash
# Run all tests with coverage
pnpm run test:all

# Run all tests without coverage
pnpm run test
```

### Run Specific Test Categories

```bash
# Unit tests for components
pnpm run test:unit

# Hook tests
pnpm run test:hooks

# Utility tests
pnpm run test:utils

# API tests
pnpm run test:api

# Integration tests
pnpm run test:integration
```

### Development Mode

```bash
# Watch mode for development
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Comprehensive Test Runner

```bash
# Run the comprehensive test script
./scripts/run-tests.sh
```

## 📋 Test Categories

### 1. Component Tests (`components/`)

- **Purpose**: Test individual React components in isolation
- **Coverage**: Rendering, user interactions, props, state changes
- **Examples**:
  - `VaultActionButton.spec.tsx` - Tests button styling and interactions
  - `StrategyRow.spec.tsx` - Tests responsive design and data display

### 2. Hook Tests (`hooks/`)

- **Purpose**: Test custom React hooks
- **Coverage**: State management, side effects, data transformations
- **Examples**:
  - `useUserStrategyData.spec.ts` - Tests Net Value calculation and error handling

### 3. Utility Tests (`utils/`)

- **Purpose**: Test utility functions and external integrations
- **Coverage**: Error handling, edge cases, network failures
- **Examples**:
  - `rpcConnection.spec.ts` - Tests RPC connection failures and recovery

### 4. API Tests (`api/`)

- **Purpose**: Test API routes and external service integrations
- **Coverage**: Request/response handling, error scenarios, rate limiting
- **Examples**:
  - `coingecko.spec.ts` - Tests CoinGecko API error handling

### 5. Integration Tests (`integration/`)

- **Purpose**: Test component interactions and full application flows
- **Coverage**: End-to-end scenarios, data flow, user journeys
- **Examples**:
  - `app.spec.ts` - Tests complete application rendering and interactions

## 🛠️ Test Configuration

### Jest Configuration (`jest.json`)

- **Environment**: `jsdom` for DOM testing
- **Setup**: `src/__tests__/setup.ts` for global mocks
- **Coverage**: HTML, LCOV, and text reports
- **Timeout**: 5 minutes for long-running tests

### Global Mocks (`setup.ts`)

- **Next.js Router**: Mocked for consistent testing
- **Wagmi Hooks**: Mocked wallet and chain state
- **Environment Variables**: Test values for API keys
- **Window Object**: Mocked ethereum provider
- **Fetch API**: Mocked for network requests

## 🎯 Test Coverage

The test suite covers:

### ✅ Error Scenarios

- RPC connection failures (`eth.merkle.io` errors)
- API rate limiting and timeouts
- Missing or invalid data
- Network connectivity issues
- Component rendering errors

### ✅ UI/UX Issues

- Responsive design breakpoints
- Button styling consistency
- Accessibility requirements
- Loading and error states
- User interactions

### ✅ Data Flow

- Net Value calculation accuracy
- User balance fetching
- Strategy data processing
- Real-time updates
- Cache invalidation

### ✅ Performance

- Large data set rendering
- Memory usage optimization
- Network request efficiency
- Component re-rendering

## 🔧 Writing Tests

### Component Test Template

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import YourComponent from "../YourComponent"
import theme from "../../theme"

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>{component}</ChakraProvider>
  )
}

describe("YourComponent", () => {
  it("should render correctly", () => {
    renderWithTheme(<YourComponent />)
    expect(screen.getByText("Expected Text")).toBeInTheDocument()
  })

  it("should handle user interactions", () => {
    renderWithTheme(<YourComponent />)
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(button).toHaveBeenCalled()
  })

  it("should handle errors gracefully", () => {
    // Test error scenarios
  })
})
```

### Hook Test Template

```typescript
import { renderHook, waitFor } from "@testing-library/react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useYourHook } from "../useYourHook"

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe("useYourHook", () => {
  it("should return expected data", async () => {
    const { result } = renderHook(() => useYourHook(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

## 🚨 Common Issues & Solutions

### 1. RPC Connection Errors

**Problem**: `HttpRequestError: HTTP request failed` from `eth.merkle.io`
**Solution**: Tests in `rpcConnection.spec.ts` verify proper error handling and fallback mechanisms

### 2. Net Value Display Issues

**Problem**: "..." displayed instead of actual values
**Solution**: Tests in `useUserStrategyData.spec.ts` verify calculation logic and fallback values

### 3. Responsive Design Issues

**Problem**: UI elements cut off on mobile
**Solution**: Tests in `StrategyRow.spec.tsx` verify responsive breakpoints and layout

### 4. Button Styling Inconsistencies

**Problem**: Different button styles across components
**Solution**: Tests in `VaultActionButton.spec.tsx` verify consistent styling

## 📊 Test Reports

### Coverage Report

After running `pnpm run test:coverage`, view the HTML report:

```bash
open coverage/lcov-report/index.html
```

### Test Results

Test results are saved to:

- `test-results/test-report.md` - Markdown summary
- `coverage/` - Detailed coverage reports

## 🔄 Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    pnpm install
    pnpm run test:all
    ./scripts/run-tests.sh
```

## 📝 Best Practices

1. **Test Error Scenarios**: Always test what happens when things go wrong
2. **Mock External Dependencies**: Don't rely on external services in tests
3. **Test User Interactions**: Verify that users can interact with components
4. **Test Responsive Design**: Ensure components work on different screen sizes
5. **Test Accessibility**: Verify ARIA attributes and keyboard navigation
6. **Use Descriptive Test Names**: Make it clear what each test is checking
7. **Group Related Tests**: Use `describe` blocks to organize tests logically

## 🆘 Troubleshooting

### Tests Failing

1. Check if all dependencies are installed: `pnpm install`
2. Clear Jest cache: `pnpm run test --clearCache`
3. Check for TypeScript errors: `pnpm run typecheck:scoped`
4. Verify ESLint passes: `pnpm run lint:scoped`

### Mock Issues

1. Check `src/__tests__/setup.ts` for proper mock configuration
2. Ensure mocks are imported before components
3. Verify mock return values match expected types

### Performance Issues

1. Use `--maxWorkers=1` for debugging: `pnpm run test --maxWorkers=1`
2. Check for memory leaks in long-running tests
3. Optimize test data size for large datasets

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Chakra UI Testing](https://chakra-ui.com/getting-started/testing)
- [Wagmi Testing](https://wagmi.sh/react/testing)

---

**Note**: This testing suite is designed to catch the specific issues you mentioned (RPC errors, Net Value display, responsive design, button styling) and many more. Run the comprehensive test script to ensure everything works correctly before deployment.

