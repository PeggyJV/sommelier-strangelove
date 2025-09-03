#!/bin/bash

# Comprehensive Test Runner for Sommelier-Strangelove
# This script runs all types of tests and provides detailed reporting

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run tests with timeout
run_test_with_timeout() {
    local test_command="$1"
    local timeout_seconds="$2"
    local test_name="$3"
    
    print_status "Running $test_name..."
    
    if timeout "$timeout_seconds" bash -c "$test_command"; then
        print_success "$test_name completed successfully"
        return 0
    else
        print_error "$test_name failed or timed out"
        return 1
    fi
}

# Main test execution
main() {
    print_status "Starting comprehensive test suite for Sommelier-Strangelove"
    print_status "Timestamp: $(date)"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if pnpm is available
    if ! command_exists pnpm; then
        print_error "pnpm is not installed. Please install pnpm first."
        exit 1
    fi
    
    # Check if Node.js is available
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        pnpm install
    fi
    
    # Create test results directory
    mkdir -p test-results
    
    # Initialize test counters
    total_tests=0
    passed_tests=0
    failed_tests=0
    
    # Function to update test counters
    update_counters() {
        local exit_code=$1
        total_tests=$((total_tests + 1))
        if [ $exit_code -eq 0 ]; then
            passed_tests=$((passed_tests + 1))
        else
            failed_tests=$((failed_tests + 1))
        fi
    }
    
    print_status "Running pre-test checks..."
    
    # 1. Type checking
    print_status "Running TypeScript type checking..."
    if run_test_with_timeout "pnpm run typecheck:scoped" 60 "TypeScript type checking"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 2. Linting
    print_status "Running ESLint..."
    if run_test_with_timeout "pnpm run lint:scoped" 60 "ESLint"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 3. Build test
    print_status "Running build test..."
    if run_test_with_timeout "pnpm run build" 300 "Build test"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    print_status "Running unit tests..."
    
    # 4. Unit tests for components
    print_status "Running component unit tests..."
    if run_test_with_timeout "pnpm run test:unit" 120 "Component unit tests"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 5. Hook tests
    print_status "Running hook tests..."
    if run_test_with_timeout "pnpm run test:hooks" 120 "Hook tests"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 6. Utility tests
    print_status "Running utility tests..."
    if run_test_with_timeout "pnpm run test:utils" 120 "Utility tests"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 7. API tests
    print_status "Running API tests..."
    if run_test_with_timeout "pnpm run test:api" 120 "API tests"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    print_status "Running integration tests..."
    
    # 8. Integration tests
    print_status "Running integration tests..."
    if run_test_with_timeout "pnpm run test:integration" 180 "Integration tests"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # 9. Full test suite with coverage
    print_status "Running full test suite with coverage..."
    if run_test_with_timeout "pnpm run test:coverage" 300 "Full test suite with coverage"; then
        update_counters 0
    else
        update_counters 1
    fi
    
    # Generate test report
    print_status "Generating test report..."
    
    cat > test-results/test-report.md << EOF
# Test Report - Sommelier-Strangelove

**Generated:** $(date)
**Total Tests:** $total_tests
**Passed:** $passed_tests
**Failed:** $failed_tests
**Success Rate:** $((passed_tests * 100 / total_tests))%

## Test Categories

### Pre-Test Checks
- ✅ TypeScript type checking
- ✅ ESLint
- ✅ Build test

### Unit Tests
- ✅ Component unit tests
- ✅ Hook tests
- ✅ Utility tests
- ✅ API tests

### Integration Tests
- ✅ Integration tests
- ✅ Full test suite with coverage

## Coverage Report

Coverage report is available in the \`coverage/\` directory.

## Error Summary

$(if [ $failed_tests -gt 0 ]; then
    echo "Some tests failed. Check the output above for details."
else
    echo "All tests passed successfully!"
fi)

## Next Steps

$(if [ $failed_tests -eq 0 ]; then
    echo "✅ All tests passed! The application is ready for deployment."
else
    echo "❌ Some tests failed. Please fix the issues before proceeding."
fi)
EOF
    
    # Print summary
    echo
    print_status "=== TEST SUMMARY ==="
    print_status "Total Tests: $total_tests"
    print_status "Passed: $passed_tests"
    print_status "Failed: $failed_tests"
    print_status "Success Rate: $((passed_tests * 100 / total_tests))%"
    
    if [ $failed_tests -eq 0 ]; then
        print_success "All tests passed! 🎉"
        echo
        print_status "Test report saved to: test-results/test-report.md"
        print_status "Coverage report available in: coverage/"
        exit 0
    else
        print_error "$failed_tests test(s) failed. Please check the output above."
        echo
        print_status "Test report saved to: test-results/test-report.md"
        exit 1
    fi
}

# Run main function
main "$@"

