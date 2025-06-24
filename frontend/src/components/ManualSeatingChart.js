import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, CardGroup } from 'react-bootstrap';
import { useDrop } from 'react-dnd';

const ManualSeatingChart = ({ guestList, numTables, seatsPerTable, onUpdateAssignedGuests }) => {
  const [tables, setTables] = useState([]);
  const [assignedGuestsNames, setAssignedGuestsNames] = useState([]);

  useEffect(() => {
    const newTables = Array.from({ length: numTables }, (_, i) => ({
      id: i + 1,
      name: `Table ${i + 1}`,
      seats: Array(seatsPerTable).fill(null),
    }));
    setTables(newTables);
  }, [numTables, seatsPerTable]);

  const assignGuestToSeat = (tableId, seatIndex, guest) => {
    setTables(prevTables =>
      prevTables.map(table => {
        if (table.id === tableId) {
          const newSeats = [...table.seats];
          newSeats[seatIndex] = guest;
          return { ...table, seats: newSeats };
        }
        return table;
      })
    );
  };

  useEffect(() => {
    const assignedNames = tables.flatMap(table =>
      table.seats.filter(seat => seat?.name).map(seat => seat.name)
    );
    onUpdateAssignedGuests(assignedNames);
  }, [tables, onUpdateAssignedGuests]);
  
  
  const handleSeatInput = (tableId, seatIndex, value) => {
    setTables(prevTables =>
      prevTables.map(table => {
        if (table.id === tableId) {
          const newSeats = [...table.seats];
          newSeats[seatIndex] = { ...newSeats[seatIndex], name: value };
          return { ...table, seats: newSeats };
        }
        return table;
      })
    );
  };

  const removeGuestFromSeat = (tableId, seatIndex) => {
    setTables(prevTables =>
      prevTables.map(table => {
        if (table.id === tableId) {
          const newSeats = [...table.seats];
          newSeats[seatIndex] = null;
          return { ...table, seats: newSeats };
        }
        return table;
      })
    );
  };

  return (
    <Container>
      <Row md="auto" className='justify-content-center'>
        <Col md="auto">
          <Row md={2} className="g-2">
            {tables.map((table) => (
              <Col  xs="auto" key={table.id} className="mb-2">
                <CardGroup>
                <Card >
                  <Card.Body>
                  <Form.Group  className="mb-2 ">
                    <Form.Control
                      size="md"
                      placeholder='Seat'
                      value={table.name}
                      onChange={(e) => {
                        const updatedName = e.target.value;
                        setTables(prev => prev.map(t => t.id === table.id ? { ...t, name: updatedName } : t));
                      }}
                    />
                    </Form.Group>
                    <div className="d-flex flex-wrap">
                      {table.seats.map((seat, i) => (
                        <DroppableSeat
                          key={i}
                          seat={seat}
                          tableId={table.id}
                          seatIndex={i}
                          onDrop={assignGuestToSeat}
                          onInputChange={handleSeatInput}
                          onRemoveGuest={removeGuestFromSeat}
                        />
                      ))}
                    </div>
                  </Card.Body>
                </Card>
                </CardGroup>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const DroppableSeat = ({ seat, tableId, seatIndex, onDrop, onInputChange, onRemoveGuest }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'GUEST',
    drop: (item) => onDrop(tableId, seatIndex, item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const dynamicWidth = `${Math.max(100, (seat?.name?.length || 6) * 10)}px`;

  return (
    <div
      ref={drop}
      className={`p-2 border m-1 rounded ${isOver ? 'bg-success text-white' : 'bg-light'}`}
      style={{ width: 'fit-content', minWidth: '120px' }}
    >
      
      <Form.Control
        size="sm"
        id="autoSizingCheck"
        placeholder="Seat"
        value={seat?.name || ''}
        onChange={(e) => onInputChange(tableId, seatIndex, e.target.value)}
        style={{
          width: dynamicWidth,
          transition: 'width 0.8s',
        }}
      />
      {seat?.name && (
        <button
          className="btn btn-outline-danger btn-sm mt-2"
          onClick={() => onRemoveGuest(tableId, seatIndex)}
        >
          ✕
        </button>
      )}
      
    </div>
  );
};


export default ManualSeatingChart;
