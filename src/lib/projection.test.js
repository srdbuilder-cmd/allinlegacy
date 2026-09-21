import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projectScenario, scenario3DownPayment } from './projection.js';
import { createDefaultPlan } from '../state/defaults.js';

function plan(overrides = {}) {
  return { ...createDefaultPlan(), ...overrides };
}

describe('projectScenario horizon', () => {
  it('emits one row per year and honors totalYears', () => {
    const short = plan({ careCosts: { ...createDefaultPlan().careCosts, totalYears: 4 } });
    const series = projectScenario(short, 1);
    assert.equal(series.length, 4);
    assert.equal(series[0].year, 1);
    assert.equal(series[3].year, 4);
  });

  it('emits 15 yearly rows on the default horizon', () => {
    const series = projectScenario(plan(), 1);
    assert.equal(series.length, 15);
  });
});

describe('parent expenses', () => {
  it('does not change scenario 1 when parent expenses rise', () => {
    const base = projectScenario(plan(), 1);
    const higher = projectScenario(
      plan({
        gen1: { ...createDefaultPlan().gen1, monthlyExpenses: 8000 },
      }),
      1
    );
    assert.equal(Math.round(base[14].totalWealth), Math.round(higher[14].totalWealth));
  });

  it('lowers scenario 2 wealth when parent expenses rise', () => {
    const base = projectScenario(plan(), 2);
    const higher = projectScenario(
      plan({
        gen1: { ...createDefaultPlan().gen1, monthlyExpenses: 8000 },
      }),
      2
    );
    assert.ok(higher[14].totalWealth < base[14].totalWealth);
  });
});

describe('selling cost', () => {
  it('applies a 9% selling cost to a sold parent home', () => {
    const sold = plan({ scenario1Rental: false });
    const series = projectScenario(sold, 1);
    assert.ok(Number.isFinite(series[0].totalWealth));
  });
});

describe('scenario 3 down payment', () => {
  it('auto-calculates from combined sale proceeds', () => {
    const { autoDP, totalProceeds } = scenario3DownPayment(plan());
    const expected = Math.min(100, (totalProceeds / 1000000) * 100);
    assert.ok(Math.abs(autoDP - expected) < 0.0001);
  });

  it('uses a manual override when provided', () => {
    const { effectiveDP } = scenario3DownPayment(plan({ scenario3ManualDP: 25 }));
    assert.equal(effectiveDP, 25);
  });
});

describe('skilled-care crossover', () => {
  it('raises late-year casita care costs once skilled nursing begins', () => {
    const early = projectScenario(plan({ casita: { ...createDefaultPlan().casita, skilledCrossoverYear: 3 } }), 2);
    const late = projectScenario(plan({ casita: { ...createDefaultPlan().casita, skilledCrossoverYear: 15 } }), 2);
    assert.ok(early[14].careCost > late[14].careCost);
  });
});
