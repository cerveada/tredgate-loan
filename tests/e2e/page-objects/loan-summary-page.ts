/**
 * Loan Summary Page Object
 * Handles interactions with the loan summary statistics
 */

import { type Page, type Locator, test } from '@playwright/test'
import { BasePage } from './base-page'
import { TEXT } from '../test-data/text-library'

export class LoanSummaryPage extends BasePage {
  // Atomic locators
  private readonly totalApplicationsValue: Locator
  private readonly pendingValue: Locator
  private readonly approvedValue: Locator
  private readonly rejectedValue: Locator
  private readonly totalApprovedValue: Locator

  constructor(page: Page) {
    super(page)
    
    // Initialize locators using more reliable selectors based on actual HTML structure
    this.totalApplicationsValue = page.locator('.stat-card').filter({ hasText: TEXT.SUMMARY_TOTAL }).locator('.stat-value')
    this.pendingValue = page.locator('.stat-card.pending .stat-value')
    this.approvedValue = page.locator('.stat-card.approved .stat-value')
    this.rejectedValue = page.locator('.stat-card.rejected .stat-value')
    this.totalApprovedValue = page.locator('.stat-card.amount .stat-value')
  }

  // Atomic methods

  /**
   * Get total applications count
   */
  async getTotalApplications(): Promise<string> {
    return await this.getTextContent(
      this.totalApplicationsValue,
      'Total applications value'
    )
  }

  /**
   * Get pending count
   */
  async getPendingCount(): Promise<string> {
    return await this.getTextContent(this.pendingValue, 'Pending count value')
  }

  /**
   * Get approved count
   */
  async getApprovedCount(): Promise<string> {
    return await this.getTextContent(this.approvedValue, 'Approved count value')
  }

  /**
   * Get rejected count
   */
  async getRejectedCount(): Promise<string> {
    return await this.getTextContent(this.rejectedValue, 'Rejected count value')
  }

  /**
   * Get total approved amount
   */
  async getTotalApprovedAmount(): Promise<string> {
    return await this.getTextContent(
      this.totalApprovedValue,
      'Total approved amount value'
    )
  }

  /**
   * Assert total applications count
   */
  async assertTotalApplications(expected: number): Promise<void> {
    await this.assertHasText(
      this.totalApplicationsValue,
      expected.toString(),
      'Total applications'
    )
  }

  /**
   * Assert pending count
   */
  async assertPendingCount(expected: number): Promise<void> {
    await this.assertHasText(
      this.pendingValue,
      expected.toString(),
      'Pending count'
    )
  }

  /**
   * Assert approved count
   */
  async assertApprovedCount(expected: number): Promise<void> {
    await this.assertHasText(
      this.approvedValue,
      expected.toString(),
      'Approved count'
    )
  }

  /**
   * Assert rejected count
   */
  async assertRejectedCount(expected: number): Promise<void> {
    await this.assertHasText(
      this.rejectedValue,
      expected.toString(),
      'Rejected count'
    )
  }

  /**
   * Assert total approved amount
   */
  async assertTotalApprovedAmount(expected: string): Promise<void> {
    await this.assertHasText(
      this.totalApprovedValue,
      expected,
      'Total approved amount'
    )
  }

  // Grouped action methods with test.step

  /**
   * Verify all summary statistics
   */
  async verifySummaryStats(
    total: number,
    pending: number,
    approved: number,
    rejected: number,
    totalApproved: string
  ): Promise<void> {
    await test.step('Verify summary statistics', async () => {
      await this.assertTotalApplications(total)
      await this.assertPendingCount(pending)
      await this.assertApprovedCount(approved)
      await this.assertRejectedCount(rejected)
      await this.assertTotalApprovedAmount(totalApproved)
    })
  }

  /**
   * Verify initial empty state
   */
  async verifyEmptyState(): Promise<void> {
    await test.step('Verify empty summary state', async () => {
      await this.assertTotalApplications(0)
      await this.assertPendingCount(0)
      await this.assertApprovedCount(0)
      await this.assertRejectedCount(0)
      await this.assertTotalApprovedAmount('$0')
    })
  }
}
