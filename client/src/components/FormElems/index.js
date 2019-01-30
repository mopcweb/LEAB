import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Example data for Inputs
/* ------------------------------------------------------------------- */

// const data = {
//   addClass: '',
//   type: ['text', 'number', 'number', 'number', 'number', 'number', 'text'],
//   name: ['title', 'amount', 'price', 'protein', 'fats', 'carbs', 'ccal'],
//   id: ['title', 'amount', 'price', 'protein', 'fats', 'carbs', 'ccal'],
//   label: ['Enter title', 'Enter amount', 'Enter price', 'Enter proteins', 'Enter fats', 'Enter carbohydrates', 'Calories'],
//   placeholder: ['Enter title', 'Enter amount', 'Enter price', 'Enter proteins', 'Enter fats', 'Enter carbohydrates'],
//   disabled: ['','','','','','',true],
//   value: [this.state.title, this.state.amount, this.state.price, this.state.protein, this.state.fats, this.state.carbs,this.state.ccal],
// };

/* ------------------------------------------------------------------- */
/*                              Inputs
/* ------------------------------------------------------------------- */

class Inputs extends Component {
  render() {
    return (
      this.props.data.type.map((item, i) => (
        <div className='Form-Rows' key={i}>

          <label htmlFor={this.props.data.id[i]}>
            {this.props.data.label[i]}
          </label>

          <input
            type={this.props.data.type ? this.props.data.type[i] : ''}
            name={this.props.data.name ? this.props.data.name[i] : ''}
            id={this.props.data.id ? this.props.data.id[i] : ''}
            placeholder={this.props.data.placeholder ? this.props.data.placeholder[i] : ''}
            defaultValue={this.props.data.value ? this.props.data.value[i] : ''}
            onChange={this.props.onChange}
            disabled={this.props.data.disabled ? this.props.data.disabled[i] : ''}
          />

        </div>
      ))
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Input
/* ------------------------------------------------------------------- */

class Input extends Component {
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

          {/* {this.props.labels && this.props.labels[item.id]
            ? <label htmlFor={item.id ? item.id : ''}>
                {this.props.labels[item.id]}
              </label>
            : ''
          } */}

          {/* {item.value
            ? <input
                type={item.type ? item.type : ''}
                name={item.id ? item.id : ''}
                id={item.id ? item.id : ''}
                placeholder={item.placeholder ? item.placeholder : ''}
                value={item.value}
                disabled={item.disabled ? item.disabled : ''}
                onChange={item.onChange ? item.onChange : this.props.onChange}
              />
            : <input
                type={item.type ? item.type : ''}
                name={item.id ? item.id : ''}
                id={item.id ? item.id : ''}
                placeholder={item.placeholder ? item.placeholder : ''}
                defaultValue={item.defaultValue ? item.defaultValue : ''}
                disabled={item.disabled ? item.disabled : ''}
                onChange={item.onChange ? item.onChange : this.props.onChange}
              />
          } */}

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

        {this.props.label ?
          <label htmlFor={this.props.id}>
            {this.props.label}
          </label>  :
          ''
        }

        <input
          type={this.props.type}
          name={this.props.id}
          id={this.props.id}
          disabled={true}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          value={this.props.value}
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
      <input type='submit' value={this.props.value} onClick={this.props.onClick} />
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Submit Link
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
      this.props.data.elems.map((item) => (
        <option value={item} key={item}>
          {item}
        </option>
      ))
    );

    return (
      <div className='Form-Rows'>
        <label htmlFor={this.props.data.id}>
          {this.props.data.title}
        </label>
        <select
          id={this.props.data.id}
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
/*                              Selects
/* ------------------------------------------------------------------- */

class Selects extends Component {
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

export {Inputs, Input, Disabled, Select, Selects, Submit, SubmitLink};
