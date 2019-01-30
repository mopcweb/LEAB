import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';
import {Inputs, Select, Submit} from '../../components/FormElems';

/* ------------------------------------------------------------------- */
/*                              Example data
/* ------------------------------------------------------------------- */

import img from './user.jpg';

/* ------------------------------------------------------------------- */
/*                              Profile
/* ------------------------------------------------------------------- */

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      ccal: '',
      proteins: '',
      fats: '',
      carbs: '',
      currency: '$',
    };

    this.profileData = {
      title: 'Edit',
      submit: 'Save',
      addClass: 'Profile-Form',
      type: ['text','email','password'],
      name: ['name','email','password'],
      id: ['name','email','password'],
      label: ['Your name','Your email','Your password'],
      placeholder: ['Your name','Your email','Your password'],
      value: [this.state.name,this.state.email,this.state.password],
    };

    this.calorieData = {
      title: 'Edit',
      submit: 'Save',
      addClass: 'Profile-Form',
      type: ['text','text','text', 'text'],
      name: ['ccal','protein','fats', 'carbs'],
      id: ['ccal','protein','fats', 'carbs'],
      label: ['Calories target per day','Proteins target per day','Fats target per day', 'Carbohydrates target per day'],
      placeholder: ['Calories target per day','Proteins target per day','Fats target per day', 'Carbohydrates target per day'],
      value: [this.state.ccal, this.state.protein, this.state.fats, this.state.carbs],
    };

    this.currency = {
      title: 'Choose currency',
      id: 'currency',
      elems: ['USD', 'EUR', 'UAH']
    }
  };

  render() {
    return (
      <Wrapper addClass='Profile' header='Profile'>
        <Edit data={this.profileData} />
        <Form data={this.calorieData}>
          <Select data={this.currency} />
        </Form>
      </Wrapper>
    )
  };
};

class Edit extends Component {
  render() {
    return (
      <div className='Profile-Edit'>
        <Img />
        <Form data={this.props.data} />
      </div>
    )
  };
};

class Img extends Component {
  render() {
    return (
      <div className='Profile-Img'>
        <img src={img} alt='asd' />
        <form>
          <label htmlFor='upload'>Upload</label>
          <input type='file' id='upload' />
        </form>
      </div>
    )
  };
};

class Form extends Component {
  render() {
    return (
      <div className={`Form ${this.props.data.addClass ? this.props.data.addClass : ''}`}>
        <h2>{this.props.data.title}</h2>
        <form>
          <Inputs data={this.props.data} />
          {this.props.children}
          <Submit value={this.props.data.submit} />
        </form>
      </div>
    )
  };
};