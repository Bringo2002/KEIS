import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/players', label: 'Players', icon: '🏢' },
  { to: '/sectors', label: 'Sectors', icon: '📁' },
  { to: '/timeline', label: 'Timeline', icon: '📅' },
  { to: '/ai-search', label: 'AI Search', icon: '🤖' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-lg bg-[#12121a] border border-[#1e1e2e] flex items-center justify-center text-[#e2e8f0] hover:bg-[#1a1a28] transition-colors"
      >
        {collapsed ? '✕' : '☰'}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-[#12121a] border-r border-[#1e1e2e] flex flex-col transition-transform duration-300 ${
          collapsed ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-60`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#006600] to-[#004400] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#006600]/20">
              KE
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#e2e8f0] leading-tight">Kenya Economy</h1>
              <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider">Intelligence System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#006600]/15 text-[#22c55e] border border-[#006600]/30'
                    : 'text-[#94a3b8] hover:bg-[#1a1a28] hover:text-[#e2e8f0] border border-transparent'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="text-[10px] text-[#64748b] space-y-1">
            <p>Data sourced from CBK, NSE, KNBS</p>
            <p>Last updated: Jan 2025</p>
          </div>
        </div>
      </aside>
    </>
  );
}
