import { formatCurrency } from '../../utils/formatters.js';
import { buildProjectionCsv } from '../../lib/compare.js';
import { Card, SectionTitle } from '../ui/index.jsx';

function downloadCsv(results) {
  const csv = buildProjectionCsv(results);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'allin-legacy-projection.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProjectionTab({ results, sellingCostPct }) {
  const years = results[1] || [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <SectionTitle>Year-by-year projection</SectionTitle>
          <button
            type="button"
            onClick={() => downloadCsv(results)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Net worth is both households combined. Differences are versus a care facility, the usual fallback.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left p-2">Year</th>
                <th className="text-right p-2 text-purple-800">Facility</th>
                <th className="text-right p-2 text-blue-800">Casita</th>
                <th className="text-right p-2 text-blue-700">vs facility</th>
                <th className="text-right p-2 text-amber-800">New home</th>
                <th className="text-right p-2 text-amber-700">vs facility</th>
              </tr>
            </thead>
            <tbody>
              {years.map((row, index) => {
                const casita = results[2][index];
                const next = results[3][index];
                return (
                  <tr key={row.year} className={index % 2 === 0 ? 'bg-slate-50' : ''}>
                    <td className="p-2 font-medium">{row.year}</td>
                    <td className="p-2 text-right font-semibold text-purple-700">{formatCurrency(row.totalWealth)}</td>
                    <td className="p-2 text-right font-semibold text-blue-700">{formatCurrency(casita.totalWealth)}</td>
                    <td className={`p-2 text-right ${casita.totalWealth - row.totalWealth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatCurrency(casita.totalWealth - row.totalWealth)}
                    </td>
                    <td className="p-2 text-right font-semibold text-amber-700">{formatCurrency(next.totalWealth)}</td>
                    <td className={`p-2 text-right ${next.totalWealth - row.totalWealth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatCurrency(next.totalWealth - row.totalWealth)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {[
        { id: 1, title: 'Care facility detail', color: 'border-purple-200', heading: 'text-purple-800' },
        { id: 2, title: 'Casita detail', color: 'border-blue-200', heading: 'text-blue-800' },
        { id: 3, title: 'New home detail', color: 'border-amber-200', heading: 'text-amber-800' },
      ].map((block) => (
        <Card key={block.id} className={block.color}>
          <h3 className={`text-lg font-bold mb-3 ${block.heading}`}>{block.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left p-2">Year</th>
                  <th className="text-right p-2">Net worth</th>
                  <th className="text-right p-2">Homes</th>
                  <th className="text-right p-2">Liquid</th>
                  <th className="text-right p-2">Care cost</th>
                  <th className="text-right p-2">Cash flow</th>
                  <th className="text-right p-2">Care debt</th>
                </tr>
              </thead>
              <tbody>
                {results[block.id].map((row, index) => (
                  <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2">{row.year}</td>
                    <td className="p-2 text-right font-semibold">{formatCurrency(row.totalWealth)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.homeValue)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.liquid)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.careCost)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.cumulativeCashFlow)}</td>
                    <td className={`p-2 text-right ${row.careDebt > 0 ? 'text-rose-700 font-semibold' : ''}`}>
                      {formatCurrency(row.careDebt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card className="bg-amber-50 border-amber-200">
        <h3 className="font-bold text-amber-900 mb-2">How to read this</h3>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>All wealth figures combine both households.</li>
          <li>Home sales use the selling-cost percent on Defaults (currently {sellingCostPct}%).</li>
          <li>On-site paths use the same skilled-nursing cost after the crossover year so late-stage care is comparable.</li>
          <li>Care debt compounds at the adult child's other-debt rate once liquid assets are gone.</li>
          <li>Taxes are not modeled. Talk with your advisor before acting on a number.</li>
        </ul>
      </Card>
    </div>
  );
}
