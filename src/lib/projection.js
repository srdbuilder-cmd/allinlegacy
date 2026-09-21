import {
  calculateMonthlyPayment,
  calculateRemainingBalance,
  saleProceeds,
  financedPrincipal,
  downPaymentAmount,
} from './finance.js';
import { getFacilityCareCostForMonth, getOnsiteCareCostForMonth } from './care.js';
import { calculateRentalIncome } from './rental.js';

export function scenario3DownPayment(inputs) {
  const { gen1, gen2, newHome, sellingCostPct, scenario3Rental, scenario3ManualDP } = inputs;
  const gen2Sale = saleProceeds(gen2.realEstate, gen2.mortgage, sellingCostPct);
  const gen1Sale = scenario3Rental ? 0 : saleProceeds(gen1.realEstate, gen1.mortgage, sellingCostPct);
  const totalProceeds = gen2Sale + gen1Sale;
  const autoDP = newHome.buildCost > 0 ? Math.min(100, (totalProceeds / newHome.buildCost) * 100) : 0;
  const effectiveDP = scenario3ManualDP !== null && scenario3ManualDP !== undefined ? scenario3ManualDP : autoDP;
  return { gen2Sale, gen1Sale, totalProceeds, autoDP, effectiveDP };
}

export function projectScenario(inputs, scenarioNum) {
  const {
    gen1,
    gen2,
    careCosts,
    casita,
    newHome,
    rental,
    economics,
    sellingCostPct,
    homeCareHours,
    scenario1Rental,
    scenario2Rental,
    scenario3Rental,
    scenario3ManualDP,
  } = inputs;

  const totalYears = Math.max(1, Number(careCosts.totalYears) || 15);
  const months = totalYears * 12;

  let gen1RE = gen1.realEstate;
  let gen2RE = gen2.realEstate;
  let gen1Liquid = gen1.liquid;
  let gen2Liquid = gen2.liquid;
  let gen1Debt = gen1.otherDebt;
  let gen2Debt = gen2.otherDebt;
  let gen1Mortgage = gen1.mortgage;
  let gen2Mortgage = gen2.mortgage;
  let careDebt = 0;
  let casitaDebt = 0;
  let newHomeMortgage = 0;

  const isRental =
    scenarioNum === 1 ? scenario1Rental : scenarioNum === 2 ? scenario2Rental : scenario3Rental;

  if (scenarioNum === 1) {
    if (!scenario1Rental) {
      gen1Liquid += saleProceeds(gen1RE, gen1Mortgage, sellingCostPct);
      gen1RE = 0;
      gen1Mortgage = 0;
    }
  } else if (scenarioNum === 2) {
    if (!scenario2Rental) {
      gen1Liquid += saleProceeds(gen1RE, gen1Mortgage, sellingCostPct);
      gen1RE = 0;
      gen1Mortgage = 0;
    }
    casitaDebt = financedPrincipal(casita.buildCost, casita.downPayment);
    gen2Liquid -= downPaymentAmount(casita.buildCost, casita.downPayment);
    gen2RE += casita.buildCost;
  } else if (scenarioNum === 3) {
    const { totalProceeds, effectiveDP } = scenario3DownPayment({
      gen1,
      gen2,
      newHome,
      sellingCostPct,
      scenario3Rental,
      scenario3ManualDP,
    });
    gen2RE = 0;
    gen2Mortgage = 0;
    if (!scenario3Rental) {
      gen1RE = 0;
      gen1Mortgage = 0;
    }
    const dpAmount = downPaymentAmount(newHome.buildCost, effectiveDP);
    newHomeMortgage = newHome.buildCost - dpAmount;
    gen2RE = newHome.buildCost;
    gen2Liquid += totalProceeds - dpAmount;
  }

  const newHomePrincipal = newHomeMortgage;
  const casitaPrincipal = casitaDebt;

  let cumulativeCashFlow = 0;
  const yearly = [];

  for (let month = 0; month < months; month++) {
    const year = month / 12;
    if (month > 0 && month % 12 === 0) {
      if (gen1RE > 0) gen1RE *= 1 + economics.homeAppreciation / 100;
      if (gen2RE > 0) gen2RE *= 1 + economics.homeAppreciation / 100;
      gen1Liquid *= 1 + economics.investmentReturn / 100;
      gen2Liquid *= 1 + economics.investmentReturn / 100;
    }

    const incomeMultiplier = Math.pow(1 + economics.incomeGrowth / 100, year);
    let monthlyIncome = (gen1.monthlyIncome + gen2.monthlyIncome) * incomeMultiplier;
    if (isRental && gen1RE > 0) {
      monthlyIncome += calculateRentalIncome(gen1RE, month, rental, economics.inflation) / 12;
    }

    const expenseMultiplier = Math.pow(1 + economics.inflation / 100, year);
    let monthlyExpenses = gen2.monthlyExpenses * expenseMultiplier;
    if (scenarioNum !== 1) {
      monthlyExpenses += ((casita.foodAnnual + casita.utilitiesAnnual) * expenseMultiplier) / 12;
      monthlyExpenses += gen1.monthlyExpenses * expenseMultiplier;
    }

    const careCost =
      scenarioNum === 1
        ? getFacilityCareCostForMonth(month, careCosts, economics.inflation)
        : getOnsiteCareCostForMonth(month, casita, careCosts, economics.inflation, homeCareHours);

    let debtPayments = 0;
    if (gen1Debt > 0) {
      debtPayments += calculateMonthlyPayment(gen1.otherDebt, gen1.otherDebtRate, gen1.otherDebtTerm);
      gen1Debt = calculateRemainingBalance(gen1.otherDebt, gen1.otherDebtRate, gen1.otherDebtTerm, month + 1);
    }
    if (gen2Debt > 0) {
      debtPayments += calculateMonthlyPayment(gen2.otherDebt, gen2.otherDebtRate, gen2.otherDebtTerm);
      gen2Debt = calculateRemainingBalance(gen2.otherDebt, gen2.otherDebtRate, gen2.otherDebtTerm, month + 1);
    }
    if (gen1Mortgage > 0) {
      debtPayments += calculateMonthlyPayment(gen1.mortgage, gen1.mortgageRate, gen1.mortgageTerm);
      gen1Mortgage = calculateRemainingBalance(gen1.mortgage, gen1.mortgageRate, gen1.mortgageTerm, month + 1);
    }
    if (gen2Mortgage > 0 && scenarioNum !== 3) {
      debtPayments += calculateMonthlyPayment(gen2.mortgage, gen2.mortgageRate, gen2.mortgageTerm);
      gen2Mortgage = calculateRemainingBalance(gen2.mortgage, gen2.mortgageRate, gen2.mortgageTerm, month + 1);
    }
    if (casitaDebt > 0) {
      debtPayments += calculateMonthlyPayment(casitaPrincipal, casita.rate, casita.term);
      casitaDebt = calculateRemainingBalance(casitaPrincipal, casita.rate, casita.term, month + 1);
    }
    if (newHomeMortgage > 0) {
      debtPayments += calculateMonthlyPayment(newHomePrincipal, newHome.rate, newHome.term);
      newHomeMortgage = calculateRemainingBalance(newHomePrincipal, newHome.rate, newHome.term, month + 1);
    }
    if (careDebt > 0) {
      const monthlyRate = gen2.otherDebtRate / 100 / 12;
      careDebt *= 1 + monthlyRate;
    }

    const netCashFlow = monthlyIncome - monthlyExpenses - debtPayments - careCost;
    cumulativeCashFlow += netCashFlow;

    if (netCashFlow < 0) {
      const deficit = -netCashFlow;
      if (gen1Liquid >= deficit) {
        gen1Liquid -= deficit;
      } else if (gen1Liquid > 0) {
        const remaining = deficit - gen1Liquid;
        gen1Liquid = 0;
        if (gen2Liquid >= remaining) {
          gen2Liquid -= remaining;
        } else {
          careDebt += remaining - gen2Liquid;
          gen2Liquid = 0;
        }
      } else if (gen2Liquid >= deficit) {
        gen2Liquid -= deficit;
      } else {
        careDebt += deficit - gen2Liquid;
        gen2Liquid = 0;
      }
    } else {
      gen2Liquid += netCashFlow;
    }

    if ((month + 1) % 12 === 0) {
      yearly.push({
        year: (month + 1) / 12,
        totalWealth:
          gen1RE +
          gen2RE +
          gen1Liquid +
          gen2Liquid -
          gen1Debt -
          gen2Debt -
          gen1Mortgage -
          gen2Mortgage -
          casitaDebt -
          newHomeMortgage -
          careDebt,
        homeValue: gen1RE + gen2RE,
        liquid: gen1Liquid + gen2Liquid,
        careDebt,
        cumulativeCashFlow,
        careCost: careCost * 12,
        netCashFlow,
      });
    }
  }

  return yearly;
}

export function projectAllScenarios(inputs) {
  return {
    1: projectScenario(inputs, 1),
    2: projectScenario(inputs, 2),
    3: projectScenario(inputs, 3),
  };
}

export function snapshotAtYear(series, year) {
  if (!series?.length) return null;
  return series.find((row) => row.year === year) ?? series[series.length - 1];
}
