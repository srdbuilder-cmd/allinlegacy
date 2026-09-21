export function getHomeCareHours(year, ramp = []) {
  if (!ramp.length) return 0;
  const exact = ramp.find((row) => row.year === year);
  if (exact) return exact.hours;
  const previous = [...ramp].reverse().find((row) => row.year <= year);
  if (previous) return previous.hours;
  return ramp[0].hours;
}

export function facilityLevelForYear(yearIndex, careCosts) {
  if (yearIndex < careCosts.yearsIndependent) return 'independent';
  if (yearIndex < careCosts.yearsIndependent + careCosts.yearsAssisted) return 'assisted';
  return 'skilled';
}

export function facilityAnnualCost(yearIndex, careCosts) {
  const level = facilityLevelForYear(yearIndex, careCosts);
  if (level === 'independent') return careCosts.independent;
  if (level === 'assisted') return careCosts.assisted;
  return careCosts.skilled;
}

export function getFacilityCareCostForMonth(month, careCosts, inflationPct) {
  const yearIndex = Math.floor(month / 12);
  const baseCost = facilityAnnualCost(yearIndex, careCosts);
  const inflationMultiplier = Math.pow(1 + inflationPct / 100, month / 12);
  return (baseCost * inflationMultiplier) / 12;
}

export function getHomeCareAnnual(month, casita, inflationPct, ramp) {
  const year = Math.floor(month / 12) + 1;
  const hours = getHomeCareHours(year, ramp);
  const year1Hours = getHomeCareHours(1, ramp) || 3;
  const hourlyRate = casita.homeCareYear1 / (year1Hours * 52);
  const inflationMultiplier = Math.pow(1 + inflationPct / 100, month / 12);
  return hours * 52 * hourlyRate * inflationMultiplier;
}

export function getOnsiteCareCostForMonth(month, casita, careCosts, inflationPct, ramp) {
  const yearIndex = Math.floor(month / 12);
  const crossover = casita.skilledCrossoverYear ?? careCosts.yearsIndependent + careCosts.yearsAssisted;
  if (yearIndex >= crossover) {
    const inflationMultiplier = Math.pow(1 + inflationPct / 100, month / 12);
    return (careCosts.skilled * inflationMultiplier) / 12;
  }
  return getHomeCareAnnual(month, casita, inflationPct, ramp) / 12;
}

export function yearsSkilledNursing(careCosts) {
  return Math.max(0, careCosts.totalYears - careCosts.yearsIndependent - careCosts.yearsAssisted);
}

export function getCareTypes(startYear, endYear, careCosts) {
  const types = [];
  for (let y = startYear; y <= endYear && y <= careCosts.totalYears; y++) {
    if (y <= careCosts.yearsIndependent) {
      if (!types.includes('Independent Living')) types.push('Independent Living');
    } else if (y <= careCosts.yearsIndependent + careCosts.yearsAssisted) {
      if (!types.includes('Assisted Living')) types.push('Assisted Living');
    } else if (!types.includes('Skilled Nursing')) {
      types.push('Skilled Nursing');
    }
  }
  return types.join(', ');
}

export function getOnsiteCareTypes(startYear, endYear, casita, careCosts) {
  const types = [];
  const crossover = casita.skilledCrossoverYear ?? careCosts.yearsIndependent + careCosts.yearsAssisted;
  for (let y = startYear; y <= endYear && y <= careCosts.totalYears; y++) {
    if (y <= crossover) {
      if (!types.includes('In-home care')) types.push('In-home care');
    } else if (!types.includes('Skilled Nursing')) {
      types.push('Skilled Nursing');
    }
  }
  return types.join(', ');
}
