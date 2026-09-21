import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compareScenarios, findFirstYearBehind, buildProjectionCsv } from './compare.js';
import { projectAllScenarios } from './projection.js';
import { createDefaultPlan } from '../state/defaults.js';

describe('compareScenarios', () => {
  it('picks a winner and writes a verdict from default inputs', () => {
    const results = projectAllScenarios(createDefaultPlan());
    const comparison = compareScenarios(results);
    assert.ok([1, 2, 3].includes(comparison.winnerId));
    assert.equal(comparison.cards.length, 3);
    assert.ok(comparison.verdict.length > 20);
    assert.equal(comparison.horizonYear, 15);
  });
});

describe('findFirstYearBehind', () => {
  it('returns the first year the candidate is poorer', () => {
    const baseline = [{ year: 1, totalWealth: 100 }, { year: 2, totalWealth: 200 }];
    const candidate = [{ year: 1, totalWealth: 110 }, { year: 2, totalWealth: 150 }];
    assert.equal(findFirstYearBehind(candidate, baseline), 2);
  });
});

describe('buildProjectionCsv', () => {
  it('includes a header and one row per year', () => {
    const results = projectAllScenarios(createDefaultPlan());
    const csv = buildProjectionCsv(results);
    const lines = csv.trim().split('\n');
    assert.equal(lines.length, 16);
    assert.match(lines[0], /Year/);
  });
});
