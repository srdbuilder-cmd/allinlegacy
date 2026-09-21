import { formatCurrency } from '../../utils/formatters.js';
import { buildProjectionCsv } from '../../lib/compare.js';
import { Card, CardHeader, CardBody, Button } from '../ui/index.jsx';

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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-display uppercase tracking-wide text-lg font-normal mb-0">Year-by-year projection</h2>
          <Button onClick={() => downloadCsv(results)}>Export CSV</Button>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-secondary mb-4">
            Net worth is both households combined. Differences are versus a care facility, the usual fallback.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#C8BCA6]">
                  <th className="text-left p-2 font-display uppercase tracking-wide font-normal">Year</th>
                  <th className="text-right p-2 text-forestDeep">Facility</th>
                  <th className="text-right p-2 text-mustard">Casita</th>
                  <th className="text-right p-2 text-mustard">vs facility</th>
                  <th className="text-right p-2 text-info">New home</th>
                  <th className="text-right p-2 text-info">vs facility</th>
                </tr>
              </thead>
              <tbody>
                {years.map((row, index) => {
                  const casita = results[2][index];
                  const next = results[3][index];
                  return (
                    <tr key={row.year} className={index % 2 === 0 ? 'bg-beigeLight' : ''}>
                      <td className="p-2 font-medium">{row.year}</td>
                      <td className="p-2 text-right font-semibold text-forestDeep">{formatCurrency(row.totalWealth)}</td>
                      <td className="p-2 text-right font-semibold text-mustard">{formatCurrency(casita.totalWealth)}</td>
                      <td className={`p-2 text-right ${casita.totalWealth - row.totalWealth >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(casita.totalWealth - row.totalWealth)}
                      </td>
                      <td className="p-2 text-right font-semibold text-info">{formatCurrency(next.totalWealth)}</td>
                      <td className={`p-2 text-right ${next.totalWealth - row.totalWealth >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(next.totalWealth - row.totalWealth)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {[
        { id: 1, title: 'Care facility detail', heading: 'text-forestDeep' },
        { id: 2, title: 'Casita detail', heading: 'text-mustard' },
        { id: 3, title: 'New home detail', heading: 'text-info' },
      ].map((block) => (
        <Card key={block.id}>
          <CardHeader>
            <h3 className={`font-display uppercase tracking-wide font-normal ${block.heading}`}>{block.title}</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#C8BCA6] text-secondary">
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
                    <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-beigeLight'}>
                      <td className="p-2">{row.year}</td>
                      <td className="p-2 text-right font-semibold">{formatCurrency(row.totalWealth)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.homeValue)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.liquid)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.careCost)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.cumulativeCashFlow)}</td>
                      <td className={`p-2 text-right ${row.careDebt > 0 ? 'text-danger font-semibold' : ''}`}>
                        {formatCurrency(row.careDebt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <h3 className="font-display uppercase tracking-wide font-normal">How to read this</h3>
        </CardHeader>
        <CardBody className="bg-beigeLight">
          <ul className="text-sm text-brandBlack space-y-1">
            <li>All wealth figures combine both households.</li>
            <li>Home sales use the selling-cost percent on Defaults (currently {sellingCostPct}%).</li>
            <li>On-site paths use the same skilled-nursing cost after the crossover year so late-stage care is comparable.</li>
            <li>Care debt compounds at the adult child's other-debt rate once liquid assets are gone.</li>
            <li>Taxes are not modeled. Talk with your advisor before acting on a number.</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
