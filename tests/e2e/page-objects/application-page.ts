/**
 * Application Page Object
 * Main entry point that combines all page objects
 */

import { type Page } from '@playwright/test'
import { BasePage } from './base-page'
import { LoanFormPage } from './loan-form-page'
import { LoanListPage } from './loan-list-page'
import { LoanSummaryPage } from './loan-summary-page'
import { ConfirmModalPage } from './confirm-modal-page'

export class ApplicationPage extends BasePage {
  readonly loanForm: LoanFormPage
  readonly loanList: LoanListPage
  readonly loanSummary: LoanSummaryPage
  readonly confirmModal: ConfirmModalPage

  constructor(page: Page) {
    super(page)
    
    // Initialize all page objects
    this.loanForm = new LoanFormPage(page)
    this.loanList = new LoanListPage(page)
    this.loanSummary = new LoanSummaryPage(page)
    this.confirmModal = new ConfirmModalPage(page)
  }

  /**
   * Initialize the application for testing
   * Clears storage and navigates to the app
   */
  async initialize(): Promise<void> {
    await this.goto()
    await this.clearStorage()
    await this.page.reload()
    await this.waitForPageLoad()
  }
}
