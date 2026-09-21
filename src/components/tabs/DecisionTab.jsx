import { formatCurrency, formatSignedCurrency } from '../../utils/formatters.js';
import { firstCareDebtYear, maxCareDebt } from '../../lib/compare.js';
import { Card, CardHeader, CardBody, Eyebrow, AlertCircle, ColorDot } from '../ui/index.jsx';
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
      <Card>
        <CardBody>
          <Eyebrow>The bottom line</Eyebrow>
          <h2 className="font-display uppercase tracking-wide text-2xl md:text-3xl font-normal text-brandBlack mb-2 leading-snug">
            {comparison.verdict}
          </h2>
          <p className="text-secondary">
            These figures combine both households. They are a planning view, not tax or legal advice.
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparison.cards.map((card) => (
          <Card
            key={card.id}
            className={card.isWinner ? 'ring-2 ring-forestDeep' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColorDot color={card.meta.color} />
                  <h3 className="font-display uppercase tracking-wide font-normal">{card.meta.name}</h3>
                </div>
                {card.isWinner && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide bg-forestDeep text-white px-2 py-1 rounded">
                    Ahead
                  </span>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-semibold text-brandBlack mb-1">{formatCurrency(card.totalWealth)}</div>
              <p className="text-sm text-secondary mb-3">Family net worth at year {comparison.horizonYear}</p>
              {card.id !== 1 && (
                <p className={`text-sm font-semibold ${card.deltaVsFacility >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatSignedCurrency(card.deltaVsFacility)} vs. a care facility
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-secondary">
                <div>Homes: {formatCurrency(card.homeValue)}</div>
                <div>Liquid: {formatCurrency(card.liquid)}</div>
                {card.careDebt > 0 && (
                  <div className="col-span-2 text-danger font-semibold">Care debt: {formatCurrency(card.careDebt)}</div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-display uppercase tracking-wide font-normal">Wealth over time</h3>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-secondary mb-4">Hover a year to compare all three paths.</p>
          <WealthChart results={results} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-display uppercase tracking-wide font-normal">What would have to be true</h3>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3 text-brandBlack">
              <li>{comparison.stories[2]}</li>
              <li>{comparison.stories[3]}</li>
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-display uppercase tracking-wide font-normal">The money is only part of it</h3>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              {TRADEOFFS.map((item) => (
                <li key={item.title}>
                  <p className="font-semibold text-brandBlack">{item.title}</p>
                  <p className="text-sm text-secondary">{item.body}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {comparison.hasCareDebt && (
        <Card>
          <CardBody className="bg-[#F8EFE9]">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-danger flex-shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-display uppercase tracking-wide font-normal text-danger mb-2">
                  Care debt shows up in at least one path
                </h3>
                <ul className="space-y-1 text-danger text-sm">
                  {[1, 2, 3].map((id) => {
                    const year = firstCareDebtYear(results[id]);
                    if (!year) return null;
                    return (
                      <li key={id}>
                        {comparison.cards.find((item) => item.id === id)?.meta.name}: debt begins around year {year} and
                        reaches {formatCurrency(maxCareDebt(results[id]))}.
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
