/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/__tests__/polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    '<rootDir>/src/__tests__/stubs/',
    '<rootDir>/src/__tests__/setup.ts',
    '<rootDir>/src/__tests__/polyfills.ts',
    '<rootDir>/src/__tests__/mocks/'
  ],
  testTimeout: 300000,
  clearMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        isolatedModules: true,
        noEmit: true,
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true
      }
    }],
    '^.+\\.jsx?$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        jsx: 'react-jsx'
      }
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!((\\.pnpm/)?(@rainbow-me|wagmi|@wagmi|viem|@viem|@tanstack/query-core|@tanstack/react-query))(.*))'
  ],
  moduleNameMapper: {
    '^wagmi/chains$': '<rootDir>/src/__tests__/mocks/wagmi-chains.ts',
    '^wagmi$': '<rootDir>/src/__tests__/mocks/wagmi.ts',
    '^wagmi/(.*)$': '<rootDir>/src/__tests__/mocks/wagmi.ts',
    '^analytics$': '<rootDir>/src/__tests__/mocks/analytics.ts',
    '^@analytics/(.*)$': '<rootDir>/src/__tests__/mocks/analytics.ts',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^data/(.*)$': '<rootDir>/src/data/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^context/(.*)$': '<rootDir>/src/context/$1',
    '^queries/(.*)$': '<rootDir>/src/queries/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^constants/(.*)$': '<rootDir>/src/constants/$1',
    '^styles/(.*)$': '<rootDir>/src/styles/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^api/(.*)$': '<rootDir>/src/pages/api/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/mocks/**',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml'
    }]
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
