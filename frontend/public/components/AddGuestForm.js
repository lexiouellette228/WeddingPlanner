import React, { useState } from 'react';

const AddGuestForm = ({ onAddGuest }) => {
  const [guestName, setGuestName] = useState('');
  const [guestTag, setGuestTag] = useState('bride_family');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    onAddGuest({ name: guestName.trim(), tag: guestTag });
    setGuestName('');
    setGuestTag('bride_family');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-row d-flex align-items-center gap-2">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Guest Name"
          className="form-control w-50"
        />
        <select
          value={guestTag}
          onChange={(e) => setGuestTag(e.target.value)}
          className="form-select w-25"
        >
          <option value="bride_family">Bride's Family</option>
          <option value="groom_family">Groom's Family</option>
          <option value="friend">Friend</option>
          <option value="couple">Couple</option>
        </select>
        <button type="submit" className="btn btn-primary">Add Guest</button>
      </div>
    </form>
  );
};

export default AddGuestForm;