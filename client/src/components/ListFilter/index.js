import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                            My components
/* ------------------------------------------------------------------- */

import { capitalize } from '../UsefulF';

/* ------------------------------------------------------------------- */
/*                                List
/* ------------------------------------------------------------------- */

export default class List extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      data: [],
      categories: [],
      filterCat: '',
      clickedCat: '',
      filter: '',
      sortTh: 'title',
      clickedTh: 'title',
    };
  }

  // ==================>                             <================== //
  //              Handler for sorting products by category
  // ==================>                             <================== //

  handleSortByCategory = (e) => {
    // Save parent button target for convenience
    const target = e.target.closest('.List-Category');

    // If click out of btn - return
    if (!target) return

    // Check the value of clicked category. If show all - filter should be empty
    const filter = target.getAttribute('filter').toLowerCase() !== 'all'
      ? target.getAttribute('filter').toLowerCase()
      : ''

    // Update state
    this.setState({ filterCat: filter, clickedCat: filter })
  }

  // ==================>                             <================== //
  //         Handler for sorting products by title (input field)
  // ==================>                             <================== //

  handleSortByTitle = (e) => {
    this.setState({filter: e.target.value.toLowerCase()})
  }

  // ==================>                             <================== //
  //          Handler for sorting products by column (asc/desc)
  // ==================>                             <================== //

  handleSortByColumn = (e) => {
    // Return if click not on TH
    if (!e.target.closest('th')) return;

    // For convenience save state & target th into const
    const target = e.target.closest('th');

    // Get list of products to sort
    const { items } = this.props;

    // Get clicked column text
    let cell = target.getAttribute('filter').toLowerCase().trim();

    // =====> Sorting
    if (this.state.sortTh !== cell) {

      // from a -> b
      items.sort((a, b) => {
        switch(target.dataset.type) {
          case 'number':
            return a[cell] - b[cell];

          case 'string':
            return a[cell].localeCompare(b[cell]);

          default:
            return false
        }
      });

      // Update state
      this.setState({
        sortTh: cell,
        clickedTh: cell,
      });
    } else {

      // from b -> a
      items.sort((a, b) => {
        switch(target.dataset.type) {
          case 'number':
            return b[cell] - a[cell];

          case 'string':
            return b[cell].localeCompare(a[cell]);

          default:
            return false
        }
      });

      // Update state
      this.setState({
        sortTh: '',
        clickedTh: cell,
      });
    };
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    return (
      <div className='List'>
        <Categories
          lang={this.props.lang}
          cats={this.props.categories}
          clickedCat={this.state.clickedCat}
          onSortByCategory={this.handleSortByCategory}
          onAdd={this.props.onModalOpen}
        />
        <div className='List-Controls'>
          <Link to={window.location.pathname + '/new-item'}>{this.props.lang.addListItemBtn}</Link>
          <Filter value={this.state.filter} onChange={this.handleSortByTitle} />
        </div>
        <Table
          data={this.props.items}
          headers={this.props.headers}
          filter={this.state.filter}
          filterCat={this.state.filterCat}
          clickedTh={this.state.clickedTh}
          handleClick={this.handleSortByColumn}
        />
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                             Categories
/* ------------------------------------------------------------------- */

class Categories extends Component {
  render() {
    const cats = this.props.cats.map(item => (
      <Category
        key={item.title}
        filter={item.title}
        value={item.title}
        img={item.img}
        clicked={this.props.clickedCat}
      />
    ));

    return (
      <div className='List-Categories'>
        <h2>
          <span>{this.props.lang.categoriesFilterHeader}</span>
          <button onClick={this.props.onAdd}>{this.props.lang.addCategoryBtn}</button>
        </h2>
        <div onClick={this.props.onSortByCategory}>
          {cats}
          <Category
            lang={this.props.lang}
            filter='all'
            value={this.props.lang.showAllItems}
            clicked={this.props.clickedCat}
          />
        </div>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Category
/* ------------------------------------------------------------------- */

class Category extends Component {
  render() {
    const { clicked, value, filter, lang } = this.props;

    const filteredCat =
      clicked.toLowerCase() === filter.toLowerCase() ||
      (clicked.toLowerCase() === '' && lang && value === lang.showAllItems)

    return (
      <button
        className={filteredCat ? 'List-Category List-Category_clicked' : 'List-Category'}
        style={{ 'backgroundImage': this.props.img ? `url(${this.props.img})` : '' }}
        filter={filter ? filter : ''}
      >
        <span style={{ 'WebkitBoxOrient': 'vertical' }}>
          {capitalize(this.props.value)}
        </span>
      </button>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Filter
/* ------------------------------------------------------------------- */

class Filter extends Component {
  render() {
    return (
      <input
        type='text'
        value={this.props.value}
        placeholder='Type in to find what you want'
        onChange={this.props.onChange}
      />
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Table
/* ------------------------------------------------------------------- */

class Table extends Component {
  render() {
    const headers = this.props.headers.map((item, i) => (
      <Header colS={item.colS ? item.colS : ''} key={item.filter + i}
        type={item.type} filter={item.filter} value={item.value}
        span={item.span} clicked={this.props.clickedTh} />
    ));

    return (
      <div className='List-Table'>
        <table onClick={this.props.handleClick} >
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          <tbody>
            <Rows
              data={this.props.data}
              filter={this.props.filter}
              filterCat={this.props.filterCat}
            />
          </tbody>
        </table>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Header
/* ------------------------------------------------------------------- */

class Header extends Component {
  render() {
    // Get necessary variables from this.props
    const { clicked, value } = this.props;

    // Define clicked th
    const clickedTh = clicked === value.toLowerCase() ? true : false;

    return (
      <th
        colSpan={this.props.colS ? this.props.colS : ''}
        data-type={this.props.type}
        filter={this.props.filter ? this.props.filter : ''}
        className={clickedTh ? 'clicked' : ''}
        >
        {this.props.value}
        <span>
          {this.props.span}
        </span>
      </th>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                                Rows
/* ------------------------------------------------------------------- */

class Rows extends Component {
  render() {
    // Save data in variable for convenience
    const { data, filterCat, filter } = this.props;

    // Filter data with category
    const filteredCat = data.filter(item => item.category.toLowerCase().indexOf(filterCat) !== -1);

    // Filter categorized data by title
    const filtered = filteredCat.filter(item => item.title.toLowerCase().indexOf(filter) !== -1);

    return (
      filtered.map(item => (
        <tr key={item._id} className='List-Item'>
          <td>
            <Link to={window.location.pathname + '/' + item.link}>
              <img src={new Buffer(item.img.data).toString()} alt={item.title} />
            </Link>
          </td>
          <Cell
            value={item.title}
            link={window.location.pathname + '/' + item.link}
          />
          <Cell value={item.ccal} />
          <Cell value={item.proteins} />
          <Cell value={item.fats} />
          <Cell value={item.carbs} />
          <Cell value={capitalize(item.category)} />
        </tr>
      ))
    )
  };
};

/* ------------------------------------------------------------------- */
/*                                Cell
/* ------------------------------------------------------------------- */

class Cell extends Component {
  render() {
    return (
      <td>
        {this.props.link
          ? <Link to={this.props.link ? this.props.link : ''}>{this.props.value}</Link>
          : this.props.value}
      </td>
    )
  };
};




//
