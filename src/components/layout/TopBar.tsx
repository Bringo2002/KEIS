import { useEconomyStore } from '../../store/useEconomyStore';

export function TopBar({ title }: { title: string }) {
  const players = useEconomyStore((s) => s.players);
  const events = useEconomyStore((s) => s.events);

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold text-[#e2e8f0] md:pl-0 pl-12">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006600] animate-pulse" />
              <span className="font-mono">{players.length} entities</span>
            </span>
            <span className="text-[#1e1e2e]">|</span>
            <span className="font-mono">{events.length} events</span>
          </div>
        </div>
      </div>
    </header>
  );
}
