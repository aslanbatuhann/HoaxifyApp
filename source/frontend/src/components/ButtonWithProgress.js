import React from 'react'
import Spinner from 'react-bootstrap/Spinner';

const ButtonWithProgress = (props) => {

  const { onClick, pendingApiCall, disabled, text, className } = props;

  return (
    <button
      className={(className || 'btn btn-primary mt-3')}
      onClick={onClick}
      disabled={disabled}
    >
      {pendingApiCall && <span className='spinner-border spinner-border-sm'></span>}{text}
    </button>
  );
};

export default ButtonWithProgress;

