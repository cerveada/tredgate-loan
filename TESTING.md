# Testing Documentation

This document provides a comprehensive guide to the testing infrastructure for the Tredgate Loan application.

## Overview

The application uses **Vitest** as the testing framework, which is a modern, fast unit testing framework specifically designed for Vite projects. All functionalities are covered by unit tests, including business logic, Vue components, and integration between components.

## Test Structure

Tests are organized in the `/tests` directory with the following structure:

```
tests/
├── loanService.test.ts    # Business logic tests
├── LoanForm.test.ts       # LoanForm component tests
├── LoanList.test.ts       # LoanList component tests
├── LoanSummary.test.ts    # LoanSummary component tests
└── App.test.ts            # Main App component tests
```

## Test Coverage

### Business Logic Tests (`loanService.test.ts`)

Tests all functions in `src/services/loanService.ts`:

- **getLoans()** - Retrieves loans from localStorage
- **saveLoans()** - Persists loans to localStorage
- **createLoanApplication()** - Creates new loan with validation
- **updateLoanStatus()** - Updates loan status by ID
- **calculateMonthlyPayment()** - Calculates monthly payment amount
- **autoDecideLoan()** - Auto-approves/rejects based on business rules

**Coverage:** 19 tests covering all edge cases, validation, error handling, and business rules.

### Component Tests

#### LoanForm Component (`LoanForm.test.ts`)

Tests the loan application form component:

- Form rendering and input fields
- Input validation (name, amount, term, interest rate)
- Form submission with valid data
- Error message display
- Form reset after successful submission
- Event emission to parent component
- Error handling from service layer

**Coverage:** 13 tests covering all user interactions and validation scenarios.

#### LoanList Component (`LoanList.test.ts`)

Tests the loan list display and management:

- Table rendering with headers
- Empty state display
- Data formatting (currency, percentage, dates)
- Monthly payment calculation display
- Action buttons (approve, reject, auto-decide) for pending loans
- Event emission for user actions
- Status badge styling
- Edge cases (large amounts, zero interest rate)

**Coverage:** 23 tests covering all display scenarios and user interactions.

#### LoanSummary Component (`LoanSummary.test.ts`)

Tests the statistics summary component:

- All stat cards rendering
- Statistics calculation (total, pending, approved, rejected)
- Total approved amount calculation
- Currency formatting
- Reactive updates when data changes
- CSS class application for different statuses

**Coverage:** 19 tests covering all statistics calculations and display logic.

#### App Component (`App.test.ts`)

Tests the main application component and integration:

- Component rendering (header, logo, child components)
- Data loading on mount
- Prop passing to child components
- Event handling from child components
- Data refresh after operations
- Component interaction flow

**Coverage:** 19 tests covering all integration scenarios.

## Running Tests

### Run All Tests

```bash
npm run test
```

This command runs all tests once and generates an HTML report in the `test-results/` directory.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

This command runs tests in watch mode, automatically re-running tests when files change. Useful during development.

### View HTML Test Report

After running tests, an HTML report is automatically generated. To view it:

```bash
npx vite preview --outDir test-results
```

Then open your browser to the URL shown (typically http://localhost:4173).

The HTML report includes:
- Test execution summary
- Pass/fail status for each test
- Execution time for each test
- Detailed error messages for failed tests
- Interactive UI for exploring test results

## Test Isolation and Mocking

Tests are properly isolated using mocks where needed:

- **localStorage** is mocked in service tests to avoid side effects
- **Service functions** are mocked in component tests to test UI logic independently
- **Partial mocking** is used to mock only stateful functions while keeping pure functions

### Example: Mocking localStorage

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })
```

### Example: Partial Module Mocking

```typescript
vi.mock('../src/services/loanService', async (importOriginal) => {
  const actual = await importOriginal<typeof loanService>()
  return {
    ...actual,
    createLoanApplication: vi.fn() // Mock only this function
  }
})
```

## Best Practices Applied

1. **Clear Test Names** - Each test has a descriptive name explaining what it tests
2. **AAA Pattern** - Tests follow Arrange, Act, Assert pattern
3. **Test Isolation** - Each test is independent and can run in any order
4. **Mock Cleanup** - Mocks are cleared before each test using `beforeEach`
5. **Edge Cases** - Tests cover normal cases, edge cases, and error scenarios
6. **Readability** - Tests are written to be easily understood by other developers
7. **Minimal Test Data** - Only necessary data is included in test fixtures

## Continuous Integration

Tests are automatically run in GitHub Actions on every pull request. See the GitHub Actions Workflow section below for more details.

## Test Statistics

- **Total Tests:** 93
- **Test Files:** 5
- **Code Coverage:** All business logic and components are covered
- **Test Execution Time:** ~2-3 seconds

## Troubleshooting

### Tests Fail Locally

1. Ensure dependencies are installed: `npm install`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check that you're using Node.js LTS version

### HTML Report Not Generated

1. Check that `test-results/` directory exists
2. Run tests again: `npm run test`
3. Check vitest.config.ts for correct reporter configuration

### Mock Not Working

1. Ensure mock is defined before importing the component
2. Clear mocks in `beforeEach` hook
3. Use `vi.mocked()` helper for type-safe mocking

## Adding New Tests

When adding new features:

1. **Add service tests first** - Test business logic in isolation
2. **Add component tests** - Test UI behavior and rendering
3. **Update integration tests** - Test component interactions if needed
4. **Run all tests** - Ensure existing tests still pass
5. **Check coverage** - Verify new code is covered

### Example Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../src/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })

  it('handles user interaction', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('action')).toBeTruthy()
  })
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Vitest UI](https://vitest.dev/guide/ui.html)

## Maintenance

- Review and update tests when features change
- Keep test coverage high (aim for >90%)
- Remove obsolete tests when features are removed
- Refactor tests to improve readability when needed
