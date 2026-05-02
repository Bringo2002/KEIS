import type { Sector } from '../../types';

const sectorColors: Record<Sector, string> = {
  Banking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Telecommunications: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Energy: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Manufacturing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Agriculture: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Real Estate': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Government: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Regulation: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Diversified: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Insurance: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Fintech: 'bg-green-500/20 text-green-400 border-green-500/30',
  Retail: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Media: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  Transport: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Infrastructure: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

export function SectorBadge({ sector, size = 'sm' }: { sector: Sector; size?: 'sm' | 'md' }) {
  const classes = sectorColors[sector] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const sizeClasses = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${classes} ${sizeClasses}`}>
      {sector}
    </span>
  );
}
