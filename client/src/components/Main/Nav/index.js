import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Example data
/* ------------------------------------------------------------------- */

 // Profile img
import img from './user.jpg';

// List icons
import dashboard from './dashboard.svg';
import menu from './menu.svg';
import dish from './dish.svg';
import product from './product.svg';

const values = {
  img: img,
  list: ['dashboard', 'menu', 'dishes', 'products'],
  icons: [dashboard, menu, dish, product],
  links: ['www.facebook.com', 'www.github.com', 'www.linkedin.com'],
};

/* ------------------------------------------------------------------- */
/*                              Nav Component
/* ------------------------------------------------------------------- */

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: false,
    };
  };

  // Click handler for nav opener
  onOpenerClickHandler = (e) => {
    if (!e.target.closest('.Nav-Opener')) return;

    this.setState(state => ({shown: !state.shown}));
  };

  // Click hadler for whole document
  onDocClickHander = (e) => {
    if (!e.target.closest('.Nav') && this.state.shown) {
      this.setState(state => ({shown: !state.shown}))
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocClickHander);
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocClickHander);
  };

  render() {
    return (
      <nav className={this.state.shown ? 'Nav Nav_shown' : 'Nav'}>
        <NavOpener onClick={this.onOpenerClickHandler}/>
        <NavProfile img={values.img} />
        <NavList
          list={values.list}
          icons={values.icons}
        />
        <Social
          links={values.links}
        />
        <Copy />
      </nav>
    )
  };
};

class NavOpener extends Component {
  render() {
    return (
      <div
        className='Nav-Opener'
        onClick={this.props.onClick}
      ></div>
    )
  };
};

class NavProfile extends Component {
  render() {
    return (
      <div className='Nav-Profile'>
        <div className='Nav-Img'>
          <NavLink to='/profile'>
            <img src={this.props.img} alt='lala' />
          </NavLink>
        </div>
        <NavLink className='Nav-Edit' to='/profile' activeClassName='activeLink'>
          Edit profile
        </NavLink>
        <Link className='Nav-Edit' to='/'>
          Logout
        </Link>
      </div>
    )
  };
};

class NavList extends Component {
  render() {
    return (
      <ul className='Nav-List'>
        <ListItem
          list={this.props.list}
          icons={this.props.icons}
        />
      </ul>
    )
  };
};

class ListItem extends Component {
  render() {
    return (
      this.props.list.map((item, i) => (
        <li key={i}>
          <NavLink to={`/` + item} activeClassName='activeLink'>
            {item}
            <img src={this.props.icons[i]} alt='lala'/>
          </NavLink>
        </li>
      ))
    )
  };
};

class Social extends Component {
  render() {
    const links = this.props.links.map((item, i) => (
      <a href={item} key={i}> </a>
    ))
    return (
      <div className='Nav-Social'>
        {links}
      </div>
    )
  };
};

class Copy extends Component {
  render() {
    return (
      <span className='Nav-Copy'>
        &copy; 2018 Morsweb
      </span>
    )
  };
};
