import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { MacroIndicator } from '../../types';
import styles from './IndicatorSparkline.module.css';

export function IndicatorSparkline({ indicator }: { indicator: MacroIndicator }) {
  const trendColors = {
    up: indicator.id === 'debt-gdp' ? '#ef4444' : '#10b981',
    down: indicator.id === 'inflation' || indicator.id === 'usd-kes' ? '#10b981' : '#ef4444',
    stable: '#6b7280',
  };

  const color = trendColors[indicator.trend];
  const trendArrow = indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.name}>{indicator.name}</span>
        <span className={styles.source}>{indicator.source}</span>
      </div>

      <div className={styles.mainStats}>
        <span className={styles.value}>
          {indicator.value.toLocaleString()}
        </span>
        <span className={styles.unit}>{indicator.unit}</span>
        {indicator.changePercent !== undefined && (
          <span className={styles.change} style={{ color }}>
            {trendArrow} {Math.abs(indicator.changePercent).toFixed(1)}%
          </span>
        )}
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={indicator.timeSeries}>
            <defs>
              <linearGradient id={`grad-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${indicator.id})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.footer}>As of {indicator.asOf}</div>
    </div>
  );
}
