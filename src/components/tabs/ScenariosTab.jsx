import NumberInput from '../NumberInput.jsx';
import { Card, CardHeader, CardBody, Toggle, ColorDot } from '../ui/index.jsx';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters.js';
import { saleProceeds, sellingCostAmount, downPaymentAmount } from '../../lib/finance.js';
import { scenario3DownPayment } from '../../lib/projection.js';
import { yearsSkilledNursing } from '../../lib/care.js';
import { calculateAnnualRentalIncome, calculateNetMonthlyRental } from '../../lib/rental.js';

function RentalBreakdown({ plan }) {
  const breakdown = calculateAnnualRentalIncome(plan.gen1.realEstate, plan.rental, 1);
  return (
    <div className="mt-4 bg-beigeLight border border-[#C8BCA6] rounded-md p-4">
      <h4 className="font-display uppercase tracking-wide font-normal text-forestDeep mb-3">Parents' home as a rental</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Gross annual rent</div>
        <div className="text-right font-semibold">{formatCurrency(breakdown.grossAnnual)}</div>
        <div>Effective rent ({plan.rental.occupancy}% occupancy)</div>
        <div className="text-right font-semibold">{formatCurrency(breakdown.effectiveRent)}</div>
        <div>Management fee</div>
        <div className="text-right text-danger">-{formatCurrency(breakdown.managementFee)}</div>
        <div>Tax and insurance</div>
        <div className="text-right text-danger">-{formatCurrency(breakdown.taxInsurance)}</div>
        <div>Maintenance</div>
        <div className="text-right text-danger">-{formatCurrency(breakdown.maintenance)}</div>
        <div className="font-bold border-t border-[#C8BCA6] pt-2">Net annual</div>
        <div className="text-right font-bold text-success border-t border-[#C8BCA6] pt-2">
          {formatCurrency(breakdown.netAnnual)}
        </div>
      </div>
      <p className="text-sm text-forestDeep mt-3 font-semibold">
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
          <span className="text-danger">-{formatCurrency(sellingCostAmount(homeValue, sellingCostPct))}</span>
        </div>
        <div className="flex justify-between">
          <span>Mortgage payoff</span>
          <span className="text-danger">-{formatCurrency(mortgage)}</span>
        </div>
        <div className="flex justify-between border-t border-[#C8BCA6] pt-1">
          <span className="font-bold">Net proceeds</span>
          <span className="font-bold text-success">{formatCurrency(saleProceeds(homeValue, mortgage, sellingCostPct))}</span>
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
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">The three paths</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <ColorDot color="forest" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-forestDeep mb-1">Care facility</h3>
                <p className="text-brandBlack mb-3">
                  Your parent moves through independent living, assisted living, then skilled nursing. You can sell their
                  home or keep it as a rental.
                </p>
                <div className="bg-beigeLight border border-[#C8BCA6] rounded-md p-3">
                  <Toggle
                    checked={plan.scenario1Rental}
                    onChange={setScenario1Rental}
                    title="Keep the parents' home as a rental"
                    description={plan.scenario1Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ColorDot color="mustard" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-mustard mb-1">Build a casita</h3>
                <p className="text-brandBlack mb-3">
                  You add a casita on your lot. In-home care ramps up, then skilled nursing begins at the crossover year
                  so late-stage care is comparable to a facility.
                </p>
                <div className="bg-beigeLight border border-[#C8BCA6] rounded-md p-3">
                  <Toggle
                    checked={plan.scenario2Rental}
                    onChange={setScenario2Rental}
                    title="Keep the parents' home as a rental"
                    description={plan.scenario2Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ColorDot color="ink" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-brandBlack mb-1">Sell and build new</h3>
                <p className="text-brandBlack mb-3">
                  You always sell your current home and build a new one with an integrated casita. The parents' home can
                  still be kept as a rental.
                </p>
                <div className="bg-beigeLight border border-[#C8BCA6] rounded-md p-3">
                  <Toggle
                    checked={plan.scenario3Rental}
                    onChange={setScenario3Rental}
                    title="Keep the parents' home as a rental"
                    description={plan.scenario3Rental ? 'Home stays and produces rental income.' : `Home is sold with ${plan.sellingCostPct}% costs.`}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {anyRental && (
        <Card>
          <CardHeader>
            <h2 className="font-display uppercase tracking-wide text-lg font-normal">Rental income (this conversation)</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-secondary mb-4">
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
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Facility timeline</h2>
        </CardHeader>
        <CardBody>
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
          <p className="text-sm text-secondary mt-3">
            Years of skilled nursing: {yearsSkilledNursing(plan.careCosts)} (the rest of the horizon)
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Casita construction</h2>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">New home construction</h2>
        </CardHeader>
        <CardBody>
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

          <div className="mt-6 bg-beigeLight border border-[#C8BCA6] rounded-md p-4">
            <h3 className="font-display uppercase tracking-wide font-normal text-forestDeep mb-3">Sale and purchase</h3>
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
                    <span className="font-bold text-success">{formatCurrency(dp.totalProceeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New home cost</span>
                    <span className="font-semibold">{formatCurrency(plan.newHome.buildCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down payment ({formatPercent(dp.effectiveDP)})</span>
                    <span className="text-info">-{formatCurrency(downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#C8BCA6] pt-1">
                    <span className="font-bold">Mortgage</span>
                    <span className="font-bold text-danger">
                      {formatCurrency(plan.newHome.buildCost - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#C8BCA6] pt-1">
                    <span className="font-bold">Excess liquid assets</span>
                    <span className={`font-bold ${dp.totalProceeds - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP) >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(dp.totalProceeds - downPaymentAmount(plan.newHome.buildCost, dp.effectiveDP))}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Excess liquid assets earn {formatNumber(plan.economics.investmentReturn)}% a year and help offset the
                    new mortgage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
