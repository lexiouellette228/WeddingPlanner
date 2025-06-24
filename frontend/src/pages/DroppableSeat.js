// DroppableSeat.js
import React from 'react';
import { Group, Circle, Text } from 'react-konva';

const DroppableSeat = ({
  offsetX,
  offsetY,
  tableX, 
  tableY,
  radius,
  guestName,
  tableId,
  seatIndex,
  onSeatDragStart,
  onSeatDragEnd,
}) => {
  return (
    <Group
      x={tableX + offsetX}
      y={tableY + offsetY}
      draggable
      onDragStart={() => onSeatDragStart(tableId, seatIndex)}
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        onSeatDragEnd(tableId, seatIndex, newX, newY, guestName);
      }}
    >
      <Circle radius={radius} fill={guestName ? 'salmon' : 'lightgray'} />
      <Text
        text={guestName || `${seatIndex + 1}`}
        fontSize={12}
        fontStyle='bold'
        align="center"
        verticalAlign="center"
        offsetX={(guestName || `${seatIndex + 1}`).length * 3.5}
        offsetY={6}
      />
    </Group>
  );
};

export default DroppableSeat;
