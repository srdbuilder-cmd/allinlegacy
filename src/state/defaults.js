export const DEFAULT_GEN1 = {
  realEstate: 400000,
  mortgage: 0,
  mortgageRate: 0,
  mortgageTerm: 0,
  liquid: 300000,
  monthlyIncome: 3000,
  monthlyExpenses: 2000,
  otherDebt: 0,
  otherDebtRate: 6,
  otherDebtTerm: 10,
};

export const DEFAULT_GEN2 = {
  realEstate: 800000,
  mortgage: 0,
  mortgageRate: 0,
  mortgageTerm: 0,
  liquid: 1500000,
  monthlyIncome: 8000,
  monthlyExpenses: 5000,
  otherDebt: 0,
  otherDebtRate: 6,
  otherDebtTerm: 10,
};

export const DEFAULT_CARE_COSTS = {
  independent: 37000,
  assisted: 72000,
  skilled: 131000,
  totalYears: 15,
  yearsIndependent: 3,
  yearsAssisted: 5,
};

export const DEFAULT_HOME_CARE_HOURS = [
  { year: 1, hours: 3 },
  { year: 2, hours: 5 },
  { year: 3, hours: 7 },
  { year: 4, hours: 10 },
  { year: 5, hours: 14 },
  { year: 6, hours: 17 },
];

export const DEFAULT_CASITA = {
  buildCost: 200000,
  downPayment: 20,
  rate: 6.5,
  term: 15,
  homeCareYear1: 3432,
  foodAnnual: 4800,
  utilitiesAnnual: 1800,
  skilledCrossoverYear: DEFAULT_CARE_COSTS.yearsIndependent + DEFAULT_CARE_COSTS.yearsAssisted,
};

export const DEFAULT_NEW_HOME = {
  buildCost: 1000000,
  downPayment: 20,
  rate: 6.5,
  term: 30,
};

export const DEFAULT_RENTAL = {
  monthlyRent: 2500,
  occupancy: 95,
  managementFee: 10,
  taxInsurance: 2.5,
  maintenance: 1,
};

export const DEFAULT_ECONOMICS = {
  inflation: 3,
  investmentReturn: 6,
  homeAppreciation: 3.5,
  incomeGrowth: 2,
};

export const DEFAULT_SELLING_COST_PCT = 9;

export function createDefaultPlan() {
  return {
    gen1: { ...DEFAULT_GEN1 },
    gen2: { ...DEFAULT_GEN2 },
    careCosts: { ...DEFAULT_CARE_COSTS },
    casita: { ...DEFAULT_CASITA },
    newHome: { ...DEFAULT_NEW_HOME },
    rental: { ...DEFAULT_RENTAL },
    economics: { ...DEFAULT_ECONOMICS },
    sellingCostPct: DEFAULT_SELLING_COST_PCT,
    homeCareHours: DEFAULT_HOME_CARE_HOURS.map((row) => ({ ...row })),
    scenario1Rental: false,
    scenario2Rental: false,
    scenario3Rental: false,
    scenario3ManualDP: null,
  };
}

export const SCENARIO_META = {
  1: { id: 1, key: 'facility', name: 'Care Facility', shortName: 'Facility', color: 'forest' },
  2: { id: 2, key: 'casita', name: 'Build Casita', shortName: 'Casita', color: 'mustard' },
  3: { id: 3, key: 'newHome', name: 'Sell & Build New', shortName: 'New Home', color: 'ink' },
};
