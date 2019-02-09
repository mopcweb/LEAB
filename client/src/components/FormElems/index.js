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

class Disabled extends Component {
  render() {
    return (
      <div className='Form-Rows'>

        {this.props.label
          ? <label htmlFor={this.props.id}>
              {this.props.label}
            </label>
          : ''
        }

        <input
          type={this.props.type ? this.props.type : ''}
          name={this.props.id ? this.props.id : ''}
          id={this.props.id ? this.props.id : ''}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          value={this.props.value}
          disabled={true}
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
    const options = (
      this.props.options.map((item) => (
        <option value={item.title} key={item.id}>
          {item.title}
        </option>
      ))
    );

    return (
      <div className='Form-Rows'>
        <label htmlFor={this.props.config.id}>
          {this.props.config.label}
        </label>
        <select
          id={this.props.config.id}
          value={this.props.value}
          onChange={this.props.onChange}
          >
          {options}
        </select>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export {Inputs, Disabled, Select, Submit, SubmitLink};
