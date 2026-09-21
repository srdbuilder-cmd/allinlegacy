import NumberInput from '../NumberInput.jsx';
import { Card, SectionTitle, Toggle } from '../ui/index.jsx';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters.js';
import { saleProceeds, sellingCostAmount, downPaymentAmount } from '../../lib/finance.js';
import { scenario3DownPayment } from '../../lib/projection.js';
import { yearsSkilledNursing } from '../../lib/care.js';
import { calculateAnnualRentalIncome, calculateNetMonthlyRental } from '../../lib/rental.js';

function RentalBreakdown({ plan }) {
  const breakdown = calculateAnnualRentalIncome(plan.gen1.realEstate, plan.rental, 1);
  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-bold text-blue-900 mb-3">Parents' home as a rental</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Gross annual rent</div>
        <div className="text-right font-semibold">{formatCurrency(breakdown.grossAnnual)}</div>
        <div>Effective rent ({plan.rental.occupancy}% occupancy)</div>
        <div className="text-right font-semibold">{formatCurrency(breakdown.effectiveRent)}</div>
        <div>Management fee</div>
        <div className="text-right text-rose-600">-{formatCurrency(breakdown.managementFee)}</div>
        <div>Tax and insurance</div>
        <div className="text-right text-rose-600">-{formatCurrency(breakdown.taxInsurance)}</div>
        <div>Maintenance</div>
        <div className="text-right text-rose-600">-{formatCurrency(breakdown.maintenance)}</div>
        <div className="font-bold border-t border-blue-200 pt-2">Net annual</div>
        <div className="text-right font-bold text-emerald-700 border-t border-blue-200 pt-2">
          {formatCurrency(breakdown.netAnnual)}
        </div>
      </div>
      <p className="text-sm text-blue-900 mt-3 font-semibold">
        About {formatCurrency(calculateNetMonthlyRental(plan.gen1.realEstate, plan.rental))} per month
      </p>
    </div>
  );
}

function SaleBlock({ title, homeValue, mortgage, sellingCostPct }) {
  return (
    <div>
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-1 pl-1 text-sm">
        <div className="flex justify-between">
          <span>Home value</span>
          <span className="font-semibold">{formatCurrency(homeValue)}</span>
        </div>
        <div className="flex justify-between">
          <span>Selling costs ({formatPercent(sellingCostPct, 0)})</span>
          <span className="text-rose-600">-{formatCurrency(sellingCostAmount(homeValue, sellingCostPct))}</span>
        </div>
        <div className="flex justify-between">
          <span>Mortgage payoff</span>
          <span className="text-rose-600">-{formatCurrency(mortgage)}</span>
        </div>
        <div className="flex justify-between border-t pt-1">
          <span className="font-bold">Net proceeds</span>
          <span className="font-bold text-emerald-700">{formatCurrency(saleProceeds(homeValue, mortgage, sellingCostPct))}</span>
        </div>
      </div>
    </div>
  );
}

