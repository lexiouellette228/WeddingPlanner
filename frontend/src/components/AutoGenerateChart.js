import React, { useState, useEffect } from 'react';
import { Alert, Container, Button, Row, Col, Card, Form } from 'react-bootstrap';
import { autoGenerateSeating, saveAutoSeatingChart } from '../api/autoApi';

const AutoGenerateChart = ({ guests, numTables, seatsPerTable, shape = "round" }) => {
  const [tables, setTables] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleGenerate = async () => {
    console.log("Generating seating chart...");
    try {
      const result = await autoGenerateSeating(guests, numTables, seatsPerTable, shape);
      console.log("Result from backend:", result);
      setTables(result);
      setSaveStatus(null);
    } catch (err) {
      console.error('Error generating seating chart:', err);
    }
  };

  useEffect(() => {
    if (
      Array.isArray(guests) &&
      guests.length > 0 &&
      Number.isInteger(numTables) &&
      Number.isInteger(seatsPerTable) &&
      numTables > 0 &&
      seatsPerTable > 0
    ) {
      handleGenerate();
    }
  }, [guests.length, numTables, seatsPerTable, shape]);
  

  const handleInputChange = (tableId, seatId, value) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              seats: table.seats.map(seat =>
                seat.id === seatId
                  ? { ...seat, guest: { ...seat.guest, name: value } }
                  : seat
              ),
            }
          : table
      )
    );
  };

  const handleSave = async () => {
    try {
      await saveAutoSeatingChart(tables);
      setSaveStatus('success');
      handleGenerate(); // Reload after saving
    } catch (err) {
      console.error('Error saving seating chart:', err);
      setSaveStatus('error');
    }
  };

  const handleRemoveGuest = (tableId, seatId) => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              seats: table.seats.map(seat =>
                seat.id === seatId ? { ...seat, guest: null } : seat
              ),
            }
          : table
      )
    );
  };

  return (
    <Container>
      <Button onClick={handleGenerate} className="mb-3">
        Generate / Regenerate
      </Button>
  
      {tables.length > 0 ? (
        <div>
          <Row>
            {tables.map((table) => (
              <Col md={6} key={table.id} className="mb-4">
                <Card>
                  <Card.Header>{table.label}</Card.Header>
                  <Card.Body>
                    <ul className="list-group">
                      {table.seats.map((seat) => (
                        <li
                          key={seat.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{seat.label}</span>
                          <span>{seat.guest?.name || 'Unassigned'}</span>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
  
          <Button variant="success" onClick={handleSave}>
            Save Seating Plan
          </Button>
        </div>
      ) : (
        <p>No seating chart generated yet.</p>
      )}
  
      {saveStatus === 'success' && (
        <Alert variant="success">Seating plan saved successfully!</Alert>
      )}
      {saveStatus === 'error' && (
        <Alert variant="danger">Failed to save seating plan.</Alert>
      )}
    </Container>
  );
  
};

export default AutoGenerateChart;
