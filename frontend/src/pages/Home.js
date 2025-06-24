import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './Home.css';

const Home = () => {
    const navigate = useNavigate(); 

    return (
        <Container className="home-container d-flex flex-column justify-content-center align-items-center text-center">
        <h1 className="mb-4">Wedding Planner</h1>
        <div className="button-grid">
          <Button className="home-btn" onClick={() => navigate('/guest-list')}>
            Guest List
          </Button>
          <Button className="home-btn" onClick={() => navigate('/floor-plan')}>
            Floor Planner
          </Button>
          <Button className="home-btn" onClick={() => navigate('/seating-chart')}>
            Seating Chart
          </Button>
          <Button className="home-btn" onClick={() => navigate('/table-calculator')}>
            Table Calculator
          </Button>
        </div>
      </Container>
    );
};

export default Home;

