import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatSignedCurrency, formatPercent } from './formatters.js';

describe('formatters', () => {
  it('formats currency with a dollar sign', () => {
    assert.equal(formatCurrency(1234.4), '$1,234');
    assert.equal(formatCurrency(-50), '-$50');
  });

  it('adds a plus sign for positive deltas', () => {
    assert.equal(formatSignedCurrency(100), '+$100');
  });

  it('formats percents', () => {
    assert.equal(formatPercent(9, 0), '9%');
  });
});
