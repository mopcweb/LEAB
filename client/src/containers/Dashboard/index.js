import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import {Context, store} from '../../store';
import {Wrapper} from '../../components/Main';

/* ------------------------------------------------------------------- */
/*                              Example data
/* ------------------------------------------------------------------- */


/* ------------------------------------------------------------------- */
/*                              Dashboard component
/* ------------------------------------------------------------------- */


export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: store.menu
    }
  };

  componentDidUpdate(props, state) {
    if (this.context !== state.store) {
      console.log(this.context.menu.title)
    }
  };

  render() {
    return (
      <Wrapper addClass='Dashboard' header='Dashboard'>
        <div style={{color: 'red'}}>
          {this.state.store.title}
          <form>
          <input type='text' onChange={this.state.store.changeTitle} />
          <input type='submit' />
          </form>
        </div>
      </Wrapper>
      // <Context.Consumer>
      //     {store => (
      //       <Wrapper addClass='Dashboard' header='Dashboard'>
      //       <div style={{color: 'red'}}>
      //         {store.menu.title}
      //         <form>
      //         <input type='text' onChange={store.menu.changeTitle} />
      //         <input type='submit' />
      //         </form>
      //       </div>
      //       </Wrapper>
      //     )}
      // </Context.Consumer>
    )
  };
};

Dashboard.contextType = Context;

// class Diagrams extends Component {
//   render() {
//     return (
//       <div className='Diargams'>
//
//       </div>
//     )
//   };
// };
