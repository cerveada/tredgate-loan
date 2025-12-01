/**
 * Base Page Object
 * Contains common functionality for all page objects
 */

import { type Page, type Locator, expect } from '@playwright/test'

export class BasePage {
  protected readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigate to the application
   */
  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  /**
   * Wait for page to be loaded and ready
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Clear localStorage to reset application state
   */
  async clearStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear())
  }

  /**
   * Get text content of an element with assertion
   */
  async getTextContent(locator: Locator, errorMessage: string): Promise<string> {
    await expect(locator, errorMessage).toBeVisible()
    const text = await locator.textContent()
    expect(text, `${errorMessage} - text should not be null`).not.toBeNull()
    return text!.trim()
  }

  /**
   * Click element with custom error message
   */
  async clickElement(locator: Locator, elementName: string): Promise<void> {
    await expect(locator, `${elementName} should be visible`).toBeVisible()
    await locator.click()
  }

  /**
   * Fill input with custom error message
   */
  async fillInput(
    locator: Locator,
    value: string | number,
    fieldName: string
  ): Promise<void> {
    await expect(locator, `${fieldName} should be visible`).toBeVisible()
    await locator.fill(String(value))
  }

  /**
   * Assert element is visible
   */
  async assertVisible(locator: Locator, elementName: string): Promise<void> {
    await expect(locator, `${elementName} should be visible`).toBeVisible()
  }

  /**
   * Assert element is not visible
   */
  async assertNotVisible(locator: Locator, elementName: string): Promise<void> {
    await expect(locator, `${elementName} should not be visible`).not.toBeVisible()
  }

  /**
   * Assert element has text
   */
  async assertHasText(
    locator: Locator,
    text: string | RegExp,
    elementName: string
  ): Promise<void> {
    await expect(locator, `${elementName} should have text: ${text}`).toHaveText(text)
  }

  /**
   * Assert element contains text
   */
  async assertContainsText(
    locator: Locator,
    text: string | RegExp,
    elementName: string
  ): Promise<void> {
    await expect(locator, `${elementName} should contain text: ${text}`).toContainText(
      text
    )
  }
}
