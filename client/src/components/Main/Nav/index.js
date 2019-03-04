import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                               Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from '../../../config/routes';

// =====> withLang
import { withLang, withUser } from '../../../config/lang';

/* ------------------------------------------------------------------- */
/*                              Firebase
/* ------------------------------------------------------------------- */

import { withFirebase } from '../../../config/store';

/* ------------------------------------------------------------------- */
/*                            Example data
/* ------------------------------------------------------------------- */

 // =====> Profile img
import img from './imgs/user.jpg';

// =====> List icons
import dashboard from './imgs/dashboard.svg';
import menu from './imgs/menu.svg';
import dishes from './imgs/dish.svg';
import products from './imgs/product.svg';

/* ------------------------------------------------------------------- */
/*                                 Nav
/* ------------------------------------------------------------------- */

class Nav extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      shown: false
    };
  }

  // ==================>                             <================== //
  //                    Click handler for nav opener
  // ==================>                             <================== //

  onOpenerClickHandler = (e) => {
    // Stop if not Nav openner
    if (!e.target.closest('.Nav-Opener')) return;

    // Update state
    this.setState(state => ({shown: !state.shown}));
  }

  // ==================>                             <================== //
  //                   Click hadler for whole document
  // ==================>                             <================== //

  onDocClickHandler = (e) => {
    // If click out of Nav and it is showing -> close Nav
    if (!e.target.closest('.Nav') && this.state.shown) {
      this.setState(state => ({shown: !state.shown}))
    }
  }

  // ==================>                             <================== //
  //                 Lifecycle hook (just after render)
  // ==================>                             <================== //

  componentDidMount() {
    document.addEventListener('click', this.onDocClickHandler);
  }

  // ==================>                             <================== //
  //                Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocClickHandler);
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    // Get nav variables form lang
    const {
      profileBtn, signOutBtn, navLinks, copyright
    } = this.props.lang.constants.nav;

    return (
      <nav className={this.state.shown ? 'Nav Nav_shown' : 'Nav'}>
        <div className='Nav-Opener' onClick={this.onOpenerClickHandler}></div>

        <NavProfile
          img={new Buffer(this.props.userProfile.img.data).toString()}
          edit={profileBtn}
          signOut={signOutBtn}
        />

        <ul className='Nav-List'>
          <NavLinks
            items={[
              {
                title: navLinks.dashboard,
                link: routes.DASHBOARD,
                icon: dashboard
              },
              {
                title: navLinks.menu,
                link: routes.MENU,
                icon: menu
              },
              {
                title: navLinks.dishes,
                link: routes.DISHES,
                icon: dishes
              },
              {
                title: navLinks.products,
                link: routes.PRODUCTS,
                icon: products
              }
            ]}
          />
        </ul>

        <Social
          links={[ 'www.facebook.com', 'www.github.com', 'www.linkedin.com' ]}
        />
        <Copy value={copyright} />
      </nav>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              NavProfile
/* ------------------------------------------------------------------- */

class NavProfile extends Component {
  render() {
    return (
      <div className='Nav-Profile'>
        <div className='Nav-Img'>
          <NavLink to={routes.PROFILE}>
            <img src={this.props.img} alt='lala' />
          </NavLink>
        </div>

        <NavLink className='Nav-Edit' to={routes.PROFILE} activeClassName='activeLink'>
          {this.props.edit}
        </NavLink>

        <SignOut signOut={this.props.signOut} />
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                             BtnSignOut
/* ------------------------------------------------------------------- */

class BtnSignOut extends Component {
  // ==================>                             <================== //
  //                           Handle Sign Out
  // ==================>                             <================== //

  handleClick = async e => {
    // Sign out
    await this.props.firebase.doSignOut();

    // Redirect
    this.props.history.push(routes.HOME);
  }

  // ==================>                             <================== //
  //                                Render
  // ==================>                             <================== //

  render() {
    return (
      <button className='Nav-Edit' onClick={this.handleClick}>
        {this.props.signOut}
      </button>
    )
  };
};

// =====> Use Router & FbContext to BtnSignOut
const SignOut = withRouter(withFirebase(BtnSignOut));

/* ------------------------------------------------------------------- */
/*                           NavLinks (Links)
/* ------------------------------------------------------------------- */

class NavLinks extends Component {
  render() {
    return (
      this.props.items.map((item, i) => (
        <li key={item + '-' + i}>
          <NavLink to={item.link} activeClassName='activeLink'>
            {item.title}
            <img src={item.icon} alt={item.title}/>
          </NavLink>
        </li>
      ))
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Social
/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */
/*                             Copyright
/* ------------------------------------------------------------------- */

class Copy extends Component {
  render() {
    return (
      <span className='Nav-Copy'>
        &copy; {this.props.value}
      </span>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

export default withUser(withLang(Nav));

//
