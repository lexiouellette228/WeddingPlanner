import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const saveGuestList = async (guests) => {
    const res = await axios.post(`${BASE_URL}/guests`, { guests }); // wrap in object!
    return res.data;
  };

export const getGuestList = async () => {
  const res = await axios.get(`${BASE_URL}/guests`);
  return res.data;
};

export const updateGuest = async (guestId, updatedGuest) => {
  const res = await axios.put(`${BASE_URL}/guests/${guestId}`, updatedGuest);
  return res.data;
};

export const deleteGuest = async (guestId) => {
  const res = await axios.delete(`${BASE_URL}/guests/${guestId}`);
  return res.data;
};

export const clearGuestList = async () => {
  const res = await axios.delete(`${BASE_URL}/guests/clear`);
  return res.data;
};
