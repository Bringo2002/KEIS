import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './views/Dashboard';
import { Players } from './views/Players';
import { PlayerProfile } from './views/PlayerProfile';
import { AISearch } from './views/AISearch';
import { Timeline } from './views/Timeline';
import { Sectors } from './views/Sectors';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/ai-search" element={<AISearch />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/sectors" element={<Sectors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
