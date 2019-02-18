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

    this.state = {
      data: [],
      categories: [],
      filterCat: '',
      clickedCat: '',
      filter: '',
      sortTh: 'title',
      clickedTh: 'title',
    };

    this.handleSortByColumn = this.handleSortByColumn.bind(this);
    this.handleSortByTitle = this.handleSortByTitle.bind(this);
    this.handleSortByCategory = this.handleSortByCategory.bind(this);
  };

  // Handler for sorting products by category
  handleSortByCategory(e) {
    // Save parent button target for convenience
    const target = e.target.closest('.List-Category');

    // If click out of btn - return
    if (!target) return

    // Check the value of clicked category. If show all - filter should be empty
    let filter = target.firstChild.textContent.toLowerCase();
    if (filter === 'show all') filter = '';

    // Update state
    this.setState({
      filterCat: filter,
      clickedCat: filter
    })
  };

  // Handler for sorting products by title (input field)
  handleSortByTitle(e) {
    this.setState({filter: e.target.value.toLowerCase()})
  };

  // Handler for sorting products by column (asc/desc)
  handleSortByColumn(e) {
    // Return if click not on TH
    if (!e.target.closest('th')) return;

    // For convenience save state & target th into const
    const target = e.target.closest('th');
    const data = this.props.items;

    // Get clicked column text
    let cell = target.firstChild.data.toLowerCase().trim();

    // Sorting
    if (this.state.sortTh !== cell) {

      // from a -> b
      data.sort((a, b) => {
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
        data: data,
        sortTh: cell,
        clickedTh: cell,
      });
    } else {

      // from b -> a
      data.sort((a, b) => {
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
        data: data,
        sortTh: '',
        clickedTh: cell,
      });
    };
  };

  render() {
    return (
      <div className='List'>
        <Categories
          cats={this.props.categories}
          clickedCat={this.state.clickedCat}
          onSortByCategory={this.handleSortByCategory}
          onAdd={this.props.onModalOpen}
        />
        <div className='List-Controls'>
          <Link to={window.location.pathname + '/new-item'}>Add item</Link>
          <Filter value={this.state.filter} onChange={this.handleSortByTitle} />
        </div>
        <Table
          data={this.props.items}
          filter={this.state.filter}
          filterCat={this.state.filterCat}
          sortTh={this.state.sortTh}
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
        value={item.title}
        img={item.img}
        clicked={this.props.clickedCat}
      />
    ));

    return (
      <div className='List-Categories'>
        <h2>
          <span>Choose category</span>
          <button onClick={this.props.onAdd}>Add</button>
        </h2>
        <div onClick={this.props.onSortByCategory}>
          {cats}
          <Category value='Show all' clicked={this.props.clickedCat} />
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
    const { clicked, value } = this.props;

    const filter =
      clicked.toLowerCase() === value.toLowerCase() ||
      (clicked.toLowerCase() === '' && value === 'Show all')

    return (
      <button
        className={filter ? 'List-Category List-Category_clicked' : 'List-Category'}
        style={{'backgroundImage': this.props.img ? `url(${this.props.img})` : ''}}>
        <span>
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
    return (
      <div className='List-Table'>
        <table onClick={this.props.handleClick} >
          <thead>
            <tr>
              <Header colS='2' type='string' value='Title' span='Title' clicked={this.props.clickedTh} />
              <Header type='string' value='Ccal' span='Ccal' clicked={this.props.clickedTh} />
              <Header type='number' value='Proteins' span='P' clicked={this.props.clickedTh} />
              <Header type='number' value='Fats' span='F' clicked={this.props.clickedTh} />
              <Header type='number' value='Carbs' span='C' clicked={this.props.clickedTh} />
              <Header type='string' value='Category' span='Cat' clicked={this.props.clickedTh} />
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
    let cliked = false;
    if (this.props.clicked === this.props.value.toLowerCase()) cliked = true

    return (
      <th
        colSpan={this.props.colS ? this.props.colS : ''}
        data-type={this.props.type}
        className={cliked ? 'clicked' : ''}
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
    const { data } = this.props;

    // Filter data with category
    const filteredcat = data.filter(item => item.category.toLowerCase().indexOf(this.props.filterCat) !== -1);

    // Filter categorized data by title
    const filtered = filteredcat.filter(item => item.title.toLowerCase().indexOf(this.props.filter) !== -1);

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
    // Cell without link
    const nolink = (
      <td>
        {this.props.value}
      </td>
    );

    // Cell with link
    const link = (
      <td>
        <Link to={this.props.link ? this.props.link : ''}>{this.props.value}</Link>
      </td>
    );

    return (
      this.props.link ? link : nolink
    )
  };
};
