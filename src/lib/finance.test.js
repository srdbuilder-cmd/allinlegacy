import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMonthlyPayment,
  calculateRemainingBalance,
  saleProceeds,
  financedPrincipal,
} from './finance.js';

describe('calculateMonthlyPayment', () => {
  it('returns 0 for zero principal, rate, or term', () => {
    assert.equal(calculateMonthlyPayment(0, 6.5, 15), 0);
    assert.equal(calculateMonthlyPayment(200000, 0, 15), 0);
    assert.equal(calculateMonthlyPayment(200000, 6.5, 0), 0);
  });

  it('matches a standard 15-year 6.5% amortization', () => {
    const payment = calculateMonthlyPayment(200000, 6.5, 15);
    assert.ok(Math.abs(payment - 1742.21) < 0.5);
  });
});

describe('calculateRemainingBalance', () => {
  it('returns principal when nothing has been paid', () => {
    assert.equal(calculateRemainingBalance(200000, 6.5, 15, 0), 200000);
  });

  it('returns 0 after the loan is fully paid', () => {
    assert.equal(calculateRemainingBalance(200000, 6.5, 15, 180), 0);
  });

  it('declines after one year of payments', () => {
    const remaining = calculateRemainingBalance(200000, 6.5, 15, 12);
    assert.ok(remaining < 200000);
    assert.ok(remaining > 190000);
  });
});

describe('saleProceeds', () => {
  it('applies an editable selling-cost percentage', () => {
    assert.equal(saleProceeds(400000, 0, 9), 364000);
    assert.equal(saleProceeds(400000, 50000, 9), 314000);
  });
});

describe('financedPrincipal', () => {
  it('subtracts the down payment', () => {
    assert.equal(financedPrincipal(200000, 20), 160000);
  });
});
