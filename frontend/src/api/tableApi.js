import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const fetchTableOptions = async (guestCount) => {
  const res = await axios.post(`${BASE_URL}/calculate-tables`, { count: guestCount });
  return res.data;
};

export const fetchMixedOptions = async (guestCount) => {
  const res = await axios.post(`${BASE_URL}/calculate-mixed`, { count: guestCount });
  return res.data.combinations;
};


export const saveSelectedLayout = async (tables) => {
  const response = await axios.post(`${BASE_URL}/save-layout`, { tables});
  return response.data;
};

export const loadSavedLayout = async () => {
  const res = await axios.get(`${BASE_URL}/load-layout`);
  return Array.isArray(res.data) ? res.data : [];
};
