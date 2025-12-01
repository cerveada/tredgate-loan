import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanList.vue', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.06,
      status: 'approved',
      createdAt: '2024-02-01T14:20:00.000Z'
    },
    {
      id: '3',
      applicantName: 'Bob Johnson',
      amount: 150000,
      termMonths: 72,
      interestRate: 0.09,
      status: 'rejected',
      createdAt: '2024-03-10T09:15:00.000Z'
    }
  ]

  it('renders table headers correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans // Provide loans so table is rendered
      }
    })

    expect(wrapper.text()).toContain('Applicant')
    expect(wrapper.text()).toContain('Amount')
    expect(wrapper.text()).toContain('Term')
    expect(wrapper.text()).toContain('Rate')
    expect(wrapper.text()).toContain('Monthly Payment')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Created')
    expect(wrapper.text()).toContain('Actions')
  })

  it('displays empty state when no loans exist', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: []
      }
    })

    expect(wrapper.text()).toContain('No loan applications yet')
  })

  it('renders loan data correctly in table', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('$50,000.00')
    expect(wrapper.text()).toContain('24 mo')
    expect(wrapper.text()).toContain('8.0%')
    expect(wrapper.text()).toContain('pending')
  })

  it('displays all loans when multiple loans provided', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: mockLoans
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
    expect(wrapper.text()).toContain('Bob Johnson')
  })

  it('formats currency correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    // Should format with $ symbol and comma separators
    expect(wrapper.text()).toContain('$50,000.00')
  })

  it('formats percentage correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    // 0.08 should display as 8.0%
    expect(wrapper.text()).toContain('8.0%')
  })

  it('formats date correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    // Should format date in US locale
    expect(wrapper.text()).toMatch(/Jan\s+15,\s+2024/)
  })

  it('calculates and displays monthly payment correctly', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    // Amount: 50000, Rate: 0.08, Term: 24
    // Total: 50000 * 1.08 = 54000
    // Monthly: 54000 / 24 = 2250
    expect(wrapper.text()).toContain('$2,250.00')
  })

  it('displays approve button for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    const approveButton = wrapper.find('.action-btn.success')
    expect(approveButton.exists()).toBe(true)
    expect(approveButton.attributes('title')).toBe('Approve')
  })

  it('displays reject button for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    const rejectButton = wrapper.find('.action-btn.danger')
    expect(rejectButton.exists()).toBe(true)
    expect(rejectButton.attributes('title')).toBe('Reject')
  })

  it('displays auto-decide button for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    const autoDecideButton = wrapper.find('.action-btn.secondary')
    expect(autoDecideButton.exists()).toBe(true)
    expect(autoDecideButton.attributes('title')).toBe('Auto-decide')
  })

  it('does not display action buttons for approved loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[1]]
      }
    })

    expect(wrapper.find('.action-btn.success').exists()).toBe(false)
    expect(wrapper.find('.action-btn.danger').exists()).toBe(false)
    expect(wrapper.find('.action-btn.secondary').exists()).toBe(false)
  })

  it('does not display action buttons for rejected loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[2]]
      }
    })

    expect(wrapper.find('.action-btn.success').exists()).toBe(false)
    expect(wrapper.find('.action-btn.danger').exists()).toBe(false)
    expect(wrapper.find('.action-btn.secondary').exists()).toBe(false)
  })

  it('emits approve event when approve button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    await wrapper.find('.action-btn.success').trigger('click')

    expect(wrapper.emitted('approve')).toBeTruthy()
    expect(wrapper.emitted('approve')?.[0]).toEqual(['1'])
  })

  it('emits reject event when reject button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    await wrapper.find('.action-btn.danger').trigger('click')

    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')?.[0]).toEqual(['1'])
  })

  it('emits autoDecide event when auto-decide button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    await wrapper.find('.action-btn.secondary').trigger('click')

    expect(wrapper.emitted('autoDecide')).toBeTruthy()
    expect(wrapper.emitted('autoDecide')?.[0]).toEqual(['1'])
  })

  it('applies correct CSS class for pending status', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[0]]
      }
    })

    const statusBadge = wrapper.find('.status-pending')
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.text()).toBe('pending')
  })

  it('applies correct CSS class for approved status', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[1]]
      }
    })

    const statusBadge = wrapper.find('.status-approved')
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.text()).toBe('approved')
  })

  it('applies correct CSS class for rejected status', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[2]]
      }
    })

    const statusBadge = wrapper.find('.status-rejected')
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.text()).toBe('rejected')
  })

  it('renders multiple action buttons for each pending loan', () => {
    const pendingLoans = [
      { ...mockLoans[0], id: '1' },
      { ...mockLoans[0], id: '2' }
    ]
    
    const wrapper = mount(LoanList, {
      props: {
        loans: pendingLoans
      }
    })

    const approveButtons = wrapper.findAll('.action-btn.success')
    const rejectButtons = wrapper.findAll('.action-btn.danger')
    const autoDecideButtons = wrapper.findAll('.action-btn.secondary')

    expect(approveButtons).toHaveLength(2)
    expect(rejectButtons).toHaveLength(2)
    expect(autoDecideButtons).toHaveLength(2)
  })

  it('displays no-actions indicator for non-pending loans', () => {
    const wrapper = mount(LoanList, {
      props: {
        loans: [mockLoans[1]]
      }
    })

    expect(wrapper.find('.no-actions').exists()).toBe(true)
    expect(wrapper.find('.no-actions').text()).toBe('—')
  })

  it('handles large loan amounts correctly', () => {
    const largeAmountLoan: LoanApplication = {
      id: '4',
      applicantName: 'Rich Person',
      amount: 999999,
      termMonths: 60,
      interestRate: 0.05,
      status: 'pending',
      createdAt: '2024-04-01T12:00:00.000Z'
    }

    const wrapper = mount(LoanList, {
      props: {
        loans: [largeAmountLoan]
      }
    })

    expect(wrapper.text()).toContain('$999,999.00')
  })

  it('handles zero interest rate correctly', () => {
    const zeroInterestLoan: LoanApplication = {
      id: '5',
      applicantName: 'Lucky Person',
      amount: 10000,
      termMonths: 12,
      interestRate: 0,
      status: 'approved',
      createdAt: '2024-05-01T12:00:00.000Z'
    }

    const wrapper = mount(LoanList, {
      props: {
        loans: [zeroInterestLoan]
      }
    })

    expect(wrapper.text()).toContain('0.0%')
    // Monthly payment should be 10000 / 12 = 833.33
    expect(wrapper.text()).toContain('$833.33')
  })
})
