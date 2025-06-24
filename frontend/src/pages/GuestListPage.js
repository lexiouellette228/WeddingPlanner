import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Spinner, Modal} from 'react-bootstrap';
import Swal from 'sweetalert2';
import {
  getGuestList,
  saveGuestList,
  deleteGuest,
  updateGuest,
  clearGuestList,
} from '../api/guestApi'; // make sure your file is named guestApi.js
import './GuestListPage.css';


const GuestListPage = () => {
  const [guestList, setGuestList] = useState([]);
  const [manualGuests, setManualGuests] = useState([]);
  const [newManualGuest, setNewManualGuest] = useState({ name: '', tag_one: '', tag_two: '' });
  const [loading, setLoading] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editedGuest, setEditedGuest] = useState({ name: '', tag_one: '', tag_two: ''});
  const [showModal, setShowModal] = useState(false);

  const fetchGuests = async () => {
    try {
      const guests = await getGuestList();
      setGuestList(guests);
    } catch (err) {
      console.error('Failed to load guest list:', err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);


  const handleManualAdd = () => {
    const name = newManualGuest.name.trim();
    if (!name) return;
  
    const newGuest = {
      ...newManualGuest,
      id: String(Date.now() + Math.random()),
    };
  
    setGuestList(prev => [...prev, newGuest]);
    setNewManualGuest({ name: '', tag_one: '', tag_two: '' });
 
    Swal.fire({
      title: 'Guest Added!',
      text: `${newGuest.name} was added successfully`,
      icon: 'success',
      timer: 1000, // milliseconds (2 seconds)
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleSaveAll = async () => {
    try {
      const combinedGuests = [...guestList, ...manualGuests].map(g => ({
        id: g.id || null,
        name: g.name?.trim() || '',
        tag_one: g.tag_one?.trim() || '',
        tag_two: g.tag_two?.trim() || '',
      }));
  
      // Filter out empty names
      const validGuests = combinedGuests.filter(g => g.name);
  
      const res = await saveGuestList(validGuests);
      setGuestList(res.guests || []);
      setManualGuests([]);
  
      Swal.fire({
        title: 'Guest list saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error saving guests:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save guest list.',
        icon: 'error',
      });
    }
  };
  
  const handleUploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
  
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const data = rows.slice(1);
  
      const guests = data.map((line, i) => {
        const values = line.split(',').map(v => v.trim());
        const guest = { id: `guest-${Date.now()}-${i}` };
  
        headers.forEach((key, idx) => {
          guest[key] = values[idx] || '';
        });
  
        return guest;
      });
  
      setGuestList((prev) => [...prev, ...guests]);
    };
  
    reader.readAsText(file);
  };
  
  const handleDelete = async (guestId) => {
    try {
      await deleteGuest(guestId);
      setGuestList(guestList.filter((g) => g.id !== guestId));
    } catch (err) {
      console.error('Error deleting guest:', err);
    }
  };

  const handleClearGuests = async () => {
    try {
      await clearGuestList();
      setGuestList([]);
    } catch (err) {
      console.error('Failed to clear guests:', err);
    }
  };

  const handleStartEdit = (guest) => {
    setEditingGuestId(guest.id);
    setEditedGuest({ name: guest.name, tag_one: guest.tag_one, tag_two: guest.tag_two });
  };

  const handleCancelEdit = () => {
    setEditingGuestId(null);
    setEditedGuest({ name: '', tag_one: '', tag_two: '' });
  };
  
  const handleSaveEdit = async (guestId) => {
    try {
      await updateGuest(guestId, editedGuest);
      setGuestList((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, ...editedGuest } : g))
      );
      handleCancelEdit();
    } catch (err) {
      console.error('Error updating guest:', err)
    }
  };

  return (
    <Container fluid className="guest-list-page">
      <h2 className="text-center mb-4">Guest List</h2>

      <Row className="mb-4 text-center">
        <Col>
          <Button variant="outline-dark" as="label">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleUploadCSV}
            />
          </Button>
        </Col>
        <Col>
          <Button 
            variant="outline-dark"
            onClick={() => {
              setShowModal(true);
            }} 
          >
            Add Guest
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Row>
          <div class="card text-center"> 
          <h5 class="card-header">Card title</h5>
          <div className='card-body'>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tag 1</th>
                  <th>Tag 2</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {[...guestList, ...manualGuests].map((guest, index) => (
                  <tr key={guest.id || `manual-${index}`}>
                    <td>
                      {editingGuestId === guest.id ? (
                        <Form.Control
                          size="sm"
                          value={editedGuest.name}
                          onChange={(e) =>
                            setEditedGuest({ ...editedGuest, name: e.target.value })
                          }
                        />
                      ) : (
                        guest.name
                      )}
                    </td>
                  <td>
                    {editingGuestId === guest.id ? (
                      <Form.Control
                        size="sm"
                        value={editedGuest.tag_one || ''}
                        onChange={(e) =>
                          setEditedGuest({ ...editedGuest, tag_one: e.target.value })
                        }
                      />
                    ) : (
                      guest.tag_one || ''
                    )}
                  </td>
                  <td>
                  {editingGuestId === guest.id ? (
                    <Form.Control
                      size="sm"
                      value={editedGuest.tag_two || ''}
                      onChange={(e) =>
                        setEditedGuest({ ...editedGuest, tag_two: e.target.value })
                      }
                    />
                  ) : (
                    guest.tag_two || ''
                  )}
                </td>
                <td>
                  {editingGuestId === guest.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-1"
                        onClick={() => handleSaveEdit(guest.id)}
                        disabled={!guest.id}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                {guest.id && (
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="me-1"
                    onClick={() => handleStartEdit(guest)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(guest.id)}
                  disabled={!guest.id}
                >
                  Remove
                </Button>
              </>
              )}
            </td>
          </tr>
        ))}
        </tbody>

            </Table>
            </div>
            </div>
        </Row>
      )}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <Modal.Title >
            Add Guest 
         </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className="mb-3">
                <Col className='mb-4'>
                <Form.Control
                  size="md"
                  placeholder="Name"
                  value={newManualGuest.name}
                  onChange={(e) =>
                    setNewManualGuest({ ...newManualGuest, name: e.target.value })
                  }
                />
                </Col>
                <Col className='mb-4'>
                <Form.Control
                  size="md"
                  placeholder="Tag 1 (bride/groom)"
                  value={newManualGuest.tag_one}
                  onChange={(e) =>
                    setNewManualGuest({ ...newManualGuest, tag_one: e.target.value })
                  }
                />
                </Col>
                <Col className='mb-3'>
                <Form.Control
                  size="md"
                  placeholder="Tag 2 (group by couples, families, friends)"
                  value={newManualGuest.tag_two}
                  onChange={(e) =>
                    setNewManualGuest({ ...newManualGuest, tag_two: e.target.value })
                  }
                />
                </Col>
            </Form>
        </Modal.Body>
       <Modal.Footer > 
          <Button
            size="sm"
            variant="outline-secondary"
            className="me-1"
            onClick={() => {
              handleManualAdd();
              setShowModal(false);
            }}
          >
            Add Guest 
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            className="me-1"
            onClick={handleManualAdd}
          >
            Cancel 
          </Button>
       </Modal.Footer>
      </Modal>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button className='save-btn' onClick={handleSaveAll}>
          Save All
        </Button>
        <Button variant="danger" onClick={handleClearGuests}>
        Clear Guest List
      </Button>
      </div>
    </Container>
  );
};

export default GuestListPage;
