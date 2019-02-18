import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Inputs
/* ------------------------------------------------------------------- */

class Inputs extends Component {
  render() {
    return (
      this.props.data.map((item, i) => (
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
            value={this.props.values[item.id]}
            disabled={item.disabled ? item.disabled : ''}
            onChange={item.onChange ? item.onChange : this.props.onChange}
          />

        </div>
      ))
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Disabled
/* ------------------------------------------------------------------- */

class Input extends Component {
  render() {
    // Get this.props variables
    const {
      label, type, id, placeholder, value, disabled, onChange
    } = this.props;

    return (
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
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Submit
/* ------------------------------------------------------------------- */

class Submit extends Component {
  render() {
    return (
      <input
        type='submit'
        value={this.props.value}
        onClick={this.props.onClick}
        disabled={this.props.disabled ? this.props.disabled : false}
      />
    )
  };
};

/* ------------------------------------------------------------------- */
/*                            Submit Link
/* ------------------------------------------------------------------- */

class SubmitLink extends Component {
  render() {
    return (
      <Link to={this.props.link} onClick={this.props.onClick}>{this.props.value}</Link>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Select
/* ------------------------------------------------------------------- */

class Select extends Component {
  render() {
    const { options, value, config, onChange } = this.props;

    const opts = (
      options.map((item) => (
        <option value={item.title} key={item.id}>
          {item.title}
        </option>
      ))
    );

    return (
      <div className='Form-Rows'>
        <label htmlFor={config.id}>
          {config.label}
        </label>
        <select
          id={config.id}
          value={value}
          onChange={onChange}
          >
          {opts}
        </select>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export {Inputs, Input, Select, Submit, SubmitLink};
