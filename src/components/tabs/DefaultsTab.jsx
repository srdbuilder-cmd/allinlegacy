import NumberInput from '../NumberInput.jsx';
import { Card, CardHeader, CardBody, Button } from '../ui/index.jsx';
import { yearsSkilledNursing } from '../../lib/care.js';

export default function DefaultsTab({ plan, setters, onReset }) {
  const { setCareCosts, setCasita, setRental, setEconomics, setSellingCostPct, setHomeCareHours } = setters;

  const updateHours = (year, hours) => {
    setHomeCareHours(
      plan.homeCareHours.map((row) => (row.year === year ? { ...row, hours } : row))
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="bg-beigeLight">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-brandBlack">
              These are the market and planning constants. Change them when you update local care prices or your economic
              view — not for every family.
            </p>
            <Button variant="danger" onClick={onReset} className="whitespace-nowrap">
              Reset to defaults
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Facility care costs</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput
              label="Independent living (annual)"
              value={plan.careCosts.independent}
              onChange={(v) => setCareCosts({ independent: v })}
            />
            <NumberInput
              label="Assisted living (annual)"
              value={plan.careCosts.assisted}
              onChange={(v) => setCareCosts({ assisted: v })}
            />
            <NumberInput
              label="Skilled nursing (annual)"
              value={plan.careCosts.skilled}
              onChange={(v) => setCareCosts({ skilled: v })}
            />
          </div>
          <p className="text-sm text-secondary mt-3">
            Default horizon is {plan.careCosts.totalYears} years, with {yearsSkilledNursing(plan.careCosts)} years of
            skilled nursing after independent and assisted living. Timeline years are on the Scenarios tab.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">In-home care</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <NumberInput
              label="Year 1 home care (annual)"
              value={plan.casita.homeCareYear1}
              onChange={(v) => setCasita({ homeCareYear1: v })}
              helpText="Sets the hourly rate from year-1 hours"
            />
            <NumberInput
              label="Food (annual)"
              value={plan.casita.foodAnnual}
              onChange={(v) => setCasita({ foodAnnual: v })}
            />
            <NumberInput
              label="Utilities (annual)"
              value={plan.casita.utilitiesAnnual}
              onChange={(v) => setCasita({ utilitiesAnnual: v })}
            />
          </div>
          <h3 className="font-semibold text-brandBlack mb-2">Weekly hours by year</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {plan.homeCareHours.map((row) => (
              <NumberInput
                key={row.year}
                label={row.year === plan.homeCareHours[plan.homeCareHours.length - 1].year ? `Year ${row.year}+` : `Year ${row.year}`}
                value={row.hours}
                onChange={(v) => updateHours(row.year, v)}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Rental assumptions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput label="Occupancy rate" value={plan.rental.occupancy} allowDecimal suffix="%" onChange={(v) => setRental({ occupancy: v })} />
            <NumberInput label="Management fee" value={plan.rental.managementFee} allowDecimal suffix="%" onChange={(v) => setRental({ managementFee: v })} />
            <NumberInput
              label="Tax / insurance"
              value={plan.rental.taxInsurance}
              allowDecimal
              suffix="%"
              onChange={(v) => setRental({ taxInsurance: v })}
              helpText="% of home value each year"
            />
            <NumberInput
              label="Maintenance"
              value={plan.rental.maintenance}
              allowDecimal
              suffix="%"
              onChange={(v) => setRental({ maintenance: v })}
              helpText="% of home value each year"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Economics</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NumberInput label="Income growth" value={plan.economics.incomeGrowth} allowDecimal suffix="%" onChange={(v) => setEconomics({ incomeGrowth: v })} />
            <NumberInput label="Inflation" value={plan.economics.inflation} allowDecimal suffix="%" onChange={(v) => setEconomics({ inflation: v })} />
            <NumberInput label="Investment return" value={plan.economics.investmentReturn} allowDecimal suffix="%" onChange={(v) => setEconomics({ investmentReturn: v })} />
            <NumberInput label="Home appreciation" value={plan.economics.homeAppreciation} allowDecimal suffix="%" onChange={(v) => setEconomics({ homeAppreciation: v })} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display uppercase tracking-wide text-lg font-normal">Transaction defaults</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberInput
              label="Home selling costs"
              value={plan.sellingCostPct}
              allowDecimal
              suffix="%"
              onChange={setSellingCostPct}
              helpText="Commission plus holding and repairs. Used in every sale."
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
