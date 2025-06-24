// src/pages/FloorPlanPage.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FloorPlanCanvas from '../pages/FloorPlanCanvas';
import { Button, Form, Container } from 'react-bootstrap';
import './FloorPlanPage.css';
import { getGuestList } from '../api/guestApi';
import { useDrag } from 'react-dnd';
import { saveSeating, clearSeating } from '../api/seatingApi';

const FloorPlanPage = ({  }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [sidebarView, setSidebarView] = useState('tables'); // 'tables' or 'guests'
  const [tableSeatSelection, setTableSeatSelection] = useState({}); // { "30-round": 2, ... }
  const [guestList, setGuestList] = useState([]); // Replace with real guest fetch later
  const defaultPosition = { x: 100, y: 100 };
  const [draggedGuest, setDraggedGuest] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getGuestList();
        setGuestList(data);
      } catch (err) {
        console.error('Error loading guest list:', err);
      } 
    };
    fetchGuests();
  }, []);

  const TABLE_CONFIGS = {
    round: {
      "30": 3,
      "48": 6,
      "60": 8,
      "72": 10,
    },
    rectangle: {
      "6": 6,
      "8": 8,
    },
  };

  const getSeatOptions = (type, size) => {
    if (type === 'round') {
      switch (size) {
        case '30': return [2, 3];
        case '48': return [6, 8];
        case '60': return [8, 10];
        case '72': return [10, 12];
        default: return [];
      }
    }
    if (type === 'rectangle') {
      switch (size) {
        case '6': return [6,8];
        case '8': return [8, 10];
        default: return [];
      }
    }
    return [];
  };
  
  const handleAddTable = (type, sizeLabel, seatCount) => {
    const newTable = {
      id: uuidv4(),
      x: defaultPosition.x,
      y: defaultPosition.y,
      type,
      sizeLabel,
      name: `Table ${tables.length + 1}`,
      seatCount, 
      seats: Array.from({ length: seatCount }, (_, i) => ({
        id: `seat-${i}`,
        guest: null,
        x: 0,
        y: 0,
      }))
    };
  
    setTables([...tables, newTable]);
  };


  const isGuestAssigned = (guestName) => {
    return tables.some(table =>
      table.seats?.some(seat => seat.guest?.toLowerCase() === guestName.toLowerCase())
    );
  };

  const allTags = Array.from(
    new Set(
      guestList.flatMap(g => [g.tag_one, g.tag_two].filter(Boolean))
    )
  );

  const filteredGuests = selectedTag
  ? guestList.filter(
      g => g.tag_one === selectedTag || g.tag_two === selectedTag
    )
  : guestList;

  const GuestItem = ({ guest }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: 'GUEST',
      item: { name: guest.name, tag_one: guest.tag_one, tag_two: guest.tag_two },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const assigned = isGuestAssigned(guest.name);
  
    return (
      <li
        ref={dragRef}
        className={`p-1 rounded ${isDragging ? 'opacity-50' : ''} ${assigned ? 'bg-success text-white opacity-50 ' : 'bg-light'}`}
        style={{ cursor: 'grab' }}
      >
        <strong>{guest.name}</strong> <small> ({guest.tag_one})</small> <small>({guest.tag_two})</small> 
      </li>
    );
  };

  return (
    <Container fluid className="container-size">
      <h4 className="text-center mb-4">Floor Planner</h4>
    <div className="floorplan-wrapper d-flex">
      <div className="floorplan-sidebar" >
        {sidebarView === 'tables' && (
          <>
          {/* Round Tables */}
      <p className="h6" >Table Options</p>
      

      <p className='table-options'>Round Tables</p>
      {Object.keys(TABLE_CONFIGS.round).map(size => {
        const key = `${size}-round`;
        const selectedSeats = tableSeatSelection[key] || getSeatOptions('round', size)[0];
        const seatOptions = getSeatOptions('round', size);

        return (
          <div key={key} className="mb-4">
            <Form.Select
              size="sm"
              className="mb-2"
              value={selectedSeats}
              onChange={(e) =>
                setTableSeatSelection({ ...tableSeatSelection, [key]: +e.target.value })
              }
            >
              {seatOptions.map(seat => (
                <option key={seat} value={seat}>{seat} seats</option>
              ))}
            </Form.Select>
            <Button
              variant="outline-primary"
              className="w-100"
              size='sm'
              onClick={() =>
                handleAddTable('round', size, selectedSeats)
              }
            >
              Add {size}" Round
            </Button>
          </div>
        );
      })}

    {/* Rectangle Tables */}
    <p className='table-options'>Rectangle Tables</p>
    {Object.keys(TABLE_CONFIGS.rectangle).map(size => {
      const key = `${size}-rect`;
      const selectedSeats = tableSeatSelection[key] || getSeatOptions('rectangle', size)[0];
      const seatOptions = getSeatOptions('rectangle', size);

      return (
        <div key={key} className="mb-2">
          <Form.Select
            size="sm"
            className="mb-1"
            value={selectedSeats}
            onChange={(e) =>
              setTableSeatSelection({ ...tableSeatSelection, [key]: +e.target.value })
            }
          >
            {seatOptions.map(seat => (
              <option key={seat} value={seat}>
                {seat} seats
              </option>
            ))}
          </Form.Select>
          <Button
            variant="outline-success"
            size='sm'
            className="w-100"
            onClick={() =>
              handleAddTable('rectangle', size, selectedSeats)
            }
          >
            Add {size}' Rectangle
          </Button>
        </div>
      );
    })}
    </>
  )}
{sidebarView === 'guests' && guestList && (
  <>
    <p className="h6 mb-2">Guest List</p>
    <Form.Select
      size="sm"
      className="mb-2"
      value={selectedTag}
      onChange={(e) => setSelectedTag(e.target.value)}
    >
      <option value=""> All Tags </option>
      {allTags.map(tag => (
        <option key={tag} value={tag}>{tag}</option>
      ))}
    </Form.Select>

    <ul className="list-unstyled">
      {filteredGuests.map((g) => (
        <GuestItem
          key={g.id}
          guest={g}
        />
      ))}
    </ul>
  </>
)}


  </div>
      {/* Center Canvas */}
      <div className="flex-grow-1 p-3">
      <div className="mb-3 d-flex gap-3">
        <Button
          variant={sidebarView === 'tables' ? 'primary' : 'outline-primary'}
          onClick={() => setSidebarView('tables')}
        >
          View Table Options
        </Button>
        <Button
          variant={sidebarView === 'guests' ? 'outline-success' : 'outline-success'}
          onClick={() => setSidebarView('guests')}
        >
          View Guest List
        </Button>
      </div>
        <FloorPlanCanvas
          tables={tables}
          setTables={setTables}
          onSelectTable={setSelectedTable}
          draggedGuest={draggedGuest}
          
        />
        <div className="mt-3 d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await clearSeating();
              setTables([]);
              alert('Layout cleared.');
            } catch (err) {
              console.error('Clear error:', err);
            }
          }}
        >
          Clear
        </Button>
          <Button
              variant="primary"
              onClick={async () => {
                try {
                  await saveSeating(tables);
                  alert('Layout saved!');
                } catch (err) {
                  console.error('Save error:', err);
                }
              }}
            >
              Save Layout
            </Button>
        </div>
      </div>

    </div>
    </Container>
  );
};

export default FloorPlanPage;
