import { describe, it, expect } from 'vitest'
import { hasOverlap } from './dateOverlap'

describe('hasOverlap', () => {
  it('returns false when bookings array is empty', () => {
    expect(
      hasOverlap(
        [],
        new Date('2025-01-01'),
        new Date('2025-01-05'),
      ),
    ).toBe(false)
  })

  it('returns false when new booking does not overlap with existing', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-05' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-06'),
        new Date('2025-01-10'),
      ),
    ).toBe(false)
  })

  it('returns true when new booking overlaps with existing', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-10' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-05'),
        new Date('2025-01-15'),
      ),
    ).toBe(true)
  })

  it('returns false when editing same booking (excludeId)', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-10' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-01'),
        new Date('2025-01-10'),
        '1',
      ),
    ).toBe(false)
  })

  it('returns false for adjacent dates (end of one equals start of other)', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-05' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-05'),
        new Date('2025-01-10'),
      ),
    ).toBe(false)
  })

  it('returns true when new booking fully contains existing', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-05', endDate: '2025-01-08' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-01'),
        new Date('2025-01-15'),
      ),
    ).toBe(true)
  })

  it('returns true when new booking is fully inside existing', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-15' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-05'),
        new Date('2025-01-08'),
      ),
    ).toBe(true)
  })

  it('returns true when overlapping with any of multiple bookings', () => {
    const bookings = [
      { id: '1', startDate: '2025-01-01', endDate: '2025-01-05' },
      { id: '2', startDate: '2025-01-10', endDate: '2025-01-15' },
    ]
    expect(
      hasOverlap(
        bookings,
        new Date('2025-01-12'),
        new Date('2025-01-18'),
      ),
    ).toBe(true)
  })
})
