/**
 * Test suite for loan approval and rejection workflows
 */

import { test } from '@playwright/test'
import { ApplicationPage } from './page-objects/application-page'
import { VALID_LOAN_DATA } from './test-data/loan-data'
import { TEXT } from './test-data/text-library'
import { formatCurrency } from './helpers/test-helpers'

test.describe('Loan Approval and Rejection', () => {
  let app: ApplicationPage

  test.beforeEach(async ({ page }) => {
    app = new ApplicationPage(page)
    await app.initialize()
  })

  test('should approve a pending loan manually', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.assertLoanStatus(loanData.applicantName, TEXT.STATUS_PENDING)

    await app.loanList.approveLoan(loanData.applicantName)

    await app.loanSummary.verifySummaryStats(
      1,
      0,
      1,
      0,
      formatCurrency(loanData.amount)
    )
  })

  test('should reject a pending loan manually', async () => {
    const loanData = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.assertLoanStatus(loanData.applicantName, TEXT.STATUS_PENDING)

    await app.loanList.rejectLoan(loanData.applicantName)

    await app.loanSummary.verifySummaryStats(1, 0, 0, 1, '$0')
  })

  test('should approve multiple loans and update summary correctly', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)

    await app.loanList.approveLoan(loan1.applicantName)
    await app.loanList.approveLoan(loan2.applicantName)

    const totalApproved = loan1.amount + loan2.amount
    await app.loanSummary.verifySummaryStats(
      2,
      0,
      2,
      0,
      formatCurrency(totalApproved)
    )
  })

  test('should handle mixed approval and rejection', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN
    const loan3 = VALID_LOAN_DATA.LARGE_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)
    await app.loanForm.createLoanApplication(loan3)

    await app.loanList.approveLoan(loan1.applicantName)
    await app.loanList.rejectLoan(loan2.applicantName)
    await app.loanList.approveLoan(loan3.applicantName)

    const totalApproved = loan1.amount + loan3.amount
    await app.loanSummary.verifySummaryStats(
      3,
      0,
      2,
      1,
      formatCurrency(totalApproved)
    )
  })

  test('should not show action buttons after approval', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.approveLoan(loanData.applicantName)

    // After approval, approve/reject/auto-decide buttons should not be visible
    // Only delete button should remain
    await app.loanList.assertLoanStatus(loanData.applicantName, TEXT.STATUS_APPROVED)
  })

  test('should not show action buttons after rejection', async () => {
    const loanData = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.rejectLoan(loanData.applicantName)

    // After rejection, approve/reject/auto-decide buttons should not be visible
    // Only delete button should remain
    await app.loanList.assertLoanStatus(loanData.applicantName, TEXT.STATUS_REJECTED)
  })
})

test.describe('Auto-Decide Functionality', () => {
  let app: ApplicationPage

  test.beforeEach(async ({ page }) => {
    app = new ApplicationPage(page)
    await app.initialize()
  })

  test('should auto-approve loan when amount <= 100000 and term <= 60', async () => {
    const loanData = VALID_LOAN_DATA.AUTO_APPROVE

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.autoDecideLoan(loanData.applicantName, TEXT.STATUS_APPROVED)

    await app.loanSummary.verifySummaryStats(
      1,
      0,
      1,
      0,
      formatCurrency(loanData.amount)
    )
  })

  test('should auto-approve loan at exact boundary (100000, 60)', async () => {
    const loanData = VALID_LOAN_DATA.LARGE_LOAN // 100000, 60 months

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.autoDecideLoan(loanData.applicantName, TEXT.STATUS_APPROVED)

    await app.loanSummary.verifySummaryStats(
      1,
      0,
      1,
      0,
      formatCurrency(loanData.amount)
    )
  })

  test('should auto-reject loan when amount > 100000', async () => {
    const loanData = VALID_LOAN_DATA.AUTO_REJECT_AMOUNT

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.autoDecideLoan(loanData.applicantName, TEXT.STATUS_REJECTED)

    await app.loanSummary.verifySummaryStats(1, 0, 0, 1, '$0')
  })

  test('should auto-reject loan when term > 60', async () => {
    const loanData = VALID_LOAN_DATA.AUTO_REJECT_TERM

    await app.loanForm.createLoanApplication(loanData)

    await app.loanList.autoDecideLoan(loanData.applicantName, TEXT.STATUS_REJECTED)

    await app.loanSummary.verifySummaryStats(1, 0, 0, 1, '$0')
  })

  test('should handle auto-decide for multiple loans', async () => {
    const loan1 = VALID_LOAN_DATA.AUTO_APPROVE
    const loan2 = VALID_LOAN_DATA.AUTO_REJECT_AMOUNT

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)

    await app.loanList.autoDecideLoan(loan1.applicantName, TEXT.STATUS_APPROVED)
    await app.loanList.autoDecideLoan(loan2.applicantName, TEXT.STATUS_REJECTED)

    await app.loanSummary.verifySummaryStats(
      2,
      0,
      1,
      1,
      formatCurrency(loan1.amount)
    )
  })
})
