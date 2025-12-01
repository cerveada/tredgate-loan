/**
 * Confirm Modal Page Object
 * Handles interactions with the delete confirmation modal
 */

import { type Page, type Locator, test } from '@playwright/test'
import { BasePage } from './base-page'
import { TEXT } from '../test-data/text-library'

export class ConfirmModalPage extends BasePage {
  // Atomic locators
  private readonly modal: Locator
  private readonly modalTitle: Locator
  private readonly modalMessage: Locator
  private readonly confirmButton: Locator
  private readonly cancelButton: Locator

  constructor(page: Page) {
    super(page)
    
    // Initialize locators
    this.modal = page.locator('.modal-overlay')
    this.modalTitle = page.locator('.modal-header h3')
    this.modalMessage = page.locator('.modal-body p')
    this.confirmButton = page.getByRole('button', { name: TEXT.MODAL_CONFIRM })
    this.cancelButton = page.getByRole('button', { name: TEXT.MODAL_CANCEL })
  }

  // Atomic methods

  /**
   * Click confirm button
   */
  async clickConfirm(): Promise<void> {
    await this.clickElement(this.confirmButton, 'Confirm button')
  }

  /**
   * Click cancel button
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton, 'Cancel button')
  }

  /**
   * Assert modal is visible
   */
  async assertModalVisible(): Promise<void> {
    await this.assertVisible(this.modal, 'Confirmation modal')
    await this.assertVisible(this.modalTitle, 'Modal title')
  }

  /**
   * Assert modal is not visible
   */
  async assertModalNotVisible(): Promise<void> {
    await this.assertNotVisible(this.modal, 'Confirmation modal')
  }

  /**
   * Assert modal message contains applicant name
   */
  async assertModalMessage(applicantName: string): Promise<void> {
    await this.assertContainsText(
      this.modalMessage,
      applicantName,
      'Modal message'
    )
  }

  // Grouped action methods with test.step

  /**
   * Confirm deletion in the modal
   */
  async confirmDeletion(): Promise<void> {
    await test.step('Confirm deletion in modal', async () => {
      await this.assertModalVisible()
      await this.clickConfirm()
      await this.assertModalNotVisible()
    })
  }

  /**
   * Cancel deletion in the modal
   */
  async cancelDeletion(): Promise<void> {
    await test.step('Cancel deletion in modal', async () => {
      await this.assertModalVisible()
      await this.clickCancel()
      await this.assertModalNotVisible()
    })
  }

  /**
   * Verify modal for specific loan deletion
   */
  async verifyDeletionModal(applicantName: string): Promise<void> {
    await test.step(`Verify deletion modal for ${applicantName}`, async () => {
      await this.assertModalVisible()
      await this.assertModalMessage(applicantName)
    })
  }
}
