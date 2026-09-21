import { useCallback, useEffect, useMemo, useState } from 'react';
import { createDefaultPlan } from './defaults.js';
import { loadPlan, savePlan } from './planStore.js';

function mergePlan(saved) {
  const base = createDefaultPlan();
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    gen1: { ...base.gen1, ...(saved.gen1 || {}) },
    gen2: { ...base.gen2, ...(saved.gen2 || {}) },
    careCosts: { ...base.careCosts, ...(saved.careCosts || {}) },
    casita: { ...base.casita, ...(saved.casita || {}) },
    newHome: { ...base.newHome, ...(saved.newHome || {}) },
    rental: { ...base.rental, ...(saved.rental || {}) },
    economics: { ...base.economics, ...(saved.economics || {}) },
    homeCareHours: Array.isArray(saved.homeCareHours) && saved.homeCareHours.length
      ? saved.homeCareHours.map((row) => ({ ...row }))
      : base.homeCareHours,
  };
}

export function usePlanState() {
  const [plan, setPlan] = useState(() => mergePlan(loadPlan()));

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  const patch = useCallback((key, value) => {
    setPlan((current) => ({
      ...current,
      [key]: typeof value === 'function' ? value(current[key]) : { ...current[key], ...value },
    }));
  }, []);

  const setField = useCallback((key, value) => {
    setPlan((current) => ({ ...current, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setPlan(createDefaultPlan());
  }, []);

  const inputs = useMemo(() => plan, [plan]);

  return {
    plan,
    inputs,
    setPlan,
    setGen1: (value) => patch('gen1', value),
    setGen2: (value) => patch('gen2', value),
    setCareCosts: (value) => patch('careCosts', value),
    setCasita: (value) => patch('casita', value),
    setNewHome: (value) => patch('newHome', value),
    setRental: (value) => patch('rental', value),
    setEconomics: (value) => patch('economics', value),
    setHomeCareHours: (value) => setField('homeCareHours', value),
    setSellingCostPct: (value) => setField('sellingCostPct', value),
    setScenario1Rental: (value) => setField('scenario1Rental', value),
    setScenario2Rental: (value) => setField('scenario2Rental', value),
    setScenario3Rental: (value) => setField('scenario3Rental', value),
    setScenario3ManualDP: (value) => setField('scenario3ManualDP', value),
    resetToDefaults,
  };
}
