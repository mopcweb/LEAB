import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';
import List from '../../components/ListFilter';
import Modal from '../../components/Modal';
import ListOfItems from '../../components/ListOfItems';

/* ------------------------------------------------------------------- */
/*                              Products component
/* ------------------------------------------------------------------- */

export default class Dishes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.inputs = {
      type: ['file', 'text'],
      name: ['file', 'title'],
      id: ['catImg', 'catTitle'],
      label: ['Image for category', ''],
      placeholder: ['','Category title'],
      value: ['','']
    };

    this.items = [
      'garnier',
      'salad',
      'soups',
      'second'
    ];

    this.handleClick =  this.handleClick.bind(this)
  };

  handleClick(e) {
    this.setState(state => ({isOpen: !state.isOpen}))
  };

  render() {
    return (
      <Wrapper addClass='Dishes' header='Dishes'>
        <List data='dishes' onClick={this.handleClick} />
        <Modal isOpen={this.state.isOpen} onClick={this.handleClick}>
          <ListOfItems inputs={this.inputs} items={this.items} />
        </Modal>
      </Wrapper>
    )
  };
};




//
