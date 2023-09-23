import React from 'react';

function Input(props) {
  const { label, error, name, onChange, type, defaultValue } = props;
  let className = 'form-control';

  if(type === 'file') {
    className += '-file';
  }

  if (error !== undefined) {
    className += ' is-invalid';
  }

  return (
    <div className='form-group'>
      <label>{label}</label>
      <input name={name} onChange={onChange} className={className} type={type} defaultValue={defaultValue} />
      <div className='Invalid-feedback'>
        {error}
      </div>
    </div>
  )
}

export default Input;