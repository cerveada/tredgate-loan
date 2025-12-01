/**
 * Text library for Playwright tests
 * Contains all text constants used in the application and tests
 */

export const TEXT = {
  // Page title
  PAGE_TITLE: 'Tredgate Loan',
  TAGLINE: 'Simple loan application management',

  // Form labels
  FORM_TITLE: 'New Loan Application',
  LABEL_APPLICANT_NAME: 'Applicant Name',
  LABEL_AMOUNT: 'Loan Amount ($)',
  LABEL_TERM: 'Term (Months)',
  LABEL_INTEREST_RATE: 'Interest Rate (e.g., 0.08 for 8%)',
  BUTTON_CREATE: 'Create Application',

  // Placeholders
  PLACEHOLDER_NAME: 'Enter applicant name',
  PLACEHOLDER_AMOUNT: 'Enter loan amount',
  PLACEHOLDER_TERM: 'Enter term in months',
  PLACEHOLDER_RATE: 'Enter interest rate',

  // Loan list
  LIST_TITLE: 'Loan Applications',
  EMPTY_STATE: 'No loan applications yet. Create one using the form.',

  // Table headers
  HEADER_APPLICANT: 'Applicant',
  HEADER_AMOUNT: 'Amount',
  HEADER_TERM: 'Term',
  HEADER_RATE: 'Rate',
  HEADER_MONTHLY_PAYMENT: 'Monthly Payment',
  HEADER_STATUS: 'Status',
  HEADER_CREATED: 'Created',
  HEADER_ACTIONS: 'Actions',

  // Status badges
  STATUS_PENDING: 'pending',
  STATUS_APPROVED: 'approved',
  STATUS_REJECTED: 'rejected',

  // Summary labels
  SUMMARY_TOTAL: 'Total Applications',
  SUMMARY_PENDING: 'Pending',
  SUMMARY_APPROVED: 'Approved',
  SUMMARY_REJECTED: 'Rejected',
  SUMMARY_TOTAL_APPROVED: 'Total Approved',

  // Button titles/tooltips
  BUTTON_APPROVE: 'Approve',
  BUTTON_REJECT: 'Reject',
  BUTTON_AUTO_DECIDE: 'Auto-decide',
  BUTTON_DELETE: 'Delete',

  // Modal
  MODAL_DELETE_TITLE: 'Delete Loan Application',
  MODAL_CONFIRM: 'Delete',
  MODAL_CANCEL: 'Cancel',

  // Error messages
  ERROR_NAME_REQUIRED: 'Applicant name is required',
  ERROR_AMOUNT_POSITIVE: 'Amount must be greater than 0',
  ERROR_TERM_POSITIVE: 'Term months must be greater than 0',
  ERROR_RATE_REQUIRED: 'Interest rate is required and cannot be negative',
} as const

export type TextKey = keyof typeof TEXT
