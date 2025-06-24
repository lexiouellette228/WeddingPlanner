import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { Button, Modal, Form } from 'react-bootstrap';
import './FloorPlanCanvas.css';
import DroppableSeat from './DroppableSeat';

const FloorPlanCanvas = ({ tables, setTables, onSelectTable, draggedGuest }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [draggingSeat, setDraggingSeat] = useState(null);

  const assignGuestToSeat = (tableId, seatIndex, guestName) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        const updatedSeats = [...table.seats];
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          guest: guestName,
        };
        if (editingTable?.id === table.id) {
          setEditingTable({ ...table, seats: updatedSeats });
        }
        return { ...table, seats: updatedSeats };
      }
      return table;
    });
    setTables(updatedTables);
  };

  const handleSeatDrop = (targetTableId, targetSeatIndex, seatData) => {
    const { tableId: sourceTableId, seatIndex: sourceSeatIndex, guest } = seatData;
    if (!guest) return;
  
    const updatedTables = tables.map((table) => {
      const updatedSeats = [...table.seats];
  
      if (table.id === sourceTableId) {
        updatedSeats[sourceSeatIndex] = { ...updatedSeats[sourceSeatIndex], guest: '' };
      }
  
      if (table.id === targetTableId) {
        updatedSeats[targetSeatIndex] = { ...updatedSeats[targetSeatIndex], guest };
      }
  
      return { ...table, seats: updatedSeats };
    });
  
    setTables(updatedTables);
  
    // Sync with modal editing table (if open)
    if (editingTable && (editingTable.id === sourceTableId || editingTable.id === targetTableId)) {
      const editing = updatedTables.find(t => t.id === editingTable.id);
      if (editing) setEditingTable(editing);
    }
  };
  
  const handleSeatDragStart = (tableId, seatIndex) => {
    const guest = tables.find(t => t.id === tableId)?.seats?.[seatIndex]?.guest;
    setDraggingSeat({ tableId, seatIndex, guest });
  };
  
  const handleSeatDrag = (tableId, seatIndex, newX, newY) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        const updatedSeats = [...(table.seats || [])];
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          x: newX,
          y: newY,
        };
        return { ...table, seats: updatedSeats };
      }
      return table;
    });
    setTables(updatedTables);
  };


  
  const renderSeats = (table) => {
    const seatRadius = 10;
    const seats = [];
    const { x: cx, y: cy, seatCount, type, id: tableId } = table;

    if (type === 'round') {
      const radius = 50;
      for (let i = 0; i < seatCount; i++) {
        const angle = (2 * Math.PI * i) / seatCount;
        const seatX = cx + radius * Math.cos(angle);
        const seatY = cy + radius * Math.sin(angle);
        const guestName = table.seats?.[i]?.guest || '';

        seats.push(
          <DroppableSeat
            key={`seat-${tableId}-${i}`}
            tableId={tableId}
            seatIndex={i}
            offsetX={seatX - cx}
            offsetY={seatY - cy}
            tableX={cx}
            tableY={cy}
            radius={seatRadius}
            guestName={guestName}
            onSeatDragStart={handleSeatDragStart}
            onSeatDragEnd={({ tableId, seatIndex, newX, newY }) => {
                if (!draggingSeat || (draggingSeat.tableId === tableId && draggingSeat.seatIndex === seatIndex)) return;
                handleSeatDrop(tableId, seatIndex, draggingSeat);
                setDraggingSeat(null);
              }}
          />
        );
      }
    }

    if (type === 'rectangle') {
      const width = 120;
      const height = 60;
      const spacing = 20;
      const seatsPerSide = Math.ceil(seatCount / 2);

      for (let i = 0; i < seatsPerSide; i++) {
        const offsetX = -width / 2 + (i + 1) * (width / (seatsPerSide + 1));

        const guestTop = table.seats?.[i]?.guest || '';
        const guestBottom = table.seats?.[i + seatsPerSide]?.guest || '';

        seats.push(
        <DroppableSeat
            key={`top-seat-${tableId}-${i}`}
            tableId={tableId}
            seatIndex={i}
            offsetX={offsetX}
            offsetY={-height / 2 - spacing}
            tableX={cx}
            tableY={cy}
            radius={seatRadius}
            guestName={guestTop}
            onSeatDragStart={handleSeatDragStart}
            onSeatDragEnd={({ tableId, seatIndex }) => {
              if (!draggingSeat || (draggingSeat.tableId === tableId && draggingSeat.seatIndex === seatIndex)) return;
              handleSeatDrop(tableId, seatIndex, draggingSeat);
              setDraggingSeat(null);
            }}
          />
        );

        seats.push(
            <DroppableSeat
            key={`bottom-seat-${tableId}-${i}`}
            tableId={tableId}
            seatIndex={i + seatsPerSide}
            offsetX={offsetX}
            offsetY={height / 2 + spacing}
            tableX={cx}
            tableY={cy}
            radius={seatRadius}
            guestName={guestBottom}
            onSeatDragStart={handleSeatDragStart}
            onSeatDragEnd={({ tableId, seatIndex }) => {
              if (!draggingSeat || (draggingSeat.tableId === tableId && draggingSeat.seatIndex === seatIndex)) return;
              handleSeatDrop(tableId, seatIndex, draggingSeat);
              setDraggingSeat(null);
            }}
          />
        );
      }
    }

    return seats;
  };

  const handleStageMouseUp = (e) => {
    if (!draggedGuest) return;
    const pointer = e.target.getStage().getPointerPosition();
    const threshold = 12;

    for (const table of tables) {
      for (let i = 0; i < table.seats.length; i++) {
        const { x: cx, y: cy } = table;
        let seatX, seatY;

        if (table.type === 'round') {
          const angle = (2 * Math.PI * i) / table.seatCount;
          const radius = 50;
          seatX = cx + radius * Math.cos(angle);
          seatY = cy + radius * Math.sin(angle);
        } else if (table.type === 'rectangle') {
          const width = 100;
          const height = 60;
          const spacing = 20;
          const seatsPerSide = Math.ceil(table.seatCount / 2);
          const offsetX = -width / 2 + ((i % seatsPerSide) + 1) * (width / (seatsPerSide + 1));

          if (i < seatsPerSide) {
            seatX = cx + offsetX;
            seatY = cy - height / 2 - spacing;
          } else {
            seatX = cx + offsetX;
            seatY = cy + height / 2 + spacing;
          }
        }

        const dist = Math.hypot(pointer.x - seatX, pointer.y - seatY);
        if (dist < threshold) {
          assignGuestToSeat(table.id, i, draggedGuest.name);
          return;
        }
      }
    }
  };

  return (
    <>
      <Stage 
        width={1000} 
        height={600} 
        onMouseUp={handleStageMouseUp}
        style={{ border: '1px solid #ccc' }}
      >
        <Layer>
          {tables.map((table) => (
            <Group
              key={table.id}
              x={table.x}
              y={table.y}
              draggable
              onClick={() => {
                setEditingTable(table);
                setShowModal(true);
                onSelectTable?.(table);
              }}
              onDragEnd={(e) => {
                const updated = tables.map((t) =>
                  t.id === table.id ? { ...t, x: e.target.x(), y: e.target.y() } : t
                );
                setTables(updated);
              }}
            >
              {table.type === 'round' ? (
                <Circle 
                radius={50} 
                fill="lightblue" 
                />
              ) : (
                <Rect width={100} height={60} fill="lightgreen" offset={{ x: 50, y: 30 }} />
              )}
              <Text text={table.name} offsetY={7} offsetX={table.name.length * 3.5} />
            </Group>
          ))}
        </Layer>

        <Layer>
          {tables.flatMap((table) => renderSeats(table))}
        </Layer>
      </Stage>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTable && (
            <Form>
              <Form.Group>
                <Form.Label>Table Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingTable.name}
                  onChange={(e) =>
                    setEditingTable({ ...editingTable, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Seat Count</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  value={editingTable.seatCount}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      seatCount: +e.target.value,
                    })
                  }
                />
              </Form.Group>

              <hr />
              <h6>Seat Assignments</h6>
              {editingTable?.seats?.map((seat, index) => (
                <Form.Group className="mb-2" key={seat.id}>
                  <Form.Label>Seat {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Guest name"
                    value={seat.guest || ''}
                    onChange={(e) => {
                      const updatedSeats = [...editingTable.seats];
                      updatedSeats[index].guest = e.target.value;
                      setEditingTable({ ...editingTable, seats: updatedSeats });
                    }}
                  />
                </Form.Group>
              ))}

              <Button
                className="mt-3"
                variant="danger"
                onClick={() => {
                  setTables(tables.filter((t) => t.id !== editingTable.id));
                  setShowModal(false);
                }}
              >
                Delete Table
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setTables(tables.map((t) =>
                t.id === editingTable.id ? editingTable : t
              ));
              setShowModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FloorPlanCanvas;
