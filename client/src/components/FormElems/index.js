import React from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Inputs
/* ------------------------------------------------------------------- */

export const Inputs = ({ data, values, onChange }) => (
  data.map((item, i) => (
    <div className='Form-Rows' key={i}>

      {item.label
        ? <label htmlFor={item.id ? item.id : ''}>
            {item.label}
          </label>
        : ''
      }

      <input
        type={item.type ? item.type : ''}
        name={item.id ? item.id : ''}
        id={item.id ? item.id : ''}
        placeholder={item.placeholder ? item.placeholder : ''}
        value={values[item.id]}
        disabled={item.disabled ? item.disabled : ''}
        onChange={item.onChange ? item.onChange : onChange}
      />

    </div>
  ))
);

/* ------------------------------------------------------------------- */
/*                              Disabled
/* ------------------------------------------------------------------- */

export const Input = ({
  label, type, id, placeholder, value, disabled, onChange
}) => (
  <div className='Form-Rows'>

    {label
      ? <label htmlFor={id}>
          {label}
        </label>
      : ''
    }

    <input
      type={type}
      name={id}
      id={id}
      placeholder={placeholder ? placeholder : ''}
      value={value}
      disabled={disabled ? true : false}
      onChange={onChange}
    />

  </div>
);

/* ------------------------------------------------------------------- */
/*                              Submit
/* ------------------------------------------------------------------- */

export const Submit = ({ value, onClick, disabled }) => (
  <input
    type='submit'
    value={value}
    onClick={onClick}
    disabled={disabled ? disabled : false}
  />
);

/* ------------------------------------------------------------------- */
/*                            Submit Link
/* ------------------------------------------------------------------- */

export const SubmitLink = ({ link, onClick, value }) => (
  <Link to={link} onClick={onClick}>{value}</Link>
);

/* ------------------------------------------------------------------- */
/*                              Select
/* ------------------------------------------------------------------- */

export const Select = ({ options, value, config, onChange }) => {
  // If there is no categories yet -> display default value
  const opts = (
    options.length
      ? options.map((item) => (
          <option value={item.title} key={item.id} id={item.id}>
            {item.title}
          </option>
        ))
      : <option value={value}>
          {value}
        </option>
  );

  return (
    <div className='Form-Rows'>
      {config.label &&
        <label htmlFor={config.id}>
          {config.label}
        </label>}
      <select
        id={config.id}
        value={value}
        onChange={onChange}
        >
        {opts}
      </select>
    </div>
  );
};








/* ------------------------------------------------------------------- */
/*                               End
/* ------------------------------------------------------------------- */