export default function ScenariosTab({ plan, setters }) {
  const {
    setCareCosts,
    setCasita,
    setNewHome,
    setScenario1Rental,
    setScenario2Rental,
    setScenario3Rental,
    setScenario3ManualDP,
  } = setters;
  const dp = scenario3DownPayment(plan);
  const anyRental = plan.scenario1Rental || plan.scenario2Rental || plan.scenario3Rental;

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>The three paths</SectionTitle>
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 rounded flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-700 mb-1">Care facility</h3>
              <p className="text-slate-700 mb-3">
                Your parent moves through independent living, assisted living, then skilled nursing. You can sell their
                home or keep it as a rental.
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <Toggle
                  accent="purple"
                  checked={plan.scenario1Rental}
                  onChange={setScenario1Rental}
                  title="Keep the parents' home as a rental"
                  description={plan.scenario1Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-700 mb-1">Build a casita</h3>
              <p className="text-slate-700 mb-3">
                You add a casita on your lot. In-home care ramps up, then skilled nursing begins at the crossover year
                so late-stage care is comparable to a facility.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Toggle
                  accent="blue"
                  checked={plan.scenario2Rental}
                  onChange={setScenario2Rental}
                  title="Keep the parents' home as a rental"
                  description={plan.scenario2Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-700 mb-1">Sell and build new</h3>
              <p className="text-slate-700 mb-3">
                You always sell your current home and build a new one with an integrated casita. The parents' home can
                still be kept as a rental.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <Toggle
                  accent="amber"
                  checked={plan.scenario3Rental}
                  onChange={setScenario3Rental}
                  title="Keep the parents' home as a rental"
                  description={plan.scenario3Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {anyRental && (
        <Card className="bg-amber-50 border-amber-300">
          <SectionTitle>Rental income (this conversation)</SectionTitle>
          <p className="text-sm text-slate-600 mb-4">
            Occupancy, fees, and tax rates live on Defaults. Monthly rent is here because it is specific to this house.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <NumberInput
              label="Monthly rent"
              value={plan.rental.monthlyRent}
              onChange={(v) => setters.setRental({ monthlyRent: v })}
            />
          </div>
          <RentalBreakdown plan={plan} />
        </Card>
      )}

      <Card>
        <SectionTitle color="text-purple-700">Facility timeline</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Years of independent living"
            value={plan.careCosts.yearsIndependent}
            onChange={(v) => setCareCosts({ yearsIndependent: v })}
          />
          <NumberInput
            label="Years of assisted living"
            value={plan.careCosts.yearsAssisted}
            onChange={(v) => setCareCosts({ yearsAssisted: v })}
          />
          <NumberInput
            label="Planning horizon (years)"
            value={plan.careCosts.totalYears}
            onChange={(v) => setCareCosts({ totalYears: v })}
            helpText="This is the length of the projection"
          />
        </div>
        <p className="text-sm text-slate-600 mt-3">
          Years of skilled nursing: {yearsSkilledNursing(plan.careCosts)} (the rest of the horizon)
        </p>
      </Card>

      <Card>
        <SectionTitle color="text-blue-700">Casita construction</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput label="Casita build cost" value={plan.casita.buildCost} onChange={(v) => setCasita({ buildCost: v })} />
          <NumberInput label="Down payment" value={plan.casita.downPayment} allowDecimal suffix="%" onChange={(v) => setCasita({ downPayment: v })} />
          <NumberInput label="Financing rate" value={plan.casita.rate} allowDecimal suffix="%" onChange={(v) => setCasita({ rate: v })} />
          <NumberInput label="Financing term (years)" value={plan.casita.term} onChange={(v) => setCasita({ term: v })} />
          <NumberInput
            label="Skilled-care crossover year"
            value={plan.casita.skilledCrossoverYear}
            onChange={(v) => setCasita({ skilledCrossoverYear: v })}
            helpText="Year in-home care gives way to skilled nursing"
          />
        </div>
      </Card>

      <Card>
        <SectionTitle color="text-amber-700">New home construction</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput label="New home build cost" value={plan.newHome.buildCost} onChange={(v) => setNewHome({ buildCost: v })} />
          <NumberInput
            label="Down payment"
            value={dp.effectiveDP}
            allowDecimal
            suffix="%"
            onChange={(v) => setScenario3ManualDP(v)}
            helpText={`Auto-calculated from sale proceeds: ${dp.autoDP.toFixed(1)}%`}
          />
          <NumberInput label="Mortgage rate" value={plan.newHome.rate} allowDecimal suffix="%" onChange={(v) => setNewHome({ rate: v })} />
          <NumberInput label="Mortgage term (years)" value={plan.newHome.term} onChange={(v) => setNewHome({ term: v })} />
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-bold text-amber-900 mb-3">Sale and purchase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SaleBlock
              title="Your home sale"
              homeValue={plan.gen2.realEstate}
              mortgage={plan.gen2.mortgage}
              sellingCostPct={plan.sellingCostPct}
            />
            {!plan.scenario3Rental && (
              <SaleBlock
                title="Parents' home sale"
                homeValue={plan.gen1.realEstate}
                mortgage={plan.gen1.mortgage}
                sellingCostPct={plan.sellingCostPct}
              />
            )}
            <div className={plan.scenario3Rental ? '' : 'md:col-span-2'}>
              <div className="font-semibold mb-2 mt-2">New home purchase</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total sale proceeds</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(dp.totalProceeds)}</span>
                </div>
                <div className="flex justify-between">
                  <span>New home cost</span>
                  <span className="font-semibold">{formatCurrency(plan.newHome.buildCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down payment ({formatPercent(dp.effectiveDP)})</span>
                  <span className="text-blue-700">-{formatCurrency(downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-bold">Mortgage</span>
                  <span className="font-bold text-rose-600">
                    {formatCurrency(plan.newHome.buildCost - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-bold">Excess liquid assets</span>
                  <span className={`font-bold ${dp.totalProceeds - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP) >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {formatCurrency(dp.totalProceeds - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Excess liquid assets earn {formatNumber(plan.economics.investmentReturn)}% a year and help offset the
                  new mortgage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
