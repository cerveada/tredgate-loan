/**
 * Test suite for loan deletion functionality
 */

import { test } from '@playwright/test'
import { ApplicationPage } from './page-objects/application-page'
import { VALID_LOAN_DATA } from './test-data/loan-data'
import { formatCurrency } from './helpers/test-helpers'

test.describe('Loan Deletion', () => {
  let app: ApplicationPage

  test.beforeEach(async ({ page }) => {
    app = new ApplicationPage(page)
    await app.initialize()
  })

  test('should show confirmation modal when deleting a loan', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.clickDelete(loanData.applicantName)

    await app.confirmModal.verifyDeletionModal(loanData.applicantName)
  })

  test('should delete a pending loan when confirmed', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.assertLoanExists(loanData.applicantName)

    await app.loanList.clickDelete(loanData.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.assertLoanNotExists(loanData.applicantName)
    await app.loanList.assertEmptyState()
    await app.loanSummary.verifyEmptyState()
  })

  test('should not delete loan when cancelled', async () => {
    const loanData = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.assertLoanExists(loanData.applicantName)

    await app.loanList.clickDelete(loanData.applicantName)
    await app.confirmModal.cancelDeletion()

    await app.loanList.assertLoanExists(loanData.applicantName)
    await app.loanSummary.verifySummaryStats(1, 1, 0, 0, '$0')
  })

  test('should delete an approved loan', async () => {
    const loanData = VALID_LOAN_DATA.SMALL_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.approveLoan(loanData.applicantName)

    await app.loanList.clickDelete(loanData.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.assertLoanNotExists(loanData.applicantName)
    await app.loanSummary.verifyEmptyState()
  })

  test('should delete a rejected loan', async () => {
    const loanData = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loanData)
    await app.loanList.rejectLoan(loanData.applicantName)

    await app.loanList.clickDelete(loanData.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.assertLoanNotExists(loanData.applicantName)
    await app.loanSummary.verifyEmptyState()
  })

  test('should delete one loan and keep others', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN
    const loan3 = VALID_LOAN_DATA.LARGE_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)
    await app.loanForm.createLoanApplication(loan3)

    await app.loanList.clickDelete(loan2.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.assertLoanNotExists(loan2.applicantName)
    await app.loanList.assertLoanExists(loan1.applicantName)
    await app.loanList.assertLoanExists(loan3.applicantName)
    await app.loanSummary.verifySummaryStats(2, 2, 0, 0, '$0')
  })

  test('should update summary after deleting approved loan', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)

    await app.loanList.approveLoan(loan1.applicantName)
    await app.loanList.approveLoan(loan2.applicantName)

    const totalBeforeDelete = loan1.amount + loan2.amount
    await app.loanSummary.verifySummaryStats(
      2,
      0,
      2,
      0,
      formatCurrency(totalBeforeDelete)
    )

    await app.loanList.clickDelete(loan1.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanSummary.verifySummaryStats(
      1,
      0,
      1,
      0,
      formatCurrency(loan2.amount)
    )
  })

  test('should delete multiple loans sequentially', async () => {
    const loan1 = VALID_LOAN_DATA.SMALL_LOAN
    const loan2 = VALID_LOAN_DATA.MEDIUM_LOAN

    await app.loanForm.createLoanApplication(loan1)
    await app.loanForm.createLoanApplication(loan2)

    await app.loanList.clickDelete(loan1.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.clickDelete(loan2.applicantName)
    await app.confirmModal.confirmDeletion()

    await app.loanList.assertEmptyState()
    await app.loanSummary.verifyEmptyState()
  })
})
