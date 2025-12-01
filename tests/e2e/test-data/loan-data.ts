/**
 * Test data for loan applications
 */

export interface LoanTestData {
  applicantName: string
  amount: number
  termMonths: number
  interestRate: number
}

/**
 * Valid loan application data
 */
export const VALID_LOAN_DATA: Record<string, LoanTestData> = {
  SMALL_LOAN: {
    applicantName: 'John Doe',
    amount: 10000,
    termMonths: 12,
    interestRate: 0.05,
  },
  MEDIUM_LOAN: {
    applicantName: 'Jane Smith',
    amount: 50000,
    termMonths: 36,
    interestRate: 0.08,
  },
  LARGE_LOAN: {
    applicantName: 'Bob Johnson',
    amount: 100000,
    termMonths: 60,
    interestRate: 0.1,
  },
  AUTO_APPROVE: {
    applicantName: 'Auto Approved',
    amount: 90000,
    termMonths: 48,
    interestRate: 0.07,
  },
  AUTO_REJECT_AMOUNT: {
    applicantName: 'Too Much Money',
    amount: 150000,
    termMonths: 48,
    interestRate: 0.08,
  },
  AUTO_REJECT_TERM: {
    applicantName: 'Too Long Term',
    amount: 50000,
    termMonths: 72,
    interestRate: 0.08,
  },
  ZERO_INTEREST: {
    applicantName: 'Zero Interest',
    amount: 20000,
    termMonths: 24,
    interestRate: 0,
  },
}

/**
 * Invalid loan application data for edge case testing
 */
export const INVALID_LOAN_DATA = {
  EMPTY_NAME: {
    applicantName: '',
    amount: 10000,
    termMonths: 12,
    interestRate: 0.05,
  },
  NEGATIVE_AMOUNT: {
    applicantName: 'Negative Amount',
    amount: -5000,
    termMonths: 12,
    interestRate: 0.05,
  },
  ZERO_AMOUNT: {
    applicantName: 'Zero Amount',
    amount: 0,
    termMonths: 12,
    interestRate: 0.05,
  },
  NEGATIVE_TERM: {
    applicantName: 'Negative Term',
    amount: 10000,
    termMonths: -12,
    interestRate: 0.05,
  },
  ZERO_TERM: {
    applicantName: 'Zero Term',
    amount: 10000,
    termMonths: 0,
    interestRate: 0.05,
  },
  NEGATIVE_RATE: {
    applicantName: 'Negative Rate',
    amount: 10000,
    termMonths: 12,
    interestRate: -0.05,
  },
}
