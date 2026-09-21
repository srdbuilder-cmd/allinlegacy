export function calculateMonthlyPayment(principal, annualRate, years) {
  if (principal <= 0 || years <= 0 || annualRate <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

export function calculateRemainingBalance(principal, annualRate, years, monthsPaid) {
  if (principal <= 0 || years <= 0 || monthsPaid <= 0) return principal;
  if (monthsPaid >= years * 12) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const payment = calculateMonthlyPayment(principal, annualRate, years);
  return (
    principal * Math.pow(1 + monthlyRate, monthsPaid) -
    (payment * (Math.pow(1 + monthlyRate, monthsPaid) - 1)) / monthlyRate
  );
}

export function saleProceeds(homeValue, mortgage, sellingCostPct) {
  return homeValue * (1 - sellingCostPct / 100) - mortgage;
}

export function sellingCostAmount(homeValue, sellingCostPct) {
  return homeValue * (sellingCostPct / 100);
}

export function financedPrincipal(buildCost, downPaymentPct) {
  return buildCost * (1 - downPaymentPct / 100);
}

export function downPaymentAmount(buildCost, downPaymentPct) {
  return buildCost * (downPaymentPct / 100);
}
