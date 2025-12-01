/**
 * Loan List Page Object
 * Handles interactions with the loan applications list/table
 */

import { type Page, type Locator, test } from '@playwright/test'
import { BasePage } from './base-page'
import { TEXT } from '../test-data/text-library'
import { formatCurrency, formatPercent } from '../helpers/test-helpers'

export class LoanListPage extends BasePage {
  // Atomic locators
  private readonly listTitle: Locator
  private readonly emptyState: Locator
  private readonly table: Locator
  private readonly tableRows: Locator

  constructor(page: Page) {
    super(page)
    
    // Initialize locators
    this.listTitle = page.getByRole('heading', { name: TEXT.LIST_TITLE, level: 2 })
    this.emptyState = page.getByText(TEXT.EMPTY_STATE)
    this.table = page.locator('table')
    this.tableRows = page.locator('tbody tr')
  }

  // Atomic methods

  /**
   * Get a specific row by applicant name
   */
  private getRowByApplicant(applicantName: string): Locator {
    return this.page.locator('tbody tr', { hasText: applicantName })
  }

  /**
   * Get approve button for a specific loan
   */
  private getApproveButton(applicantName: string): Locator {
    return this.getRowByApplicant(applicantName).locator('button[title="Approve"]')
  }

  /**
   * Get reject button for a specific loan
   */
  private getRejectButton(applicantName: string): Locator {
    return this.getRowByApplicant(applicantName).locator('button[title="Reject"]')
  }

  /**
   * Get auto-decide button for a specific loan
   */
  private getAutoDecideButton(applicantName: string): Locator {
    return this.getRowByApplicant(applicantName).locator('button[title="Auto-decide"]')
  }

  /**
   * Get delete button for a specific loan
   */
  private getDeleteButton(applicantName: string): Locator {
    return this.getRowByApplicant(applicantName).locator('button[title="Delete"]')
  }

  /**
   * Get status badge for a specific loan
   */
  private getStatusBadge(applicantName: string): Locator {
    return this.getRowByApplicant(applicantName).locator('.status-badge')
  }

  /**
   * Click approve button for a loan
   */
  async clickApprove(applicantName: string): Promise<void> {
    await this.clickElement(
      this.getApproveButton(applicantName),
      `Approve button for ${applicantName}`
    )
  }

  /**
   * Click reject button for a loan
   */
  async clickReject(applicantName: string): Promise<void> {
    await this.clickElement(
      this.getRejectButton(applicantName),
      `Reject button for ${applicantName}`
    )
  }

  /**
   * Click auto-decide button for a loan
   */
  async clickAutoDecide(applicantName: string): Promise<void> {
    await this.clickElement(
      this.getAutoDecideButton(applicantName),
      `Auto-decide button for ${applicantName}`
    )
  }

  /**
   * Click delete button for a loan
   */
  async clickDelete(applicantName: string): Promise<void> {
    await this.clickElement(
      this.getDeleteButton(applicantName),
      `Delete button for ${applicantName}`
    )
  }

  /**
   * Assert empty state is visible
   */
  async assertEmptyState(): Promise<void> {
    await this.assertVisible(this.emptyState, 'Empty state message')
  }

  /**
   * Assert table is visible
   */
  async assertTableVisible(): Promise<void> {
    await this.assertVisible(this.table, 'Loan applications table')
  }

  /**
   * Assert loan appears in the list
   */
  async assertLoanExists(applicantName: string): Promise<void> {
    await this.assertVisible(
      this.getRowByApplicant(applicantName),
      `Loan row for ${applicantName}`
    )
  }

  /**
   * Assert loan does not appear in the list
   */
  async assertLoanNotExists(applicantName: string): Promise<void> {
    await this.assertNotVisible(
      this.getRowByApplicant(applicantName),
      `Loan row for ${applicantName}`
    )
  }

  /**
   * Assert loan status
   */
  async assertLoanStatus(applicantName: string, status: string): Promise<void> {
    await this.assertHasText(
      this.getStatusBadge(applicantName),
      status,
      `Status badge for ${applicantName}`
    )
  }

  /**
   * Assert loan details in the table
   */
  async assertLoanDetails(
    applicantName: string,
    amount: number,
    term: number,
    rate: number
  ): Promise<void> {
    const row = this.getRowByApplicant(applicantName)
    await this.assertContainsText(row, formatCurrency(amount), `Amount for ${applicantName}`)
    await this.assertContainsText(row, `${term} mo`, `Term for ${applicantName}`)
    await this.assertContainsText(row, formatPercent(rate), `Rate for ${applicantName}`)
  }

  /**
   * Get the count of loans in the table
   */
  async getLoanCount(): Promise<number> {
    return await this.tableRows.count()
  }

  // Grouped action methods with test.step

  /**
   * Approve a loan application
   */
  async approveLoan(applicantName: string): Promise<void> {
    await test.step(`Approve loan for ${applicantName}`, async () => {
      await this.clickApprove(applicantName)
      await this.assertLoanStatus(applicantName, TEXT.STATUS_APPROVED)
    })
  }

  /**
   * Reject a loan application
   */
  async rejectLoan(applicantName: string): Promise<void> {
    await test.step(`Reject loan for ${applicantName}`, async () => {
      await this.clickReject(applicantName)
      await this.assertLoanStatus(applicantName, TEXT.STATUS_REJECTED)
    })
  }

  /**
   * Auto-decide a loan application
   */
  async autoDecideLoan(applicantName: string, expectedStatus: string): Promise<void> {
    await test.step(`Auto-decide loan for ${applicantName}`, async () => {
      await this.clickAutoDecide(applicantName)
      await this.assertLoanStatus(applicantName, expectedStatus)
    })
  }

  /**
   * Verify loan is displayed with correct details
   */
  async verifyLoanDisplay(
    applicantName: string,
    amount: number,
    term: number,
    rate: number,
    status: string
  ): Promise<void> {
    await test.step(`Verify loan display for ${applicantName}`, async () => {
      await this.assertLoanExists(applicantName)
      await this.assertLoanDetails(applicantName, amount, term, rate)
      await this.assertLoanStatus(applicantName, status)
    })
  }
}
