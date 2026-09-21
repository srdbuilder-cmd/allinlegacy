import { formatCurrency, formatSignedCurrency } from '../../utils/formatters.js';
import { firstCareDebtYear, maxCareDebt } from '../../lib/compare.js';
import { Card, AlertCircle, ColorDot } from '../ui/index.jsx';
import WealthChart from '../WealthChart.jsx';

const TRADEOFFS = [
  {
    title: 'Permits and zoning',
    body: 'A casita is an ADU. Setbacks, septic, parking, and HOA rules can add months and cost before anyone moves in.',
  },
  {
    title: 'Caregiver burden',
    body: 'On-site care still needs a family member to coordinate aides, nights, and emergencies. A facility staffs that around the clock.',
  },
  {
    title: 'What if memory care is needed',
    body: 'If your parent later needs locked memory care, the casita does not replace that. The crossover year in Defaults is there so you can price that path.',
  },
  {
    title: 'Resale and family dynamics',
    body: 'An ADU can help resale in some markets and complicate it in others. Living next door also changes privacy for both generations.',
  },
];

export default function DecisionTab({ results, comparison }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <p className="text-sm uppercase tracking-wide text-indigo-700 font-semibold mb-2">The bottom line</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{comparison.verdict}</h2>
        <p className="text-slate-600">
          These figures combine both households. They are a planning view, not tax or legal advice.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparison.cards.map((card) => (
          <Card
            key={card.id}
            className={`${card.isWinner ? 'ring-2 ring-offset-2 ring-indigo-500 border-indigo-200' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ColorDot color={card.meta.color} />
                <h3 className="font-bold text-slate-900">{card.meta.name}</h3>
              </div>
              {card.isWinner && (
                <span className="text-xs font-semibold uppercase tracking-wide bg-indigo-600 text-white px-2 py-1 rounded">
                  Ahead
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(card.totalWealth)}</div>
            <p className="text-sm text-slate-500 mb-3">Family net worth at year {comparison.horizonYear}</p>
            {card.id !== 1 && (
              <p className={`text-sm font-semibold ${card.deltaVsFacility >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatSignedCurrency(card.deltaVsFacility)} vs. a care facility
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>Homes: {formatCurrency(card.homeValue)}</div>
              <div>Liquid: {formatCurrency(card.liquid)}</div>
              {card.careDebt > 0 && (
                <div className="col-span-2 text-rose-700 font-semibold">Care debt: {formatCurrency(card.careDebt)}</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Wealth over time</h3>
        <p className="text-sm text-slate-600 mb-4">Hover a year to compare all three paths.</p>
        <WealthChart results={results} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-bold text-slate-900 mb-2">What would have to be true</h3>
          <ul className="space-y-3 text-slate-700">
            <li>{comparison.stories[2]}</li>
            <li>{comparison.stories[3]}</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-bold text-slate-900 mb-2">The money is only part of it</h3>
          <ul className="space-y-3">
            {TRADEOFFS.map((item) => (
              <li key={item.title}>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {comparison.hasCareDebt && (
        <Card className="bg-rose-50 border-rose-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-rose-600 flex-shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="font-bold text-rose-800 mb-2">Care debt shows up in at least one path</h3>
              <ul className="space-y-1 text-rose-800 text-sm">
                {[1, 2, 3].map((id) => {
                  const year = firstCareDebtYear(results[id]);
                  if (!year) return null;
                  return (
                    <li key={id}>
                      {comparison.cards.find((card) => card.id === id)?.meta.name}: debt begins around year {year} and
                      reaches {formatCurrency(maxCareDebt(results[id]))}.
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
