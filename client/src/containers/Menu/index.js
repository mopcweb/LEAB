import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';

/* ------------------------------------------------------------------- */
/*                              Example data
/* ------------------------------------------------------------------- */


/* ------------------------------------------------------------------- */
/*                              Menu component
/* ------------------------------------------------------------------- */

export default class Menu extends Component {
  render() {
    return (
      <Wrapper addClass='Menu' header='Menu'>
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </Wrapper>
    )
  };
};

class MenuItem extends Component {
  render() {
    return (
      <div className='Menu-Item'>
        <Link to='/menu/menuitem'>
          <img src='https://d9hyo6bif16lx.cloudfront.net/live/img/production/detail/menu/breakfast_breakfast-classics_big-two-do-breakfast.jpg' alt='item' />
        </Link>
        <div className='Menu-Data'>
          <Link to='/menu/menuitem'>First Breakfast</Link>
          <hr />
          <span><b>Price</b> <i>1000 USD</i></span>
          <span><b>Calories</b> <i>2902</i></span>
          <span><b>Proteins</b> <i>50</i></span>
          <span><b>Fats</b> <i>41</i></span>
          <span><b>Carbohydrates</b> <i>45</i></span>
        </div>
      </div>
    )
  };
};


// class NewTime extends Component {
//   render() {
//     return (
//       <div>
//
//       </div>
//     )
//   };
// };














//
