import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanForm from '../src/components/LoanForm.vue'
import * as loanService from '../src/services/loanService'

// Partial mock: only mock createLoanApplication
vi.mock('../src/services/loanService', async (importOriginal) => {
  const actual = await importOriginal<typeof loanService>()
  return {
    ...actual,
    createLoanApplication: vi.fn()
  }
})

describe('LoanForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with all input fields', () => {
    const wrapper = mount(LoanForm)

    expect(wrapper.find('#applicantName').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('#termMonths').exists()).toBe(true)
    expect(wrapper.find('#interestRate').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('displays correct labels for all fields', () => {
    const wrapper = mount(LoanForm)

    expect(wrapper.text()).toContain('Applicant Name')
    expect(wrapper.text()).toContain('Loan Amount ($)')
    expect(wrapper.text()).toContain('Term (Months)')
    expect(wrapper.text()).toContain('Interest Rate')
    expect(wrapper.text()).toContain('Create Application')
  })

  it('shows error message when applicant name is empty', async () => {
    const wrapper = mount(LoanForm)

    // Fill only partial form
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)

    // Submit form
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Applicant name is required')
    expect(loanService.createLoanApplication).not.toHaveBeenCalled()
  })

  it('shows error message when amount is zero or negative', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(0)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Amount must be greater than 0')
    expect(loanService.createLoanApplication).not.toHaveBeenCalled()
  })

  it('shows error message when term months is zero or negative', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(0)
    await wrapper.find('#interestRate').setValue(0.08)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Term months must be greater than 0')
    expect(loanService.createLoanApplication).not.toHaveBeenCalled()
  })

  it('shows error message when interest rate is negative', async () => {
    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(-0.05)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Interest rate is required and cannot be negative')
    expect(loanService.createLoanApplication).not.toHaveBeenCalled()
  })

  it('creates loan application with valid data', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockCreateLoan).toHaveBeenCalledWith({
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08
    })
  })

  it('emits created event after successful submission', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Alice Smith',
      amount: 25000,
      termMonths: 12,
      interestRate: 0.05,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('Alice Smith')
    await wrapper.find('#amount').setValue(25000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('created')).toBeTruthy()
    expect(wrapper.emitted('created')?.length).toBe(1)
  })

  it('resets form after successful submission', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Test User',
      amount: 10000,
      termMonths: 6,
      interestRate: 0.06,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('Test User')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(6)
    await wrapper.find('#interestRate').setValue(0.06)

    await wrapper.find('form').trigger('submit.prevent')

    // Check that form inputs are cleared
    expect((wrapper.find('#applicantName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#amount').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#termMonths').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#interestRate').element as HTMLInputElement).value).toBe('')
  })

  it('trims whitespace from applicant name', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Trimmed Name',
      amount: 10000,
      termMonths: 6,
      interestRate: 0.06,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('  Trimmed Name  ')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(6)
    await wrapper.find('#interestRate').setValue(0.06)

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockCreateLoan).toHaveBeenCalledWith({
      applicantName: 'Trimmed Name',
      amount: 10000,
      termMonths: 6,
      interestRate: 0.06
    })
  })

  it('displays error message when service throws error', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockImplementation(() => {
      throw new Error('Service error occurred')
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Service error occurred')
  })

  it('displays generic error message for non-Error exceptions', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockImplementation(() => {
      throw 'String error'
    })

    const wrapper = mount(LoanForm)

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Failed to create loan application')
  })

  it('clears error message on new submission attempt', async () => {
    const wrapper = mount(LoanForm)

    // First submission with error
    await wrapper.find('#applicantName').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Applicant name is required')

    // Second submission should clear previous error
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    })

    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    await wrapper.find('form').trigger('submit.prevent')

    // Error should be cleared
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })
})
