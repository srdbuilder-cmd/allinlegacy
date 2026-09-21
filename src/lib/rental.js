export function calculateAnnualRentalIncome(homeValue, rental, inflationMultiplier = 1) {
  const grossAnnual = rental.monthlyRent * 12 * inflationMultiplier;
  const effectiveRent = grossAnnual * (rental.occupancy / 100);
  const managementFee = effectiveRent * (rental.managementFee / 100);
  const taxInsurance = homeValue * (rental.taxInsurance / 100) * inflationMultiplier;
  const maintenance = homeValue * (rental.maintenance / 100) * inflationMultiplier;
  return {
    grossAnnual,
    effectiveRent,
    managementFee,
    taxInsurance,
    maintenance,
    netAnnual: effectiveRent - managementFee - taxInsurance - maintenance,
  };
}

export function calculateRentalIncome(homeValue, month, rental, inflationPct) {
  const inflationMultiplier = Math.pow(1 + inflationPct / 100, month / 12);
  const breakdown = calculateAnnualRentalIncome(homeValue, rental, inflationMultiplier);
  return Math.max(0, breakdown.netAnnual);
}

export function calculateNetMonthlyRental(homeValue, rental) {
  return Math.max(0, calculateAnnualRentalIncome(homeValue, rental, 1).netAnnual) / 12;
}
