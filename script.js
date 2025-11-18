const { useState, useEffect } = React;

// Simple alert icon as replacement for lucide
const AlertCircle = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const ElderCarePlanner = () => {
  const [gen1, setGen1] = useState({
    realEstate: 400000,
    mortgage: 0,
    mortgageRate: 0,
    mortgageTerm: 0,
    liquid: 300000,
    monthlyIncome: 3000,
    monthlyExpenses: 2000,
    otherDebt: 0,
    otherDebtRate: 6,
    otherDebtTerm: 10
  });

  const [gen2, setGen2] = useState({
    realEstate: 800000,
    mortgage: 0,
    mortgageRate: 0,
    mortgageTerm: 0,
    liquid: 1500000,
    monthlyIncome: 8000,
    monthlyExpenses: 5000,
    otherDebt: 0,
    otherDebtRate: 6,
    otherDebtTerm: 10
  });

  const [careCosts, setCareCosts] = useState({
    independent: 37000,
    assisted: 72000,
    skilled: 131000,
    totalYears: 15,
    yearsIndependent: 3,
    yearsAssisted: 5
  });

  const [casita, setCasita] = useState({
    buildCost: 200000,
    downPayment: 20,
    rate: 6.5,
    term: 15,
    homeCareYear1: 3432,
    foodAnnual: 4800,
    utilitiesAnnual: 1800
  });

  const [newHome, setNewHome] = useState({
    buildCost: 1000000,
    downPayment: 20,
    rate: 6.5,
    term: 30
  });

  const [rental, setRental] = useState({
    monthlyRent: 2500,
    occupancy: 95,
    managementFee: 10,
    taxInsurance: 2.5,
    maintenance: 1
  });

  const [economics, setEconomics] = useState({
    inflation: 3,
    investmentReturn: 6,
    homeAppreciation: 3.5,
    incomeGrowth: 2
  });

  const [scenario1Rental, setScenario1Rental] = useState(false);
  const [scenario2Rental, setScenario2Rental] = useState(false);
  const [scenario3Rental, setScenario3Rental] = useState(false);
  const [scenario3AutoDP, setScenario3AutoDP] = useState(20);
  const [scenario3ManualDP, setScenario3ManualDP] = useState(null);

  const calculateMonthlyPayment = (principal, annualRate, years) => {
    if (principal <= 0 || years <= 0 || annualRate <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const calculateRemainingBalance = (principal, annualRate, years, monthsPaid) => {
    if (principal <= 0 || years <= 0 || monthsPaid <= 0) return principal;
    if (monthsPaid >= years * 12) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const payment = calculateMonthlyPayment(principal, annualRate, years);
    return principal * Math.pow(1 + monthlyRate, monthsPaid) - 
           payment * (Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate;
  };

  const calculateRentalIncome = (homeValue, month) => {
    const inflationMultiplier = Math.pow(1 + economics.inflation / 100, month / 12);
    const grossAnnual = rental.monthlyRent * 12 * inflationMultiplier;
    const effectiveRent = grossAnnual * (rental.occupancy / 100);
    const managementFee = effectiveRent * (rental.managementFee / 100);
    const taxInsurance = homeValue * (rental.taxInsurance / 100) * inflationMultiplier;
    const maintenance = homeValue * (rental.maintenance / 100) * inflationMultiplier;
    return Math.max(0, effectiveRent - managementFee - taxInsurance - maintenance);
  };

  const getHomeCareHours = (year) => {
    if (year <= 1) return 3;
    if (year === 2) return 5;
    if (year === 3) return 7;
    if (year === 4) return 10;
    if (year === 5) return 14;
    return 17;
  };

  const calculateHomeCare = (month) => {
    const year = Math.floor(month / 12) + 1;
    const hours = getHomeCareHours(year);
    const hourlyRate = casita.homeCareYear1 / (3 * 52);
    const inflationMultiplier = Math.pow(1 + economics.inflation / 100, month / 12);
    return hours * 52 * hourlyRate * inflationMultiplier;
  };

  const getCareCostForMonth = (month) => {
    const year = Math.floor(month / 12);
    let baseCost;
    if (year < careCosts.yearsIndependent) {
      baseCost = careCosts.independent;
    } else if (year < careCosts.yearsIndependent + careCosts.yearsAssisted) {
      baseCost = careCosts.assisted;
    } else {
      baseCost = careCosts.skilled;
    }
    const inflationMultiplier = Math.pow(1 + economics.inflation / 100, month / 12);
    return baseCost * inflationMultiplier / 12;
  };

  const projectScenario = (scenarioNum) => {
    const months = 15 * 12;
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
    
    const isRental = scenarioNum === 1 ? scenario1Rental : 
                     scenarioNum === 2 ? scenario2Rental : scenario3Rental;

    if (scenarioNum === 1) {
      if (!scenario1Rental) {
        const saleProceeds = gen1RE * 0.91 - gen1Mortgage;
        gen1Liquid += saleProceeds;
        gen1RE = 0;
        gen1Mortgage = 0;
      }
    } else if (scenarioNum === 2) {
      if (!scenario2Rental) {
        const saleProceeds = gen1RE * 0.91 - gen1Mortgage;
        gen1Liquid += saleProceeds;
        gen1RE = 0;
        gen1Mortgage = 0;
      }
      casitaDebt = casita.buildCost * (1 - casita.downPayment / 100);
      const downPaymentAmount = casita.buildCost * (casita.downPayment / 100);
      gen2Liquid -= downPaymentAmount;
      gen2RE += casita.buildCost;
    } else if (scenarioNum === 3) {
      const gen2SaleProceeds = gen2RE * 0.91 - gen2Mortgage;
      gen2RE = 0;
      gen2Mortgage = 0;
      let totalProceeds = gen2SaleProceeds;
      if (!scenario3Rental) {
        const gen1SaleProceeds = gen1RE * 0.91 - gen1Mortgage;
        totalProceeds += gen1SaleProceeds;
        gen1RE = 0;
        gen1Mortgage = 0;
      }
      const autoCalcDP = Math.min(100, (totalProceeds / newHome.buildCost) * 100);
      const effectiveDP = scenario3ManualDP !== null ? scenario3ManualDP : autoCalcDP;
      const downPaymentAmount = newHome.buildCost * (effectiveDP / 100);
      newHomeMortgage = newHome.buildCost - downPaymentAmount;
      gen2RE = newHome.buildCost;
      const excessLiquid = totalProceeds - downPaymentAmount;
      gen2Liquid += excessLiquid;
    }

    let cumulativeCashFlow = 0;
    const results = [];

    for (let month = 0; month < months; month++) {
      const year = month / 12;
      if (month > 0 && month % 12 === 0) {
        if (gen1RE > 0) gen1RE *= (1 + economics.homeAppreciation / 100);
        if (gen2RE > 0) gen2RE *= (1 + economics.homeAppreciation / 100);
        gen1Liquid *= (1 + economics.investmentReturn / 100);
        gen2Liquid *= (1 + economics.investmentReturn / 100);
      }

      const incomeMultiplier = Math.pow(1 + economics.incomeGrowth / 100, year);
      let monthlyIncome = (gen1.monthlyIncome + gen2.monthlyIncome) * incomeMultiplier;
      if (isRental && gen1RE > 0) {
        monthlyIncome += calculateRentalIncome(gen1RE, month) / 12;
      }

      const expenseMultiplier = Math.pow(1 + economics.inflation / 100, year);
      let monthlyExpenses = gen2.monthlyExpenses * expenseMultiplier;
      if (scenarioNum !== 1) {
        monthlyExpenses += (casita.foodAnnual + casita.utilitiesAnnual) * expenseMultiplier / 12;
      }

      let careCost = 0;
      if (scenarioNum === 1) {
        careCost = getCareCostForMonth(month);
      } else {
        careCost = calculateHomeCare(month) / 12;
      }

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
        debtPayments += calculateMonthlyPayment(casita.buildCost * (1 - casita.downPayment / 100), casita.rate, casita.term);
        casitaDebt = calculateRemainingBalance(casita.buildCost * (1 - casita.downPayment / 100), casita.rate, casita.term, month + 1);
      }
      if (newHomeMortgage > 0) {
        const principal = newHome.buildCost * (1 - (scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP) / 100);
        debtPayments += calculateMonthlyPayment(principal, newHome.rate, newHome.term);
        newHomeMortgage = calculateRemainingBalance(principal, newHome.rate, newHome.term, month + 1);
      }
      if (careDebt > 0) {
        const monthlyRate = gen2.otherDebtRate / 100 / 12;
        careDebt *= (1 + monthlyRate);
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

      if ((month + 1) % 60 === 0) {
        const yearNum = (month + 1) / 12;
        results.push({
          year: yearNum,
          totalWealth: gen1RE + gen2RE + gen1Liquid + gen2Liquid - gen1Debt - gen2Debt - gen1Mortgage - gen2Mortgage - casitaDebt - newHomeMortgage - careDebt,
          homeValue: gen1RE + gen2RE,
          liquid: gen1Liquid + gen2Liquid,
          careDebt,
          cumulativeCashFlow,
          careCost: careCost * 12
        });
      }
    }
    return results;
  };

  const scenario1Results = projectScenario(1);
  const scenario2Results = projectScenario(2);
  const scenario3Results = projectScenario(3);

  useEffect(() => {
    const gen2SaleProceeds = gen2.realEstate * 0.91 - gen2.mortgage;
    let totalProceeds = gen2SaleProceeds;
    if (!scenario3Rental) {
      const gen1SaleProceeds = gen1.realEstate * 0.91 - gen1.mortgage;
      totalProceeds += gen1SaleProceeds;
    }
    const autoDP = Math.min(100, (totalProceeds / newHome.buildCost) * 100);
    setScenario3AutoDP(autoDP);
  }, [gen1, gen2, newHome.buildCost, scenario3Rental]);

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString('en-US');
  };

  const formatCurrency = (num) => {
    return '$' + formatNumber(num);
  };

  const getCareTypes = (startYear, endYear) => {
    const types = [];
    for (let y = startYear; y <= endYear && y <= careCosts.totalYears; y++) {
      if (y <= careCosts.yearsIndependent) {
        if (!types.includes('Independent Living')) types.push('Independent Living');
      } else if (y <= careCosts.yearsIndependent + careCosts.yearsAssisted) {
        if (!types.includes('Assisted Living')) types.push('Assisted Living');
      } else {
        if (!types.includes('Skilled Nursing')) types.push('Skilled Nursing');
      }
    }
    return types.join(', ');
  };

  const resetToDefaults = () => {
    setGen1({ realEstate: 400000, mortgage: 0, mortgageRate: 0, mortgageTerm: 0, liquid: 300000, monthlyIncome: 3000, monthlyExpenses: 2000, otherDebt: 0, otherDebtRate: 6, otherDebtTerm: 10 });
    setGen2({ realEstate: 800000, mortgage: 0, mortgageRate: 0, mortgageTerm: 0, liquid: 1500000, monthlyIncome: 8000, monthlyExpenses: 5000, otherDebt: 0, otherDebtRate: 6, otherDebtTerm: 10 });
    setCareCosts({ independent: 37000, assisted: 72000, skilled: 131000, totalYears: 15, yearsIndependent: 3, yearsAssisted: 5 });
    setCasita({ buildCost: 200000, downPayment: 20, rate: 6.5, term: 15, homeCareYear1: 3432, foodAnnual: 4800, utilitiesAnnual: 1800 });
    setNewHome({ buildCost: 1000000, downPayment: 20, rate: 6.5, term: 30 });
    setRental({ monthlyRent: 2500, occupancy: 95, managementFee: 10, taxInsurance: 2.5, maintenance: 1 });
    setEconomics({ inflation: 3, investmentReturn: 6, homeAppreciation: 3.5, incomeGrowth: 2 });
    setScenario1Rental(false);
    setScenario2Rental(false);
    setScenario3Rental(false);
    setScenario3ManualDP(null);
  };

  const calculateNetMonthlyRental = () => {
    const grossAnnual = rental.monthlyRent * 12;
    const effectiveRent = grossAnnual * (rental.occupancy / 100);
    const managementFee = effectiveRent * (rental.managementFee / 100);
    const taxInsurance = gen1.realEstate * (rental.taxInsurance / 100);
    const maintenance = gen1.realEstate * (rental.maintenance / 100);
    return Math.max(0, effectiveRent - managementFee - taxInsurance - maintenance) / 12;
  };

  const RentalBreakdown = () => {
    const grossAnnual = rental.monthlyRent * 12;
    const effectiveRent = grossAnnual * (rental.occupancy / 100);
    const managementFee = effectiveRent * (rental.managementFee / 100);
    const taxInsurance = gen1.realEstate * (rental.taxInsurance / 100);
    const maintenance = gen1.realEstate * (rental.maintenance / 100);
    const netAnnual = effectiveRent - managementFee - taxInsurance - maintenance;

    return (
      <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-3">Gen 1 Rental Income Breakdown</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Gross Annual Rent:</div>
          <div className="text-right font-semibold">${formatNumber(grossAnnual)}</div>
          <div>Effective Rent (after {rental.occupancy}% occupancy):</div>
          <div className="text-right font-semibold">${formatNumber(effectiveRent)}</div>
          <div>Management Fee ({rental.managementFee}%):</div>
          <div className="text-right text-red-600">-${formatNumber(managementFee)}</div>
          <div>Tax & Insurance ({rental.taxInsurance}%):</div>
          <div className="text-right text-red-600">-${formatNumber(taxInsurance)}</div>
          <div>Maintenance ({rental.maintenance}%):</div>
          <div className="text-right text-red-600">-${formatNumber(maintenance)}</div>
          <div className="font-bold border-t pt-2">Net Annual Rental Income:</div>
          <div className="text-right font-bold text-green-600 border-t pt-2">${formatNumber(netAnnual)}</div>
        </div>
      </div>
    );
  };

  const NumberInput = ({ label, value, onChange, step, helpText, disabled }) => {
    const [displayValue, setDisplayValue] = useState(value.toLocaleString('en-US'));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value.toLocaleString('en-US'));
      }
    }, [value, isFocused]);

    const handleFocus = () => {
      setIsFocused(true);
      setDisplayValue(value.toString());
    };

    const handleBlur = () => {
      setIsFocused(false);
      const numValue = parseFloat(displayValue.replace(/,/g, ''));
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
      setDisplayValue(value.toLocaleString('en-US'));
    };

    const handleChange = (e) => {
      const rawValue = e.target.value;
      setDisplayValue(rawValue);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
        />
        {helpText && <p className="text-xs text-gray-600 mt-1">{helpText}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="flex items-center gap-6">
      <img 
        src="https://i.imgur.com/jwCLJx2.png" 
        alt="Company Logo" 
        className="h-auto max-h-24 object-contain"
      />
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Elder Care Financial Planner</h1>
        <p className="text-indigo-100">Multi-generational wealth planning for elder care decisions</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={resetToDefaults} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition whitespace-nowrap">
        Reset to Defaults
      </button>
      <img 
        src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2161027940/settings_images/840367-2ba-6e3-507c-d715bbbed5d0_All_In_-_Logo_3.png" 
        alt="All In Logo" 
        className="h-auto max-h-24 object-contain"
      />
    </div>
  </div>
</div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Understanding the Three Scenarios</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-700 mb-1">Scenario 1: Move to Care Facility</h3>
                <p className="text-gray-700 mb-3">Gen 1 transitions through progressive care levels at a professional facility. Option to sell home or keep as rental.</p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={scenario1Rental} onChange={(e) => setScenario1Rental(e.target.checked)} className="w-5 h-5 text-purple-600 rounded" />
                    <div>
                      <span className="font-semibold text-purple-900">Keep Gen 1 Home as Rental</span>
                      <p className="text-sm text-purple-700">{scenario1Rental ? "Gen 1 home will be kept and rented for income" : "Gen 1 home will be sold with 9% costs"}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-700 mb-1">Scenario 2: Build Casita</h3>
                <p className="text-gray-700 mb-3">Gen 2 adds a casita to their property for Gen 1. Includes financing construction plus escalating home care.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={scenario2Rental} onChange={(e) => setScenario2Rental(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                    <div>
                      <span className="font-semibold text-blue-900">Keep Gen 1 Home as Rental</span>
                      <p className="text-sm text-blue-700">{scenario2Rental ? "Gen 1 home will be kept and rented for income" : "Gen 1 home will be sold with 9% costs"}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-700 mb-1">Scenario 3: Sell & Build New</h3>
                <p className="text-gray-700 mb-3">Sell Gen 2 home (always) and build new with integrated casita. Option to keep or sell Gen 1 home.</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={scenario3Rental} onChange={(e) => setScenario3Rental(e.target.checked)} className="w-5 h-5 text-amber-600 rounded" />
                    <div>
                      <span className="font-semibold text-amber-900">Keep Gen 1 Home as Rental</span>
                      <p className="text-sm text-amber-700">{scenario3Rental ? "Gen 1 home will be kept and rented for income" : "Gen 1 home will be sold with 9% costs"}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(scenario1Rental || scenario2Rental || scenario3Rental) && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏠</span>
              <h2 className="text-xl font-bold">Rental Income Assumptions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NumberInput label="Monthly Rent" value={rental.monthlyRent} onChange={(v) => setRental({...rental, monthlyRent: v})} />
              <NumberInput label="Occupancy Rate (%)" value={rental.occupancy} onChange={(v) => setRental({...rental, occupancy: v})} />
              <NumberInput label="Management Fee (%)" value={rental.managementFee} onChange={(v) => setRental({...rental, managementFee: v})} />
              <NumberInput label="Tax/Insurance (%)" value={rental.taxInsurance} onChange={(v) => setRental({...rental, taxInsurance: v})} step="0.1" helpText="% of home value annually" />
              <NumberInput label="Maintenance (%)" value={rental.maintenance} onChange={(v) => setRental({...rental, maintenance: v})} step="0.1" helpText="% of home value annually" />
            </div>
            <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-4">
              <p className="font-semibold text-blue-900">Estimated Net Monthly Income: ${formatNumber(calculateNetMonthlyRental())}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-4 border-rose-300 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-rose-700">Gen 1 (Parent/Grandparent)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NumberInput label="Real Estate Value" value={gen1.realEstate} onChange={(v) => setGen1({...gen1, realEstate: v})} />
              <NumberInput label="Mortgage" value={gen1.mortgage} onChange={(v) => setGen1({...gen1, mortgage: v})} />
              <NumberInput label="Liquid Assets" value={gen1.liquid} onChange={(v) => setGen1({...gen1, liquid: v})} />
              <NumberInput label="Monthly Income" value={gen1.monthlyIncome} onChange={(v) => setGen1({...gen1, monthlyIncome: v})} />
              <NumberInput label="Monthly Expenses" value={gen1.monthlyExpenses} onChange={(v) => setGen1({...gen1, monthlyExpenses: v})} />
              <NumberInput label="Other Debt" value={gen1.otherDebt} onChange={(v) => setGen1({...gen1, otherDebt: v})} />
              <NumberInput label="Other Debt Rate (%)" value={gen1.otherDebtRate} onChange={(v) => setGen1({...gen1, otherDebtRate: v})} step="0.1" />
              <NumberInput label="Other Debt Term (Yrs)" value={gen1.otherDebtTerm} onChange={(v) => setGen1({...gen1, otherDebtTerm: v})} />
            </div>
          </div>

          <div className="bg-white border-4 border-blue-300 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Gen 2 (Adult Child)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NumberInput label="Real Estate Value" value={gen2.realEstate} onChange={(v) => setGen2({...gen2, realEstate: v})} />
              <NumberInput label="Mortgage" value={gen2.mortgage} onChange={(v) => setGen2({...gen2, mortgage: v})} />
              <NumberInput label="Liquid Assets" value={gen2.liquid} onChange={(v) => setGen2({...gen2, liquid: v})} />
              <NumberInput label="Monthly Income" value={gen2.monthlyIncome} onChange={(v) => setGen2({...gen2, monthlyIncome: v})} />
              <NumberInput label="Monthly Expenses" value={gen2.monthlyExpenses} onChange={(v) => setGen2({...gen2, monthlyExpenses: v})} />
              <NumberInput label="Other Debt" value={gen2.otherDebt} onChange={(v) => setGen2({...gen2, otherDebt: v})} />
              <NumberInput label="Other Debt Rate (%)" value={gen2.otherDebtRate} onChange={(v) => setGen2({...gen2, otherDebtRate: v})} step="0.1" />
              <NumberInput label="Other Debt Term (Yrs)" value={gen2.otherDebtTerm} onChange={(v) => setGen2({...gen2, otherDebtTerm: v})} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Scenario 1: Care Facility Costs & Timeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput label="Independent Living (Annual)" value={careCosts.independent} onChange={(v) => setCareCosts({...careCosts, independent: v})} />
            <NumberInput label="Assisted Living (Annual)" value={careCosts.assisted} onChange={(v) => setCareCosts({...careCosts, assisted: v})} />
            <NumberInput label="Skilled Nursing (Annual)" value={careCosts.skilled} onChange={(v) => setCareCosts({...careCosts, skilled: v})} />
            <NumberInput label="Total Life Expectancy (Years)" value={careCosts.totalYears} onChange={(v) => setCareCosts({...careCosts, totalYears: v})} />
            <NumberInput label="Years Independent Living" value={careCosts.yearsIndependent} onChange={(v) => setCareCosts({...careCosts, yearsIndependent: v})} />
            <NumberInput label="Years Assisted Living" value={careCosts.yearsAssisted} onChange={(v) => setCareCosts({...careCosts, yearsAssisted: v})} />
          </div>
          <p className="text-sm text-gray-600 mt-2">Years Skilled Nursing: {careCosts.totalYears - careCosts.yearsIndependent - careCosts.yearsAssisted} (Auto-calculated)</p>
          {scenario1Rental && <RentalBreakdown />}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Scenario 2: Casita Construction & Care Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput label="Casita Build Cost" value={casita.buildCost} onChange={(v) => setCasita({...casita, buildCost: v})} />
            <NumberInput label="Down Payment (%)" value={casita.downPayment} onChange={(v) => setCasita({...casita, downPayment: v})} step="0.1" />
            <NumberInput label="Financing Rate (%)" value={casita.rate} onChange={(v) => setCasita({...casita, rate: v})} step="0.1" />
            <NumberInput label="Financing Term (Years)" value={casita.term} onChange={(v) => setCasita({...casita, term: v})} />
            <NumberInput label="Home Care Year 1 (Annual)" value={casita.homeCareYear1} onChange={(v) => setCasita({...casita, homeCareYear1: v})} helpText="Escalates over 6 years" />
            <NumberInput label="Food (Annual)" value={casita.foodAnnual} onChange={(v) => setCasita({...casita, foodAnnual: v})} />
            <NumberInput label="Utilities (Annual)" value={casita.utilitiesAnnual} onChange={(v) => setCasita({...casita, utilitiesAnnual: v})} />
          </div>
          <p className="text-xs text-gray-600 mt-2 italic">All costs inflate at {economics.inflation}% annually</p>
          {scenario2Rental && <RentalBreakdown />}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-amber-700">Scenario 3: New Home Construction</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput label="New Home Build Cost" value={newHome.buildCost} onChange={(v) => setNewHome({...newHome, buildCost: v})} />
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment (%)</label>
              <input type="number" step="0.1" value={scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP.toFixed(1)} onChange={(e) => setScenario3ManualDP(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <p className="text-xs text-gray-600 mt-1">Auto-calculated: {scenario3AutoDP.toFixed(1)}%</p>
            </div>
            <NumberInput label="Mortgage Rate (%)" value={newHome.rate} onChange={(v) => setNewHome({...newHome, rate: v})} step="0.1" />
            <NumberInput label="Mortgage Term (Years)" value={newHome.term} onChange={(v) => setNewHome({...newHome, term: v})} />
          </div>
          
          <div className="mt-6 bg-amber-50 border border-amber-300 rounded-lg p-4">
            <h3 className="font-bold text-amber-900 mb-3">Home Sale Transaction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-2">Gen 2 Home Sale:</div>
                <div className="space-y-1 pl-2">
                  <div className="flex justify-between">
                    <span>Home Value:</span>
                    <span className="font-semibold">{formatCurrency(gen2.realEstate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selling Costs (9%):</span>
                    <span className="text-red-600">-{formatCurrency(gen2.realEstate * 0.09)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mortgage Payoff:</span>
                    <span className="text-red-600">-{formatCurrency(gen2.mortgage)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-bold">Net Proceeds:</span>
                    <span className="font-bold text-green-600">{formatCurrency(gen2.realEstate * 0.91 - gen2.mortgage)}</span>
                  </div>
                </div>
              </div>
              
              {!scenario3Rental && (
                <div>
                  <div className="font-semibold mb-2">Gen 1 Home Sale:</div>
                  <div className="space-y-1 pl-2">
                    <div className="flex justify-between">
                      <span>Home Value:</span>
                      <span className="font-semibold">{formatCurrency(gen1.realEstate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selling Costs (9%):</span>
                      <span className="text-red-600">-{formatCurrency(gen1.realEstate * 0.09)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mortgage Payoff:</span>
                      <span className="text-red-600">-{formatCurrency(gen1.mortgage)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-bold">Net Proceeds:</span>
                      <span className="font-bold text-green-600">{formatCurrency(gen1.realEstate * 0.91 - gen1.mortgage)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={scenario3Rental ? "" : "md:col-span-2"}>
                <div className="font-semibold mb-2 mt-4">New Home Purchase:</div>
                <div className="space-y-1 pl-2">
                  <div className="flex justify-between">
                    <span>Total Sale Proceeds:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(
                        gen2.realEstate * 0.91 - gen2.mortgage + 
                        (scenario3Rental ? 0 : gen1.realEstate * 0.91 - gen1.mortgage)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Home Cost:</span>
                    <span className="font-semibold">{formatCurrency(newHome.buildCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down Payment ({(scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP).toFixed(1)}%):</span>
                    <span className="text-blue-600">
                      -{formatCurrency(newHome.buildCost * (scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP) / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-bold">Mortgage Amount:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(newHome.buildCost * (1 - (scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP) / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-bold">Excess Liquid Assets:</span>
                    <span className={`font-bold ${
                      (gen2.realEstate * 0.91 - gen2.mortgage + (scenario3Rental ? 0 : gen1.realEstate * 0.91 - gen1.mortgage)) - 
                      (newHome.buildCost * (scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP) / 100) >= 0 
                      ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        (gen2.realEstate * 0.91 - gen2.mortgage + (scenario3Rental ? 0 : gen1.realEstate * 0.91 - gen1.mortgage)) - 
                        (newHome.buildCost * (scenario3ManualDP !== null ? scenario3ManualDP : scenario3AutoDP) / 100)
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 italic">
                    Excess liquid assets earn {economics.investmentReturn}% annually, helping offset the mortgage payment
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {scenario3Rental && <RentalBreakdown />}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Shared Financial Assumptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NumberInput label="Income Growth (%)" value={economics.incomeGrowth} onChange={(v) => setEconomics({...economics, incomeGrowth: v})} step="0.1" />
            <NumberInput label="Inflation Rate (%)" value={economics.inflation} onChange={(v) => setEconomics({...economics, inflation: v})} step="0.1" />
            <NumberInput label="Investment Return (%)" value={economics.investmentReturn} onChange={(v) => setEconomics({...economics, investmentReturn: v})} step="0.1" />
            <NumberInput label="Home Appreciation (%)" value={economics.homeAppreciation} onChange={(v) => setEconomics({...economics, homeAppreciation: v})} step="0.1" />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-400 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-700">Scenario 1: Care Facility</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assumptions:</h3>
            <ul className="text-sm space-y-1">
              <li>• {scenario1Rental ? 'Keep & Rent' : 'Sell'} Gen 1 home {!scenario1Rental && '(9% costs)'}</li>
              <li>• {careCosts.yearsIndependent}yr Independent (${formatNumber(careCosts.independent)})</li>
              <li>• {careCosts.yearsAssisted}yr Assisted (${formatNumber(careCosts.assisted)})</li>
              <li>• {careCosts.totalYears - careCosts.yearsIndependent - careCosts.yearsAssisted}yr Skilled (${formatNumber(careCosts.skilled)})</li>
            </ul>
          </div>
          <div className="space-y-4">
            {scenario1Results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-lg text-purple-700 mb-2">Year {result.year} - {getCareTypes(result.year - 4, result.year)}</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">{formatCurrency(result.totalWealth)}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Homes: {formatCurrency(result.homeValue)}</div>
                  <div>Liquid: {formatCurrency(result.liquid)}</div>
                  <div>Care: {formatCurrency(result.careCost)}/yr</div>
                  {result.careDebt > 0 && <div className="text-red-600 font-bold col-span-2">Care Debt: {formatCurrency(result.careDebt)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Scenario 2: Build Casita</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assumptions:</h3>
            <ul className="text-sm space-y-1">
              <li>• {scenario2Rental ? 'Keep & Rent' : 'Sell'} Gen 1 home</li>
              <li>• Build {formatCurrency(casita.buildCost)} casita</li>
              <li>• Escalating care costs</li>
            </ul>
          </div>
          <div className="space-y-4">
            {scenario2Results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-lg text-blue-700 mb-2">Year {result.year}</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(result.totalWealth)}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Homes: {formatCurrency(result.homeValue)}</div>
                  <div>Liquid: {formatCurrency(result.liquid)}</div>
                  {result.careDebt > 0 && <div className="text-red-600 font-bold col-span-2">Care Debt: {formatCurrency(result.careDebt)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-amber-700">Scenario 3: Sell & Build New</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assumptions:</h3>
            <ul className="text-sm space-y-1">
              <li>• Sell Gen 2 home (9% costs)</li>
              <li>• {scenario3Rental ? 'Keep & Rent' : 'Sell'} Gen 1 home</li>
              <li>• Build {formatCurrency(newHome.buildCost)}</li>
            </ul>
          </div>
          <div className="space-y-4">
            {scenario3Results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h3 className="font-bold text-lg text-amber-700 mb-2">Year {result.year}</h3>
                <div className="text-2xl font-bold text-amber-600 mb-2">{formatCurrency(result.totalWealth)}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Homes: {formatCurrency(result.homeValue)}</div>
                  <div>Liquid: {formatCurrency(result.liquid)}</div>
                  {result.careDebt > 0 && <div className="text-red-600 font-bold col-span-2">Care Debt: {formatCurrency(result.careDebt)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Scenario Comparison Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3">Scenario</th>
                  <th className="text-center p-3">Year 5</th>
                  <th className="text-center p-3">Year 10</th>
                  <th className="text-center p-3">Year 15</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-purple-50">
                  <td className="p-3 font-bold text-purple-700">Care Facility (Baseline)</td>
                  <td className="text-center p-3">
                    <div className="font-bold text-lg text-purple-600">{formatCurrency(scenario1Results[0].totalWealth)}</div>
                    <div className="text-sm text-gray-600">—</div>
                    <div className="text-sm text-blue-600 mt-1">Net Cash: {formatCurrency(scenario1Results[0].cumulativeCashFlow)}</div>
                  </td>
                  <td className="text-center p-3">
                    <div className="font-bold text-lg text-purple-600">{formatCurrency(scenario1Results[1].totalWealth)}</div>
                    <div className="text-sm text-gray-600">—</div>
                    <div className="text-sm text-blue-600 mt-1">Net Cash: {formatCurrency(scenario1Results[1].cumulativeCashFlow)}</div>
                  </td>
                  <td className="text-center p-3">
                    <div className="font-bold text-lg text-purple-600">{formatCurrency(scenario1Results[2].totalWealth)}</div>
                    <div className="text-sm text-gray-600">—</div>
                    <div className="text-sm text-blue-600 mt-1">Net Cash: {formatCurrency(scenario1Results[2].cumulativeCashFlow)}</div>
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="p-3 font-bold text-blue-700">Build Casita</td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="text-center p-3">
                      <div className="font-bold text-lg text-blue-600">{formatCurrency(scenario2Results[idx].totalWealth)}</div>
                      <div className={`text-sm font-semibold ${scenario2Results[idx].totalWealth - scenario1Results[idx].totalWealth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenario2Results[idx].totalWealth - scenario1Results[idx].totalWealth > 0 ? '+' : ''}{formatCurrency(scenario2Results[idx].totalWealth - scenario1Results[idx].totalWealth)}
                      </div>
                      <div className="text-sm text-blue-600 mt-1">Net Cash: {formatCurrency(scenario2Results[idx].cumulativeCashFlow)}</div>
                    </td>
                  ))}
                </tr>
                <tr className="bg-amber-50">
                  <td className="p-3 font-bold text-amber-700">Sell & Build New</td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="text-center p-3">
                      <div className="font-bold text-lg text-amber-600">{formatCurrency(scenario3Results[idx].totalWealth)}</div>
                      <div className={`text-sm font-semibold ${scenario3Results[idx].totalWealth - scenario1Results[idx].totalWealth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenario3Results[idx].totalWealth - scenario1Results[idx].totalWealth > 0 ? '+' : ''}{formatCurrency(scenario3Results[idx].totalWealth - scenario1Results[idx].totalWealth)}
                      </div>
                      <div className="text-sm text-blue-600 mt-1">Net Cash: {formatCurrency(scenario3Results[idx].cumulativeCashFlow)}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">
            Differences shown are compared to Scenario 1 (Care Facility) - the typical fallback option. Positive differences indicate better financial outcomes.
          </p>
        </div>

        {(scenario1Results.some(r => r.careDebt > 0) || scenario2Results.some(r => r.careDebt > 0) || scenario3Results.some(r => r.careDebt > 0)) && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Warning: Care Debt Accumulation</h3>
                <p className="text-red-800 mb-3">One or more scenarios result in accumulated care debt when liquid assets are depleted:</p>
                <ul className="space-y-2 text-red-800">
                  {scenario1Results.some(r => r.careDebt > 0) && (
                    <li><span className="font-bold">Scenario 1:</span> Care debt reaches {formatCurrency(Math.max(...scenario1Results.map(r => r.careDebt)))} by year {scenario1Results.findIndex(r => r.careDebt > 0) * 5 + 5}</li>
                  )}
                  {scenario2Results.some(r => r.careDebt > 0) && (
                    <li><span className="font-bold">Scenario 2:</span> Care debt reaches {formatCurrency(Math.max(...scenario2Results.map(r => r.careDebt)))} by year {scenario2Results.findIndex(r => r.careDebt > 0) * 5 + 5}</li>
                  )}
                  {scenario3Results.some(r => r.careDebt > 0) && (
                    <li><span className="font-bold">Scenario 3:</span> Care debt reaches {formatCurrency(Math.max(...scenario3Results.map(r => r.careDebt)))} by year {scenario3Results.findIndex(r => r.careDebt > 0) * 5 + 5}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <h3 className="text-xl font-bold text-amber-900">Important Notes</h3>
          </div>
          <ul className="space-y-2 text-amber-900 text-sm">
            <li>• All wealth figures combine Gen 1 and Gen 2 finances</li>
            <li>• Home selling costs: All scenarios with a home sold assume 9% costs (6% selling + 3% holding/repairs)</li>
            <li>• Care costs in Scenarios 2 & 3: Both scenarios use identical escalating care cost assumptions</li>
            <li>• No loan charges are applied against negative cash flow balances (in real life there would be either lending charges or opportunity costs)</li>
            <li>• Tax implications not included - consult professionals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Render
const root = document.getElementById('root');
ReactDOM.render(<ElderCarePlanner />, root);