import React, { use, useEffect, useState } from 'react';
import { getGuestList } from '../api/guestApi';
import { Form, Button, Container, Row, Col, Card, Alert} from 'react-bootstrap';
import './TableCalculatorPage.css';
import { fetchTableOptions, fetchMixedOptions, saveSelectedLayout} from '../api/tableApi';

const TableCalculatorPage = () => {
    const [guestList, setGuestList] = useState([]);
    const [guestCount, setGuestCount] = useState('');
    const [tableOptions, setTableOptions] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [layoutType, setLayoutType] = useState(''); 
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const guests = await getGuestList(); 
                setGuestList(guests);
            } catch (err) {
                console.error('Error fetching guest list', err);
            }
        };
        fetchGuests();
    }, []); 

    const handleCalculate = async () => {
        if (!guestCount || !layoutType) return;
        setTableOptions([]);
        setSelectedLayout(null);
        try {
          if (layoutType === 'mix') {
            const result = await fetchMixedOptions(guestCount);
            setTableOptions(result);
          } else {
            const result = await fetchTableOptions(guestCount);
            setTableOptions(result[layoutType]);
          }
        } catch (err) {
          console.error('Error fetching table options:', err);
        }
      };

    const handleManualCount = () => {
        if (guestCount) {
            handleCalculate(+guestCount);
        }
    };

    const handleUseGuestList = () => {
        const count = guestList.length;
        setGuestCount(count);
        handleCalculate(count);
    };

    const handleSave = async () => {
        if (!selectedLayout) return;
        try {
          await saveSelectedLayout(selectedLayout);
          setSaveStatus('success');
        } catch (err) {
          console.error('Error saving layout:', err);
          setSaveStatus('error');
        }
      };

    return (
        <Container fluid className="table-calc-page">
            <h4 className="my-4 text-center">Table Calculator</h4>

        <Row className="mb-4 justify-content-center"> 
            <Col md="auto">
                <Form.Control
                    type="number"
                    placeholder="Enter Guest Count"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                />
            </Col>
        <Col md="auto">
          <Button variant="outline-dark" onClick={handleUseGuestList}>Use Current Guest List ({guestList.length})</Button>
        </Col>
        </Row>
        
      <Row className="justify-content-center mb-3">
        <Col md="auto">
          <Form.Select value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
            <option value="">Select Layout Type</option>
            <option value="round">All Round Tables</option>
            <option value="rectangle">All Rectangle Tables</option>
            <option value="mix">Mixed Layout</option>
          </Form.Select>
        </Col>
        <Col md="auto">
          <Button variant="dark" onClick={handleCalculate} disabled={!guestCount || !layoutType}>
            Calculate Options
          </Button>
        </Col>
      </Row>

      <Row>
        {Array.isArray(tableOptions) &&
          tableOptions.map((option, idx) => (
            <Col md={4} key={idx} className="mb-3">
              <Card
                onClick={() => setSelectedLayout(option)}
                border={selectedLayout === option ? 'primary' : 'light'}
            >
            <Card.Body>
            {layoutType === 'mix' && option.round && option.rectangle ? (
                <>
                <strong>Mixed Layout</strong>
                <p>Round: {option.round.count} × {option.round.type}</p>
                <p>Rectangle: {option.rectangle.count} × {option.rectangle.type}</p>
                <p>Seats Range: {option.min_seats}–{option.max_seats}</p>
                <p>Total Tables: {option.total_tables}</p>
                </>
            ) : (
                <>
                <strong>{option.name}</strong>
                <p>Seats per Table: {option.seats_per_table}</p>
                <p>Min Tables Needed: {option.min_needed}</p>
                <p>Max Tables Needed: {option.max_needed}</p>
                </>
            )}
            </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {selectedLayout && (
        <Row className="justify-content-center">
          <Col md="auto">
            <Button variant="success" onClick={handleSave}>
              Save Selected Layout
            </Button>
          </Col>
        </Row>
      )}

      {saveStatus === 'success' && (
        <Alert variant="success" className="mt-3 text-center">Layout saved successfully!</Alert>
      )}
      {saveStatus === 'error' && (
        <Alert variant="danger" className="mt-3 text-center">Failed to save layout.</Alert>
      )}
        </Container>
    );
};
export default TableCalculatorPage;