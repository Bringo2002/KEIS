import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { MacroIndicator } from '../../types';

export function IndicatorSparkline({ indicator }: { indicator: MacroIndicator }) {
  const trendColors = {
    up: indicator.id === 'debt-gdp' ? '#ef4444' : '#10b981',
    down: indicator.id === 'inflation' || indicator.id === 'usd-kes' ? '#10b981' : '#ef4444',
    stable: '#6b7280',
  };

  const color = trendColors[indicator.trend];

  const trendArrow = indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→';

  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5 hover:border-[#2a2a3e] transition-colors">
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs text-[#64748b] font-medium uppercase tracking-wide">{indicator.name}</span>
        <span className="text-xs text-[#64748b] font-mono">{indicator.source}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold font-mono text-[#e2e8f0]">
          {indicator.value.toLocaleString()}
        </span>
        <span className="text-sm text-[#94a3b8]">{indicator.unit}</span>
        {indicator.changePercent !== undefined && (
          <span className="text-xs font-mono font-semibold" style={{ color }}>
            {trendArrow} {Math.abs(indicator.changePercent).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="h-12">
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

      <div className="text-[10px] text-[#64748b] mt-1 font-mono">As of {indicator.asOf}</div>
    </div>
  );
}
