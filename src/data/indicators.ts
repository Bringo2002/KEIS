import type { MacroIndicator } from '../types';

const monthRange = (startYear: number, startMonth: number, count: number) => {
  const dates: string[] = [];
  let y = startYear, m = startMonth;
  for (let i = 0; i < count; i++) {
    dates.push(`${y}-${String(m).padStart(2, '0')}-01`);
    m++; if (m > 12) { m = 1; y++; }
  }
  return dates;
};

const dates24 = monthRange(2023, 1, 24);

export const indicators: MacroIndicator[] = [
  {
    id: 'usd-kes', name: 'USD/KES Exchange Rate', value: 129.5, unit: 'KES', trend: 'down', changePercent: -4.2,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [127,131,134,137,140,143,148,152,155,158,160,157, 152,148,140,135,131,130,129,128,130,131,130,129.5][i] })),
    source: 'CBK', asOf: '2024-12-31',
  },
  {
    id: 'cbr', name: 'CBK Central Bank Rate', value: 11.25, unit: '%', trend: 'down', changePercent: -9.6,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [9.5,9.5,10.5,10.5,10.5,10.5,10.5,10.5,10.5,12.5,12.5,12.5, 13,13,13,13,13,13,13,12.75,12.75,12,12,11.25][i] })),
    source: 'CBK', asOf: '2024-12-31',
  },
  {
    id: 'inflation', name: 'Inflation (CPI YoY)', value: 2.8, unit: '%', trend: 'down', changePercent: -30.0,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [9.0,9.2,9.2,7.9,8.0,7.9,6.8,6.7,6.9,6.9,6.8,6.6, 6.3,6.3,5.7,5.1,5.0,4.6,4.3,4.4,3.6,3.0,2.8,2.8][i] })),
    source: 'KNBS', asOf: '2024-12-31',
  },
  {
    id: 'nse20', name: 'NSE 20 Share Index', value: 1780, unit: 'Points', trend: 'up', changePercent: 8.5,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [1780,1740,1700,1680,1650,1640,1610,1590,1580,1560,1540,1520, 1500,1480,1460,1440,1460,1500,1550,1600,1650,1700,1750,1780][i] })),
    source: 'NSE', asOf: '2024-12-31',
  },
  {
    id: 'tbill-91', name: '91-Day T-Bill Rate', value: 10.2, unit: '%', trend: 'down', changePercent: -15.0,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [9.5,9.8,10.2,10.5,11.0,11.5,12.0,12.8,13.5,14.5,15.5,16.0, 16.5,16.4,16.2,15.8,15.0,14.0,13.0,12.2,11.5,11.0,10.5,10.2][i] })),
    source: 'CBK', asOf: '2024-12-31',
  },
  {
    id: 'gdp-growth', name: 'Kenya GDP Growth Rate', value: 5.0, unit: '%', trend: 'stable', changePercent: 0.0,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [5.4,5.4,5.4,5.3,5.3,5.3,5.2,5.2,5.2,5.1,5.1,5.1, 5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0][i] })),
    source: 'KNBS / World Bank', asOf: '2024-12-31',
  },
  {
    id: 'debt-gdp', name: 'Public Debt as % of GDP', value: 70.3, unit: '%', trend: 'up', changePercent: 2.5,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [65.0,65.2,65.5,65.8,66.0,66.3,66.8,67.2,67.5,67.8,68.0,68.3, 68.5,68.8,69.0,69.2,69.5,69.8,70.0,70.0,70.1,70.2,70.2,70.3][i] })),
    source: 'National Treasury', asOf: '2024-12-31',
  },
  {
    id: 'forex-reserves', name: 'Forex Reserves (Months of Import Cover)', value: 4.3, unit: 'Months', trend: 'up', changePercent: 10.2,
    timeSeries: dates24.map((d, i) => ({ date: d, value: [4.2,4.1,4.0,3.9,3.8,3.7,3.6,3.5,3.5,3.4,3.6,3.7, 3.8,3.9,4.0,4.0,4.1,4.1,4.2,4.2,4.2,4.3,4.3,4.3][i] })),
    source: 'CBK', asOf: '2024-12-31',
  },
];
