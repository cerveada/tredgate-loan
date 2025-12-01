/**
 * Test suite for creating loan applications
 * Tests the happy path and form validation
 */

import { test, expect } from '@playwright/test'
import { ApplicationPage } from './page-objects/application-page'
import { VALID_LOAN_DATA, INVALID_LOAN_DATA } from './test-data/loan-data'
import { TEXT } from './test-data/text-library'
import { formatCurrency } from './helpers/test-helpers'

test.describe('Loan Creation', () => {
  let app: ApplicationPage

  test.beforeEach(async ({ page }) => {
    app = new ApplicationPage(page)
    await app.initialize()
  })

  test('should display empty state on initial load', async () => {
    await app.loanForm.assertFormVisible()
    await app.loanList.assertEmptyState()
    await app.loanSummary.verifyEmptyState()
  })

  test('should create a small loan application successfully', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.verifyLoanDisplay(
      loanData.applicantName,
      loanData.amount,
      loanData.termMonths,
      loanData.interestRate,
      TEXT.STATUS_PENDING
    )

    await app.loanSummary.verifySummaryStats(1, 1, 0, 0, '$0')
  })

  test('should create a medium loan application successfully', async () => {
    const loanData = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.verifyLoanDisplay(
      loanData.applicantName,
      loanData.amount,
      loanData.termMonths,
      loanData.interestRate,
      TEXT.STATUS_PENDING
    )

    await app.loanSummary.verifySummaryStats(1, 1, 0, 0, '$0')
  })

  test('should create a large loan application successfully', async () => {
    const loanData = VALID_LOAN_DATA.LARGE_LOAN

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.verifyLoanDisplay(
      loanData.applicantName,
      loanData.amount,
      loanData.termMonths,
      loanData.interestRate,
      TEXT.STATUS_PENDING
    )

    await app.loanSummary.verifySummaryStats(1, 1, 0, 0, '$0')
  })

  test('should create a loan with zero interest rate', async () => {
    const loanData = VALID_LOAN_DATA.ZERO_INTEREST

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.verifyLoanDisplay(
      loanData.applicantName,
      loanData.amount,
      loanData.termMonths,
      loanData.interestRate,
      TEXT.STATUS_PENDING
    )
  })

  test('should create multiple loan applications', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanList.assertLoanExists(loan1.applicantName)

    await app.loanForm.createLoanApplication(loan2)
    await app.loanList.assertLoanExists(loan2.applicantName)

    await app.loanSummary.verifySummaryStats(2, 2, 0, 0, '$0')
  })

  test('should clear form after successful submission', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    
    // Form should be cleared after submission
    await app.loanForm.assertFormIsEmpty()
  })
})

test.describe('Form Validation', () => {
  let app: ApplicationPage

  test.beforeEach(async ({ page }) => {
    app = new ApplicationPage(page)
    await app.initialize()
  })

  test('should show error for empty applicant name', async () => {
    const invalidData = INVALID_LOAN_DATA.EMPTY_NAME

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_NAME_REQUIRED)
    await app.loanList.assertEmptyState()
  })

  test('should show error for zero amount', async () => {
    const invalidData = INVALID_LOAN_DATA.ZERO_AMOUNT

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_AMOUNT_POSITIVE)
    await app.loanList.assertEmptyState()
  })

  test('should show error for negative amount', async () => {
    const invalidData = INVALID_LOAN_DATA.NEGATIVE_AMOUNT

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_AMOUNT_POSITIVE)
    await app.loanList.assertEmptyState()
  })

  test('should show error for zero term', async () => {
    const invalidData = INVALID_LOAN_DATA.ZERO_TERM

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_TERM_POSITIVE)
    await app.loanList.assertEmptyState()
  })

  test('should show error for negative term', async () => {
    const invalidData = INVALID_LOAN_DATA.NEGATIVE_TERM

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_TERM_POSITIVE)
    await app.loanList.assertEmptyState()
  })

  test('should show error for negative interest rate', async () => {
    const invalidData = INVALID_LOAN_DATA.NEGATIVE_RATE

    await app.loanForm.fillLoanForm(invalidData)
    await app.loanForm.clickCreateButton()

    await app.loanForm.verifyValidationError(TEXT.ERROR_RATE_REQUIRED)
    await app.loanList.assertEmptyState()
  })
})
