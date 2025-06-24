// src/components/SidebarNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarNav.css';

const SidebarNav = () => {
  return (
    <div className="sidebar-nav">
      <NavLink to="/" className="nav-btn" activeclassname="active">Home</NavLink>
      <NavLink to="/guest-list" className="nav-btn" activeclassname="active">Guest List</NavLink>
      <NavLink to="/floor-plan" className="nav-btn" activeclassname="active">Floor Planner</NavLink>
      <NavLink to="/seating-chart" className="nav-btn" activeclassname="active">Seating Chart</NavLink>
      <NavLink to="/table-calculator" className="nav-btn" activeclassname="active">Table Calculator</NavLink>
    </div>
  );
};

export default SidebarNav;
