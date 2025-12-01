/**
 * Loan Form Page Object
 * Handles interactions with the loan application form
 */

import { type Page, type Locator, test, expect } from '@playwright/test'
import { BasePage } from './base-page'
import { TEXT } from '../test-data/text-library'
import type { LoanTestData } from '../test-data/loan-data'

export class LoanFormPage extends BasePage {
  // Atomic locators
  private readonly formTitle: Locator
  private readonly applicantNameInput: Locator
  private readonly amountInput: Locator
  private readonly termInput: Locator
  private readonly interestRateInput: Locator
  private readonly createButton: Locator
  private readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    
    // Initialize locators
    this.formTitle = page.getByRole('heading', { name: TEXT.FORM_TITLE, level: 2 })
    this.applicantNameInput = page.getByLabel(TEXT.LABEL_APPLICANT_NAME)
    this.amountInput = page.getByLabel(TEXT.LABEL_AMOUNT)
    this.termInput = page.getByLabel(TEXT.LABEL_TERM)
    this.interestRateInput = page.getByLabel(TEXT.LABEL_INTEREST_RATE)
    this.createButton = page.getByRole('button', { name: TEXT.BUTTON_CREATE })
    this.errorMessage = page.locator('.error-message')
  }

  // Atomic methods

  /**
   * Fill applicant name field
   */
  async fillApplicantName(name: string): Promise<void> {
    await this.fillInput(this.applicantNameInput, name, 'Applicant Name field')
  }

  /**
   * Fill amount field
   */
  async fillAmount(amount: number): Promise<void> {
    await this.fillInput(this.amountInput, amount, 'Amount field')
  }

  /**
   * Fill term field
   */
  async fillTerm(term: number): Promise<void> {
    await this.fillInput(this.termInput, term, 'Term field')
  }

  /**
   * Fill interest rate field
   */
  async fillInterestRate(rate: number): Promise<void> {
    await this.fillInput(this.interestRateInput, rate, 'Interest Rate field')
  }

  /**
   * Click create application button
   */
  async clickCreateButton(): Promise<void> {
    await this.clickElement(this.createButton, 'Create Application button')
  }

  /**
   * Assert form is visible
   */
  async assertFormVisible(): Promise<void> {
    await this.assertVisible(this.formTitle, 'Loan form title')
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    await this.assertVisible(this.errorMessage, 'Error message')
    await this.assertHasText(this.errorMessage, expectedMessage, 'Error message')
  }

  /**
   * Assert form fields are empty
   */
  async assertFormIsEmpty(): Promise<void> {
    await expect(
      this.applicantNameInput,
      'Applicant name field should be empty'
    ).toHaveValue('')
    await expect(this.amountInput, 'Amount field should be empty').toHaveValue('')
    await expect(this.termInput, 'Term field should be empty').toHaveValue('')
    await expect(
      this.interestRateInput,
      'Interest rate field should be empty'
    ).toHaveValue('')
  }

  // Grouped action methods with test.step

  /**
   * Fill and submit loan application form
   */
  async createLoanApplication(loanData: LoanTestData): Promise<void> {
    await test.step(`Create loan application for ${loanData.applicantName}`, async () => {
      await this.fillApplicantName(loanData.applicantName)
      await this.fillAmount(loanData.amount)
      await this.fillTerm(loanData.termMonths)
      await this.fillInterestRate(loanData.interestRate)
      await this.clickCreateButton()
    })
  }

  /**
   * Fill form without submitting
   */
  async fillLoanForm(loanData: LoanTestData): Promise<void> {
    await test.step(`Fill loan form for ${loanData.applicantName}`, async () => {
      await this.fillApplicantName(loanData.applicantName)
      await this.fillAmount(loanData.amount)
      await this.fillTerm(loanData.termMonths)
      await this.fillInterestRate(loanData.interestRate)
    })
  }

  /**
   * Verify form validation error appears
   */
  async verifyValidationError(errorMessage: string): Promise<void> {
    await test.step(`Verify validation error: ${errorMessage}`, async () => {
      await this.assertErrorMessage(errorMessage)
    })
  }
}
