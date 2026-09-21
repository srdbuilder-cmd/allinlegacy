import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAnnualRentalIncome, calculateNetMonthlyRental } from './rental.js';
import { DEFAULT_RENTAL } from '../state/defaults.js';

describe('rental income', () => {
  it('nets occupancy, management, tax, and maintenance', () => {
    const homeValue = 400000;
    const result = calculateAnnualRentalIncome(homeValue, DEFAULT_RENTAL, 1);
    assert.equal(result.grossAnnual, 30000);
    assert.equal(result.effectiveRent, 28500);
    assert.equal(result.managementFee, 2850);
    assert.equal(result.taxInsurance, 10000);
    assert.equal(result.maintenance, 4000);
    assert.equal(result.netAnnual, 11650);
    assert.ok(Math.abs(calculateNetMonthlyRental(homeValue, DEFAULT_RENTAL) - 11650 / 12) < 0.001);
  });
});
