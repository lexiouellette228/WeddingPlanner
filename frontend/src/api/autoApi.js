// src/api/autoApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const autoGenerateSeating = async (guests, numTables, seatsPerTable, shape = "round") => {
    const payload = {
      guests,
      num_tables: numTables,
      seats_per_table: seatsPerTable,
      shape,
    };
  
    const response = await axios.post(`${BASE_URL}/auto-generate`, payload);
    return response.data.tables;
  };
  

export const saveAutoSeatingChart = async (tables) => {
    const res = await axios.post(`${BASE_URL}/save-auto`, { tables });
    return res.data;
}

export const getAutoSeatingChart = async () => {
    const res = await axios.get(`${BASE_URL}/load-auto-chart`);
    return res.data;
  };
  