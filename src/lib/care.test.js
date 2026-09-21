import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getHomeCareHours,
  facilityLevelForYear,
  getFacilityCareCostForMonth,
  getOnsiteCareCostForMonth,
  yearsSkilledNursing,
} from './care.js';
import { DEFAULT_HOME_CARE_HOURS, DEFAULT_CARE_COSTS, DEFAULT_CASITA } from '../state/defaults.js';

describe('getHomeCareHours', () => {
  it('matches the original 3-5-7-10-14-17 ramp', () => {
    assert.equal(getHomeCareHours(1, DEFAULT_HOME_CARE_HOURS), 3);
    assert.equal(getHomeCareHours(2, DEFAULT_HOME_CARE_HOURS), 5);
    assert.equal(getHomeCareHours(5, DEFAULT_HOME_CARE_HOURS), 14);
    assert.equal(getHomeCareHours(6, DEFAULT_HOME_CARE_HOURS), 17);
    assert.equal(getHomeCareHours(12, DEFAULT_HOME_CARE_HOURS), 17);
  });
});

describe('facilityLevelForYear', () => {
  it('uses independent, then assisted, then skilled', () => {
    assert.equal(facilityLevelForYear(0, DEFAULT_CARE_COSTS), 'independent');
    assert.equal(facilityLevelForYear(3, DEFAULT_CARE_COSTS), 'assisted');
    assert.equal(facilityLevelForYear(8, DEFAULT_CARE_COSTS), 'skilled');
  });
});

describe('getFacilityCareCostForMonth', () => {
  it('returns one-twelfth of the independent annual cost in month 0', () => {
    const monthly = getFacilityCareCostForMonth(0, DEFAULT_CARE_COSTS, 0);
    assert.equal(monthly, DEFAULT_CARE_COSTS.independent / 12);
  });
});

describe('getOnsiteCareCostForMonth', () => {
  it('uses home-care costs before the crossover year', () => {
    const month = 12; // year 2 of care, still in-home
    const cost = getOnsiteCareCostForMonth(month, DEFAULT_CASITA, DEFAULT_CARE_COSTS, 0, DEFAULT_HOME_CARE_HOURS);
    const skilledMonthly = DEFAULT_CARE_COSTS.skilled / 12;
    assert.ok(cost < skilledMonthly);
    assert.ok(cost > 0);
  });

  it('switches to skilled nursing at the crossover year', () => {
    const month = DEFAULT_CASITA.skilledCrossoverYear * 12;
    const cost = getOnsiteCareCostForMonth(month, DEFAULT_CASITA, DEFAULT_CARE_COSTS, 0, DEFAULT_HOME_CARE_HOURS);
    assert.equal(cost, DEFAULT_CARE_COSTS.skilled / 12);
  });
});

describe('yearsSkilledNursing', () => {
  it('is the remainder of the horizon', () => {
    assert.equal(yearsSkilledNursing(DEFAULT_CARE_COSTS), 7);
  });
});
