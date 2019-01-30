import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import { Input, Disabled, Select, Submit } from '../../components/FormElems';
import {Wrapper} from '../../components/Main';
import {capitalize} from '../../components/UsefulF';
// import Modal from '../../components/Modal';

/* ------------------------------------------------------------------- */
/*                              Dish component
/* ------------------------------------------------------------------- */

export default class Dish extends Component {
  constructor(props) {
    super(props);

    this.catSelect = {
      title: 'Choose category',
      id: 'category',
      elems: ['first','second','garnier']
    };

    this.unitSelect = {
      title: 'Choose unit of measure',
      id: 'unit',
      elems: ['kilo(s)','gram(s)','litr(es)']
    };

    this.state = {
      category: 'salads',
      unit: this.unitSelect.elems[1],
      title: capitalize(window.location.pathname.replace(/\/menu\//gi, '')),
      amount: '',
      price: '',
      protein: '',
      fats: '',
      carbs: '',
      ccal: `0 / ${this.unitSelect.elems[1]}`
    };

    this.inputs = [
      {
        type: 'text',
        id: 'title',
        label: 'Enter title',
        placeholder: 'Enter title',
        defaultValue: this.state.title,
      }
    ];

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(e) {
    const state = e.target.id;

    // Update target input state
    this.setState({[state]: e.target.value});

    // Update ccal state
    this.setState(state => ({
      ccal: (((+state.protein + +state.carbs) * 4 + +state.fats * 9) + ' /' + state.amount + ' ' + state.unit)
    }));
  };

  render() {
    return (
      <Wrapper addClass='MenuItem' header={this.state.title}>
        <Form
          inputs={this.inputs}
          title={this.state.title}
          ccal={this.state.ccal}
          category={this.state.category}
          unit={this.state.unit}
          catSelect={this.catSelect}
          unitSelect={this.unitSelect}
          onChange={this.handleChange}
        />
        <ItemsList />
      </Wrapper>
    )
  };
};

class Form extends Component {
  render() {
    return (
      <div className='MenuItem-Info'>
        <h2>{this.props.title}</h2>

        <form className='Form'>
          <Img />
          <Data
            inputs={this.props.inputs}
            ccal={this.props.ccal}
            category={this.props.category}
            unit={this.props.unit}
            catSelect={this.props.catSelect}
            unitSelect={this.props.unitSelect}
            onChange={this.props.onChange}
          />
        </form>

      </div>
    )
  };
};

class Img extends Component {
  render() {
    return (
      <div className='MenuItem-Img'>
        <img src='https://d9hyo6bif16lx.cloudfront.net/live/img/production/detail/menu/breakfast_breakfast-classics_big-two-do-breakfast.jpg' alt='pineapple' />
        <label htmlFor='upload'>Upload</label>
        <input type='file' id='upload' />
      </div>
    )
  };
};

class Data extends Component {
  render() {
    return (
      <div className='MenuItem-Data'>

        <Input data={this.props.inputs} onChange={this.props.onChange} />

        <Select data={this.props.catSelect} onChange={this.props.onChange} value={this.props.category} />


        <Disabled type='text' id='weight' label='Weight' value={this.props.ccal} />
        <Disabled type='text' id='ccal' label='Calories' value={this.props.ccal} />
        <Disabled type='text' id='protein' label='Proteins' value={this.props.ccal} />
        <Disabled type='text' id='fats' label='Fats' value={this.props.ccal} />
        <Disabled type='text' id='carbs' label='Carbohydrates' value={this.props.ccal} />

        <div className='Form-Rows'>
          <Submit value='Delete' />
          <Submit value='Save' />
        </div>

      </div>
    )
  };
};

class ItemsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      items: [
        {
          product: 'salad',
          amount: '200'
        },
        {
          product: 'milk',
          amount: '100'
        },
        {
          product: 'tomatoes',
          amount: '500'
        }
      ]
    };

    this.input = [
      {
        type: 'number',
        id: 'amount',
        label: 'Enter amount',
        placeholder: 'Enter amount',
        defaultValue: ''
      }
    ];

    this.select = {
      title: 'Choose product',
      id: 'product',
      elems: ['soups','salads','second','garnier']
    };

    this.handleClick = this.handleClick.bind(this)
  };

  handleClick(e) {
    this.setState(state => ({isOpen: !state.isOpen}))
  };

  render() {
    return (
      <div className='Dish-Products'>
        <h2>Dishes</h2>
        {/* <div className='Form-Rows'>
          <button className='Btn_styled' onClick={this.handleClick}>Add products</button>
        </div> */}

        {/* <Modal isOpen={this.state.isOpen} onClick={this.handleClick}> */}
          <ListOfProducts input={this.input} select={this.select} items={this.state.items} />
        {/* </Modal> */}
      </div>
    )
  };
};

class ListOfProducts extends Component {
  render() {
    return (
      <div className='ListOfItems'>

        <AddProduct input={this.props.input} select={this.props.select} />
        <Items data={this.props.items} />
      </div>
    )
  };
};

class AddProduct extends Component {
  render() {
    return (
      <form className='Form'>
        <Select
          data={this.props.select}
          onChange={this.props.onChange}
          value={this.props.select[0]}
        />
        <Input data={this.props.input} />
        <Submit value='Add' />
      </form>
    )
  };
};

class Items extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this)
  };

  handleClick(e) {
    // Define parent row
    const row = e.target.closest('tr');

    const question = window.confirm('Are you sure?');

    // Remove row
    if (question) row.parentNode.removeChild(row)
  }

  render() {
    return (
      <form className='Form Form_items'>
        <table>
          <tbody>
            <Rows
              data={this.props.data}
              onClick={this.handleClick}
            />
            <tr>
              <td colSpan='3'>
                <Submit value='Save' />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  };
};

class Rows extends Component {
  render() {
    const filtered = this.props.data.sort((a, b) => a.product.localeCompare(b.product));

    return (
      filtered.map((item, i) => (
        <tr key={i}>
          <td>
            <select>
              <option>Milk</option>
              <option>Tomatoes</option>
              <option>Potato</option>
              <option>Ginger</option>
            </select>
          </td>
          <td>
            <input
              type='text'
              defaultValue={item.amount}
            />
          </td>
          <td>
            <label
              htmlFor={item.product}
              onClick={this.props.onClick}
            >remove</label>
          </td>
        </tr>
      ))
    )
  };
};






//
