import React from 'react';

const Alert = ({ message, type, onClose }) => {
  return (
    <div className={`alert ${type}`}>
      <p>{message}</p>&emsp;
      <button onClick={onClose} className="close-button">
        &#10006;
      </button>
    </div>
  );
};

export default Alert;
