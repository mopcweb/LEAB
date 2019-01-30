import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Input, Submit } from '../FormElems';
import { capitalize } from '../UsefulF';

/* ------------------------------------------------------------------- */
/*                              ListOfItems component
/* ------------------------------------------------------------------- */

export default class ListOfItems extends Component {
  render() {
    return (
      <div className='ListOfItems'>
        <Form
          inputs={this.props.inputs}
          inputsValues={this.props.inputsValues}
          img={this.props.img}
          children={this.props.children}
          onAdd={this.props.onAdd}
          onChange={this.props.onChange}
          onPreviewImg={this.props.onPreviewImg}
        />
        <Items data={this.props.items} addColumn={this.props.addColumn} onRemove={this.props.onRemove} onRename={this.props.onRename} showAlert={this.props.showAlert} />
      </div>
    )
  };
};

class Form extends Component {
  render() {
    return (
      <form className='Form'>
        {this.props.children}

        <label htmlFor='catImg'>
          {this.props.img}
        </label>
        <input id='catImg' type='file' onChange={this.props.onPreviewImg} />

        <Input data={this.props.inputs} values={this.props.inputsValues} onChange={this.props.onChange} />
        <Submit value='Add' onClick={this.props.onAdd} />
      </form>
    )
  };
};

class Items extends Component {
  render() {
    return (
      <form className='Form Form_items'>
        <table>
          <tbody>
            <Rows
              data={this.props.data}
              addColumn={this.props.addColumn}
              showAlert={this.props.showAlert}
              onRemove={this.props.onRemove}
              onRename={this.props.onRename}
            />
          </tbody>
        </table>
      </form>
    )
  };
};

class Rows extends Component {
  render() {
    // Filter by title
    const filtered = this.props.data.sort((a, b) => a.title.localeCompare(b.title));

    return (
      filtered.map((item, i) => (
        <Row
          key={item.id}
          title={item.title}
          id={item.id}
          addColumn={this.props.addColumn}
          showAlert={this.props.showAlert}
          onRename={this.props.onRename}
          onRemove={this.props.onRemove}
        />
      ))
    )
  };
};

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChanged: false,
      value: undefined,
      alert: {
        show: false,
        value: '',
        class: ''
      }
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleRename = this.handleRename.bind(this);
  }

  // onMouseEnter into input -> change label value from 'delete' to 'rename'
  handleMouseEnter(e) {
    this.setState({isChanged: true});
  }

  // Remove onMouseLeave this effect, but only if input value is the same
  handleMouseLeave(e) {
    if (this.props.title !== this.state.value && this.state.value !== undefined) return;

    this.setState({isChanged: false});
  }

  // Change label value from 'delete' to 'rename' on input value change
  handleRename(e) {
    // Check for ONLY english letters usage
    if (!e.target.value.match(/^[A-Za-z0-9\s()]*$/gi)) {
      // Show error alert
      clearTimeout(this.timer);
      this.timer = this.props.showAlert('Only english letters are allowed', 'Message_error');

      return
    };

    this.setState({value: e.target.value});

    // If value is same as origin was aftet data received - label value -> delete, else -> rename
    if (capitalize(this.props.title) !== e.target.value) this.setState({isChanged: true})
    else this.setState({isChanged: false})
  }

  render() {
    return (
      <tr>
        <td>
          <input
            type='text'
            name={this.props.title}
            id={this.props.id}
            // defaultValue={capitalize(this.props.title)}
            value={this.state.value === undefined ? capitalize(this.props.title) : capitalize(this.state.value)}
            onChange={this.handleRename}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
        </td>
        {this.props.addColumn}
        <td>
          <label
            htmlFor={this.props.id}
            onClick={this.props.onRemove}
            type={this.state.isChanged ? 'rename' : 'delete'}
          >
            {this.state.isChanged ? 'rename' : 'delete'}
          </label>
        </td>
      </tr>
    )
  };
};
