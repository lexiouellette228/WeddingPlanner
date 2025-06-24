import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ManualSeatingChart from '../components/ManualSeatingChart';
import { getGuestList } from '../api/guestApi';
import './SeatingChartPage.css';
import GuestItem from '../components/GuestItem';
import AutoGenerateChart from '../components/AutoGenerateChart';

const SeatingChartPage = () => {
  const [guestList, setGuestList] = useState([]);
  const [mode, setMode] = useState('manual');
  const [numTables, setNumTables] = useState([]);
  const [seatsPerTable, setSeatsPerTable] = useState([]);
  const [assignedGuestNames, setAssignedGuestNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shape, setShape] = useState("round");


  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const guests = await getGuestList(); 
        setGuestList(guests);
      } catch (err) {
        console.error('Error fetching guest list.', err);
      }
    };
    fetchGuests();
  }, []);



  return (
    <Container fluid className="seating-chart-page"> 
      <h4 className="my-4 text-center">Seating Chart</h4>
      <Row className="mb-4 justify-content-center">
        <Col md="auto" >
          <Button
            variant={mode === 'manual' ? 'primary' : 'outline-primary'}
            onClick={() => setMode('manual')}
          >
            Create Seating Chart
          </Button>
        </Col>
        <Col md="auto">
          <Button
            variant={mode === 'auto' ? 'primary' : 'outline-primary'}
            onClick={() => setMode('auto')}       
          >
            Generate Seating Chart
          </Button>
        </Col>

      </Row>
      <Row>
        <Col md={4} className="sidebar">
          <h5 className="mb-3">Guest List</h5>
          <Form >
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-1 mb-3"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Tag 1</th>
                <th>Tag 2</th>
              </tr>
            </thead>
            <tbody>
              {guestList
                .filter((g) =>
                    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    g.tag_one.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    g.tag_two.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((guest) => (
                    <GuestItem
                    key={guest.id}
                    guest={guest}
                    isAssigned={assignedGuestNames.includes(guest.name)}
                />
              ))}
            </tbody>
          </table>
        </Col>
        <Col md={8} className="floorplan-area">
          <Form className="mb-4">
            <Row className="mb-4 justify-content-center">
              <Col md={4}>
                <Form.Group controlId="numTables">
                  <Form.Label>Number of Tables</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder='0'
                    value={numTables}
                    onChange={(e) => setNumTables(+e.target.value)}
                    min={1}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="seatsPerTable">
                  <Form.Label>Seats per Table</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder='0'
                    value={seatsPerTable}
                    onChange={(e) => setSeatsPerTable(+e.target.value)}
                    min={1}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
              <Form.Select value={shape} onChange={(e) => setShape(e.target.value)}>
                <option value="round">Round</option>
                <option value="rectangle">Rectangle</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
          {mode === 'manual' && <ManualSeatingChart guestList={guestList} numTables={numTables} seatsPerTable={seatsPerTable} onUpdateAssignedGuests={setAssignedGuestNames} />}
          {mode === 'auto' && <AutoGenerateChart guests={guestList} numTables={numTables} seatsPerTable={seatsPerTable} shape={shape} />}

        </Col>
      </Row>
  
      
    </Container>
  );
};

export default SeatingChartPage;
