/**
 * Helper functions for calculations and formatting
 */

import type { LoanTestData } from '../test-data/loan-data'

/**
 * Calculate expected monthly payment
 * Formula: total = amount * (1 + interestRate), monthly = total / termMonths
 */
export function calculateExpectedMonthlyPayment(loan: LoanTestData): number {
  const total = loan.amount * (1 + loan.interestRate)
  return total / loan.termMonths
}

/**
 * Format currency value as displayed in the application
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format interest rate as percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Check if loan should be auto-approved based on business rules
 * - Approved if amount <= 100000 AND termMonths <= 60
 * - Rejected otherwise
 */
export function shouldAutoApprove(loan: LoanTestData): boolean {
  return loan.amount <= 100000 && loan.termMonths <= 60
}

/**
 * Wait for a specific duration
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
