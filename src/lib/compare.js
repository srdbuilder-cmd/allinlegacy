import { SCENARIO_META } from '../state/defaults.js';
import { formatCurrency } from '../utils/formatters.js';

export function lastRow(series) {
  return series?.length ? series[series.length - 1] : null;
}

export function findFirstYearBehind(candidate, baseline) {
  if (!candidate?.length || !baseline?.length) return null;
  const len = Math.min(candidate.length, baseline.length);
  for (let i = 0; i < len; i++) {
    if (candidate[i].totalWealth < baseline[i].totalWealth) {
      return candidate[i].year;
    }
  }
  return null;
}

export function findFirstYearAhead(candidate, baseline) {
  if (!candidate?.length || !baseline?.length) return null;
  const len = Math.min(candidate.length, baseline.length);
  for (let i = 0; i < len; i++) {
    if (candidate[i].totalWealth > baseline[i].totalWealth) {
      return candidate[i].year;
    }
  }
  return null;
}

function crossoverStory(name, candidate, baseline) {
  const firstBehind = findFirstYearBehind(candidate, baseline);
  const firstAhead = findFirstYearAhead(candidate, baseline);
  const startsAhead = candidate[0].totalWealth >= baseline[0].totalWealth;
  const endsAhead = lastRow(candidate).totalWealth >= lastRow(baseline).totalWealth;
  const horizon = lastRow(candidate).year;

  if (startsAhead && firstBehind === null) {
    return `${name} stays ahead through the full ${horizon}-year horizon.`;
  }
  if (!startsAhead && firstAhead === null) {
    return `A care facility is ahead of ${name.toLowerCase()} in every year.`;
  }
  if (startsAhead && firstBehind !== null) {
    return `${name} stays ahead as long as care is needed for fewer than ${firstBehind} years.`;
  }
  if (!startsAhead && firstAhead !== null && endsAhead) {
    return `${name} pulls ahead after year ${firstAhead} and stays there through year ${horizon}.`;
  }
  if (!startsAhead && firstAhead !== null && !endsAhead) {
    return `${name} briefly pulls ahead around year ${firstAhead}, then a facility finishes ahead.`;
  }
  return `${name} and a care facility stay close over the ${horizon}-year horizon.`;
}

export function compareScenarios(results) {
  const end1 = lastRow(results[1]);
  const end2 = lastRow(results[2]);
  const end3 = lastRow(results[3]);
  if (!end1 || !end2 || !end3) {
    return {
      winnerId: 1,
      winner: SCENARIO_META[1],
      horizonYear: 0,
      cards: [],
      verdict: 'Enter your numbers to compare the three paths.',
      stories: {},
    };
  }

  const endings = [
    { id: 1, row: end1 },
    { id: 2, row: end2 },
    { id: 3, row: end3 },
  ];
  endings.sort((a, b) => b.row.totalWealth - a.row.totalWealth);
  const winnerId = endings[0].id;
  const winnerWealth = endings[0].row.totalWealth;
  const vsFacility = {
    1: 0,
    2: end2.totalWealth - end1.totalWealth,
    3: end3.totalWealth - end1.totalWealth,
  };

  const cards = endings
    .slice()
    .sort((a, b) => a.id - b.id)
    .map(({ id, row }) => ({
      id,
      meta: SCENARIO_META[id],
      totalWealth: row.totalWealth,
      homeValue: row.homeValue,
      liquid: row.liquid,
      careDebt: row.careDebt,
      cumulativeCashFlow: row.cumulativeCashFlow,
      deltaVsFacility: vsFacility[id],
      isWinner: id === winnerId,
    }));

  const horizonYear = end1.year;
  const gap = winnerId === 1 ? 0 : winnerWealth - end1.totalWealth;
  const winnerName = SCENARIO_META[winnerId].name;

  let verdict;
  if (winnerId === 1) {
    const nextBest = endings[1];
    const shortfall = end1.totalWealth - nextBest.row.totalWealth;
    verdict = `A care facility leaves your family ${formatCurrency(shortfall)} ahead of ${SCENARIO_META[nextBest.id].name.toLowerCase()} over ${horizonYear} years.`;
  } else {
    verdict = `${winnerName} leaves your family about ${formatCurrency(gap)} ahead of a care facility over ${horizonYear} years.`;
  }

  return {
    winnerId,
    winner: SCENARIO_META[winnerId],
    horizonYear,
    cards,
    verdict,
    stories: {
      2: crossoverStory(SCENARIO_META[2].name, results[2], results[1]),
      3: crossoverStory(SCENARIO_META[3].name, results[3], results[1]),
    },
    hasCareDebt: [end1, end2, end3].some((row) => row.careDebt > 0),
  };
}

export function yearsWithCareDebt(series) {
  return series.filter((row) => row.careDebt > 0).map((row) => row.year);
}

export function maxCareDebt(series) {
  return series.reduce((max, row) => Math.max(max, row.careDebt), 0);
}

export function firstCareDebtYear(series) {
  const row = series.find((item) => item.careDebt > 0);
  return row ? row.year : null;
}

export function buildProjectionCsv(results) {
  const headers = [
    'Year',
    'Facility Net Worth',
    'Facility Homes',
    'Facility Liquid',
    'Facility Care Cost',
    'Facility Cash Flow',
    'Facility Care Debt',
    'Casita Net Worth',
    'Casita Homes',
    'Casita Liquid',
    'Casita Care Cost',
    'Casita Cash Flow',
    'Casita Care Debt',
    'New Home Net Worth',
    'New Home Homes',
    'New Home Liquid',
    'New Home Care Cost',
    'New Home Cash Flow',
    'New Home Care Debt',
  ];

  const years = Math.max(results[1].length, results[2].length, results[3].length);
  const lines = [headers.join(',')];
  for (let i = 0; i < years; i++) {
    const cells = [i + 1];
    for (const id of [1, 2, 3]) {
      const row = results[id][i];
      if (!row) {
        cells.push('', '', '', '', '', '');
      } else {
        cells.push(
          Math.round(row.totalWealth),
          Math.round(row.homeValue),
          Math.round(row.liquid),
          Math.round(row.careCost),
          Math.round(row.cumulativeCashFlow),
          Math.round(row.careDebt)
        );
      }
    }
    lines.push(cells.join(','));
  }
  return lines.join('\n');
}
