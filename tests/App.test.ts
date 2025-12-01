import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../src/App.vue'
import LoanForm from '../src/components/LoanForm.vue'
import LoanList from '../src/components/LoanList.vue'
import LoanSummary from '../src/components/LoanSummary.vue'
import * as loanService from '../src/services/loanService'
import type { LoanApplication } from '../src/types/loan'

// Partial mock: keep calculateMonthlyPayment, mock only the stateful functions
vi.mock('../src/services/loanService', async (importOriginal) => {
  const actual = await importOriginal<typeof loanService>()
  return {
    ...actual,
    getLoans: vi.fn(),
    updateLoanStatus: vi.fn(),
    autoDecideLoan: vi.fn()
  }
})

describe('App.vue', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.06,
      status: 'approved',
      createdAt: '2024-02-01T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(loanService.getLoans).mockReturnValue([])
  })

  it('renders the application header with logo and title', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Tredgate Loan')
    expect(wrapper.find('.logo').exists()).toBe(true)
    expect(wrapper.find('.logo').attributes('alt')).toBe('Tredgate Logo')
  })

  it('renders the tagline', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Simple loan application management')
  })

  it('renders all three main components', () => {
    const wrapper = mount(App)

    expect(wrapper.findComponent(LoanForm).exists()).toBe(true)
    expect(wrapper.findComponent(LoanList).exists()).toBe(true)
    expect(wrapper.findComponent(LoanSummary).exists()).toBe(true)
  })

  it('loads loans on mount', () => {
    mount(App)

    expect(loanService.getLoans).toHaveBeenCalled()
  })

  it('passes loans to LoanList component', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)
    
    const wrapper = mount(App)
    await flushPromises() // Wait for onMounted to complete

    const loanList = wrapper.findComponent(LoanList)
    expect(loanList.props('loans')).toEqual(mockLoans)
  })

  it('passes loans to LoanSummary component', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)
    
    const wrapper = mount(App)
    await flushPromises() // Wait for onMounted to complete

    const loanSummary = wrapper.findComponent(LoanSummary)
    expect(loanSummary.props('loans')).toEqual(mockLoans)
  })

  it('refreshes loans when LoanForm emits created event', async () => {
    vi.mocked(loanService.getLoans)
      .mockReturnValueOnce([])
      .mockReturnValueOnce(mockLoans)

    const wrapper = mount(App)

    // Initially no loans
    expect(wrapper.findComponent(LoanList).props('loans')).toEqual([])

    // Emit created event
    const loanForm = wrapper.findComponent(LoanForm)
    await loanForm.vm.$emit('created')

    // Should reload loans
    expect(loanService.getLoans).toHaveBeenCalledTimes(2)
    expect(wrapper.findComponent(LoanList).props('loans')).toEqual(mockLoans)
  })

  it('calls updateLoanStatus with approved when approve event emitted', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('approve', '1')

    expect(loanService.updateLoanStatus).toHaveBeenCalledWith('1', 'approved')
  })

  it('calls updateLoanStatus with rejected when reject event emitted', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('reject', '1')

    expect(loanService.updateLoanStatus).toHaveBeenCalledWith('1', 'rejected')
  })

  it('calls autoDecideLoan when auto-decide event emitted', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('autoDecide', '1')

    expect(loanService.autoDecideLoan).toHaveBeenCalledWith('1')
  })

  it('refreshes loans after approving', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    // Clear the initial mount call
    vi.mocked(loanService.getLoans).mockClear()

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('approve', '1')

    expect(loanService.getLoans).toHaveBeenCalled()
  })

  it('refreshes loans after rejecting', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    // Clear the initial mount call
    vi.mocked(loanService.getLoans).mockClear()

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('reject', '1')

    expect(loanService.getLoans).toHaveBeenCalled()
  })

  it('refreshes loans after auto-deciding', async () => {
    vi.mocked(loanService.getLoans).mockReturnValue(mockLoans)

    const wrapper = mount(App)

    // Clear the initial mount call
    vi.mocked(loanService.getLoans).mockClear()

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('autoDecide', '1')

    expect(loanService.getLoans).toHaveBeenCalled()
  })

  it('updates LoanList props after approve', async () => {
    const updatedLoans: LoanApplication[] = [
      { ...mockLoans[0]!, status: 'approved' as const },
      mockLoans[1]!
    ]

    vi.mocked(loanService.getLoans)
      .mockReturnValueOnce(mockLoans)
      .mockReturnValueOnce(updatedLoans)

    const wrapper = mount(App)

    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('approve', '1')

    expect(loanList.props('loans')).toEqual(updatedLoans)
  })

  it('updates LoanSummary props after reject', async () => {
    const updatedLoans: LoanApplication[] = [
      { ...mockLoans[0]!, status: 'rejected' as const },
      mockLoans[1]!
    ]

    vi.mocked(loanService.getLoans)
      .mockReturnValueOnce(mockLoans)
      .mockReturnValueOnce(updatedLoans)

    const wrapper = mount(App)

    const loanSummary = wrapper.findComponent(LoanSummary)
    const loanList = wrapper.findComponent(LoanList)
    await loanList.vm.$emit('reject', '1')

    expect(loanSummary.props('loans')).toEqual(updatedLoans)
  })

  it('handles empty loan list correctly', () => {
    vi.mocked(loanService.getLoans).mockReturnValue([])

    const wrapper = mount(App)

    expect(wrapper.findComponent(LoanList).props('loans')).toEqual([])
    expect(wrapper.findComponent(LoanSummary).props('loans')).toEqual([])
  })

  it('renders main content with correct layout structure', () => {
    const wrapper = mount(App)

    const mainContent = wrapper.find('.main-content')
    expect(mainContent.exists()).toBe(true)
    
    // Should contain both LoanForm and LoanList
    const loanForm = mainContent.findComponent(LoanForm)
    const loanList = mainContent.findComponent(LoanList)
    expect(loanForm.exists()).toBe(true)
    expect(loanList.exists()).toBe(true)
  })

  it('renders LoanSummary before main content', () => {
    const wrapper = mount(App)

    const html = wrapper.html()
    const summaryIndex = html.indexOf('loan-summary')
    const mainContentIndex = html.indexOf('main-content')

    expect(summaryIndex).toBeLessThan(mainContentIndex)
  })

  it('has correct logo source path', () => {
    const wrapper = mount(App)

    const logo = wrapper.find('.logo')
    expect(logo.attributes('src')).toBe('/tredgate-logo-original.png')
  })
})
