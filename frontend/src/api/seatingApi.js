import axios from "axios";

export const fetchSeating = async () =>
    (await axios.get('http://localhost:8000/api/seating')).data;
  
export const saveSeating = async (tables) =>
    await axios.post('http://localhost:8000/api/seating', tables);

export const clearSeating = async () =>
    (await axios.delete(`http://localhost:8000/api/guests/seating`)).data;

