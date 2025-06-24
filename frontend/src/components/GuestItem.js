// src/components/GuestItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

const GuestItem = ({ guest, isAssigned }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: 'GUEST',
      item: {
        id: guest.id,
        name: guest.name,
        tag_one: guest.tag_one,
        tag_two: guest.tag_two,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
   /* const assigned = isGuestAssigned?.(guest.name);
   ${assigned ? 'table-success' : ''} */
  
    return (
      <tr
        ref={dragRef}
        className={`table-row ${isDragging ? 'opacity-50' : ''} ${isAssigned ? 'table-success' : ''}`}
        style={{ cursor: 'grab' }}
      >
        <td>{guest.name}</td>
        <td>{guest.tag_one}</td>
        <td>{guest.tag_two}</td>
      </tr>
    );
  };
  
export default GuestItem; 