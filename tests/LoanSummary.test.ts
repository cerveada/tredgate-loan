import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanSummary from '../src/components/LoanSummary.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanSummary.vue', () => {
  const createMockLoan = (overrides: Partial<LoanApplication>): LoanApplication => ({
    id: '1',
    applicantName: 'Test User',
    amount: 50000,
    termMonths: 24,
    interestRate: 0.08,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  })

  it('renders all stat cards', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    expect(wrapper.text()).toContain('Total Applications')
    expect(wrapper.text()).toContain('Pending')
    expect(wrapper.text()).toContain('Approved')
    expect(wrapper.text()).toContain('Rejected')
    expect(wrapper.text()).toContain('Total Approved')
  })

  it('displays zero for all stats when no loans exist', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('0')
    expect(statValues[1].text()).toBe('0')
    expect(statValues[2].text()).toBe('0')
    expect(statValues[3].text()).toBe('0')
    expect(statValues[4].text()).toBe('$0')
  })

  it('calculates total applications correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending' }),
      createMockLoan({ id: '2', status: 'approved' }),
      createMockLoan({ id: '3', status: 'rejected' })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('3')
  })

  it('calculates pending count correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending' }),
      createMockLoan({ id: '2', status: 'pending' }),
      createMockLoan({ id: '3', status: 'approved' })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[1].text()).toBe('2')
  })

  it('calculates approved count correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved' }),
      createMockLoan({ id: '2', status: 'approved' }),
      createMockLoan({ id: '3', status: 'rejected' })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[2].text()).toBe('2')
  })

  it('calculates rejected count correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'rejected' }),
      createMockLoan({ id: '2', status: 'rejected' }),
      createMockLoan({ id: '3', status: 'rejected' })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[3].text()).toBe('3')
  })

  it('calculates total approved amount correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 50000 }),
      createMockLoan({ id: '2', status: 'approved', amount: 75000 }),
      createMockLoan({ id: '3', status: 'pending', amount: 100000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[4].text()).toBe('$125,000')
  })

  it('does not include pending loans in total approved amount', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 50000 }),
      createMockLoan({ id: '2', status: 'pending', amount: 100000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[4].text()).toBe('$50,000')
  })

  it('does not include rejected loans in total approved amount', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 50000 }),
      createMockLoan({ id: '2', status: 'rejected', amount: 100000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[4].text()).toBe('$50,000')
  })

  it('formats currency without decimals for total approved amount', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 50000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    // Should be formatted without decimals
    expect(statValues[4].text()).toBe('$50,000')
  })

  it('applies correct CSS class to pending stat card', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[1].classes()).toContain('pending')
  })

  it('applies correct CSS class to approved stat card', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[2].classes()).toContain('approved')
  })

  it('applies correct CSS class to rejected stat card', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[3].classes()).toContain('rejected')
  })

  it('applies correct CSS class to amount stat card', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[4].classes()).toContain('amount')
  })

  it('handles large total approved amounts correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 999999 }),
      createMockLoan({ id: '2', status: 'approved', amount: 1000000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[4].text()).toBe('$1,999,999')
  })

  it('reactively updates stats when loans prop changes', async () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending' })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    let statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('1')
    expect(statValues[1].text()).toBe('1')

    // Update props
    await wrapper.setProps({
      loans: [
        createMockLoan({ id: '1', status: 'pending' }),
        createMockLoan({ id: '2', status: 'approved', amount: 50000 })
      ]
    })

    statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('2')
    expect(statValues[1].text()).toBe('1')
    expect(statValues[2].text()).toBe('1')
    expect(statValues[4].text()).toBe('$50,000')
  })

  it('displays correct stats for mixed loan statuses', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending', amount: 10000 }),
      createMockLoan({ id: '2', status: 'pending', amount: 20000 }),
      createMockLoan({ id: '3', status: 'approved', amount: 30000 }),
      createMockLoan({ id: '4', status: 'approved', amount: 40000 }),
      createMockLoan({ id: '5', status: 'approved', amount: 50000 }),
      createMockLoan({ id: '6', status: 'rejected', amount: 60000 }),
      createMockLoan({ id: '7', status: 'rejected', amount: 70000 })
    ]

    const wrapper = mount(LoanSummary, {
      props: { loans }
    })

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('7') // Total
    expect(statValues[1].text()).toBe('2') // Pending
    expect(statValues[2].text()).toBe('3') // Approved
    expect(statValues[3].text()).toBe('2') // Rejected
    expect(statValues[4].text()).toBe('$120,000') // Total Approved Amount (30k + 40k + 50k)
  })

  it('renders stat labels with correct text', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const statLabels = wrapper.findAll('.stat-label')
    // Labels are displayed as-is, CSS handles uppercase transformation
    expect(statLabels[0].text()).toBe('Total Applications')
    expect(statLabels[1].text()).toBe('Pending')
    expect(statLabels[2].text()).toBe('Approved')
    expect(statLabels[3].text()).toBe('Rejected')
    expect(statLabels[4].text()).toBe('Total Approved')
  })

  it('renders all stat cards in a flex layout', () => {
    const wrapper = mount(LoanSummary, {
      props: {
        loans: []
      }
    })

    const summary = wrapper.find('.loan-summary')
    expect(summary.exists()).toBe(true)
    
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards).toHaveLength(5)
  })
})
