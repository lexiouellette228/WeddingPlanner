// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarNav from './components/SidebarNav';
import Home from './pages/Home';
import GuestListPage from './pages/GuestListPage';
import FloorPlanPage from './pages/FloorPlanPage';
import TableCalculatorPage from './pages/TableCalculatorPage';
import SeatingChartPage from './pages/SeatingChartPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div style={{ display: 'flex' }}>
          <SidebarNav />
          <div style={{ marginLeft: '140px', padding: '20px', width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/floor-plan" element={<FloorPlanPage />} />
              <Route path="/guest-list" element={<GuestListPage />} />
              <Route path="/table-calculator" element={<TableCalculatorPage />} />
              <Route path="/seating-chart" element={<SeatingChartPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
