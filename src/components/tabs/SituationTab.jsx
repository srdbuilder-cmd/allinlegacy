import NumberInput from '../NumberInput.jsx';
import { Card, SectionTitle } from '../ui/index.jsx';

function HouseholdFields({ title, color, value, onChange, border }) {
  return (
    <Card className={`${border}`}>
      <SectionTitle color={color}>{title}</SectionTitle>
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
    </Card>
  );
}

export default function SituationTab({ plan, setGen1, setGen2 }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-50">
        <p className="text-slate-700">
          These are the numbers that belong to your family. Care costs, inflation, and rental assumptions live on the
          Defaults tab so you are not re-entering market data for every conversation.
        </p>
      </Card>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <HouseholdFields
          title="Parents"
          color="text-rose-700"
          border="border-4 border-rose-200"
          value={plan.gen1}
          onChange={setGen1}
        />
        <HouseholdFields
          title="You (adult child)"
          color="text-blue-700"
          border="border-4 border-blue-200"
          value={plan.gen2}
          onChange={setGen2}
        />
      </div>
    </div>
  );
}
