import NumberInput from '../NumberInput.jsx';
import { Card, CardHeader, CardBody } from '../ui/index.jsx';

function HouseholdFields({ title, value, onChange }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-display uppercase tracking-wide text-lg font-normal">{title}</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput label="Home value" value={value.realEstate} onChange={(v) => onChange({ realEstate: v })} />
          <NumberInput label="Mortgage balance" value={value.mortgage} onChange={(v) => onChange({ mortgage: v })} />
          <NumberInput
            label="Mortgage rate"
            value={value.mortgageRate}
            allowDecimal
            suffix="%"
            onChange={(v) => onChange({ mortgageRate: v })}
            helpText="Needed so the loan actually pays down"
          />
          <NumberInput label="Mortgage term (years)" value={value.mortgageTerm} onChange={(v) => onChange({ mortgageTerm: v })} />
          <NumberInput label="Liquid assets" value={value.liquid} onChange={(v) => onChange({ liquid: v })} />
          <NumberInput label="Monthly income" value={value.monthlyIncome} onChange={(v) => onChange({ monthlyIncome: v })} />
          <NumberInput
            label="Monthly expenses"
            value={value.monthlyExpenses}
            onChange={(v) => onChange({ monthlyExpenses: v })}
            helpText={title.startsWith('Parents') ? 'Used in the casita and new-home paths; a facility fee replaces this' : ''}
          />
          <NumberInput label="Other debt" value={value.otherDebt} onChange={(v) => onChange({ otherDebt: v })} />
          <NumberInput label="Other debt rate" value={value.otherDebtRate} allowDecimal suffix="%" onChange={(v) => onChange({ otherDebtRate: v })} />
          <NumberInput label="Other debt term (years)" value={value.otherDebtTerm} onChange={(v) => onChange({ otherDebtTerm: v })} />
        </div>
      </CardBody>
    </Card>
  );
}

export default function SituationTab({ plan, setGen1, setGen2 }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="bg-beigeLight">
          <p className="text-brandBlack">
            These are the numbers that belong to your family. Care costs, inflation, and rental assumptions live on the
            Defaults tab so you are not re-entering market data for every conversation.
          </p>
        </CardBody>
      </Card>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <HouseholdFields title="Parents" value={plan.gen1} onChange={setGen1} />
        <HouseholdFields title="You (adult child)" value={plan.gen2} onChange={setGen2} />
      </div>
    </div>
  );
}
