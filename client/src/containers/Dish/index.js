import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

import defaultImg from './default.svg';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Api
import * as api from '../../config/api';

// =====> Routes
import * as routes from '../../config/routes';

// =====> Provide Lang
import { withLang, withUser } from '../../config/lang';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Inputs, Input, Select, SubmitLink } from '../../components/FormElems';
import { Wrapper } from '../../components/Main';
import withAlert from '../../components/Alert';
import { capitalize, makeURL } from '../../components/UsefulF';

/* ------------------------------------------------------------------- */
/*                               Product
/* ------------------------------------------------------------------- */

class Dish extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      id: '',
      title: '',
      link: '',
      img: defaultImg,
      price: '',
      categories: [],
      category: '',
      amount: '',
      proteins: '',
      fats: '',
      carbs: '',
      ccal: this.props.lang.constants.product.defaultCalories,
      ccalUnified: '',
      products: [],
      product: ''
    };
  };

  // ==================>                             <================== //
  //                       Handle calorie change
  // ==================>                             <================== //

  handleChangeCcal = (e) => {
    const prop = e.target.id;
    const value = e.target.value;

    const { defaultUnit } = this.props.lang.constants.product;

    // Update target input state
    this.setState({[prop]: capitalize(value)});

    // If focused input - title -> make link
    if (prop === 'title') this.setState({ link: makeURL(value) })

    // Update ccal & ccalUnified state
    this.setState(state => {
      // Define whether to use 100gr or manual amount
      const amount = 100;

      // Calculate ccal per 100gr
      const ccalUnified = Math.round(
        (((+state.proteins + +state.carbs) * 4 + +state.fats * 9) / amount * 100) * 10
      ) / 10;

      // Update state
      return {
        // Prop, for filtering by ccal per 100gr
        ccalUnified,

        // Display ccal per 100 gr
        ccal: (ccalUnified + ' / ' + defaultUnit.title)
      };
    });
  };

  // ==================>                             <================== //
  //                    Handle disabled inputs change
  // ==================>                             <================== //

  handleChange = (e) => {
    const prop = e.target.id;
    const value = e.target.value;

    // Update target input state
    this.setState({[prop]: capitalize(value)});

    // If focused input - title -> make link
    if (prop === 'title') this.setState({ link: makeURL(value) });

    // If focused input product
    if (prop === 'product') this.setState({
      [prop]: this.state.products.find(item => item.title === value)
    });
  }

  // ==================>                             <================== //
  //                      Handle save/upadate product
  // ==================>                             <================== //

  handleSave = async (e) => {
    // Get state variables
    const { title, link, img, price, proteins, ccalUnified,
      fats, carbs, ccal, amount, category, id } = this.state;

    // Get necessary props form lang
    const {
      requiredFiledsMsg, updateProductMsg, addProductMsg, defaultAltAmount
    } = this.props.lang.constants.product;

    // Create obj with data
    const data = {
      title, link, img, price, ccal, category, ccalUnified,
      amount: amount ? amount : defaultAltAmount,
      proteins: proteins ? proteins : 0,
      fats: fats ? fats : 0,
      carbs: carbs ? carbs : 0,
    };

    // Check if all required fields are specified
    if (!title || !price || !category) {
      // Prevent default page reload & redirect
      e.preventDefault();

      // Show error alert
      return this.props.showAlert(requiredFiledsMsg, 'error');
    };

    await axios({
        method: `${id ? 'put' : 'post'}`,
        url: `${api.PRODUCTS}${id ? '/' + id : ''}`,
        data
      })
      .catch(err => err)

    // Request for this new product -> to receive product id
    this.getProduct();

    // Show success alert
    this.props.showAlert(id ? updateProductMsg : addProductMsg, 'success');
  }

  // ==================>                             <================== //
  //                       Handle delete product
  // ==================>                             <================== //

  handleDelete = async (e) => {
    // Get necessary for alert props form lang
    const { noSavedDataMsg, confirmMsg } = this.props.lang.constants.product;

    // Stop running if there is no saved data
    if (!this.state.id) {
      // Prevent default page reload
      e.preventDefault();

      // Show eror alert
      return this.props.showAlert(noSavedDataMsg, 'error');
    };

    // Ask if sure
    if (!window.confirm(confirmMsg)) return e.preventDefault();

    // Request
    await axios
      .delete(`${api.PRODUCTS}/${this.state.id}`)
      .catch(err => err)
  }

  // ==================>                             <================== //
  //                         Handle preview img
  // ==================>                             <================== //

  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // Get global prop from lang
    const { global } = this.props.lang.constants;

    // Show error alert if file type is not image
    if (file && file.type.indexOf('image') === -1)
    return this.props.showAlert(global.onlyImgsMsg, 'error');

    // Show error alert if jile size more than global.fileSize
    if (file && file.size > global.fileSize)
    return this.props.showAlert(global.fileTooBigMsg, 'error');

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({img: reader.result})

    // Put reader.result into file
    file ? reader.readAsDataURL(file) : this.setState({img: defaultImg})
  }

  // ==================>                             <================== //
  //                 Lifecycle hook (just before render)
  // ==================>                             <================== //

  componentDidMount() {
    this.getCategories();
    this.getDish();
    this.getProducts();
  }

  // ==================>                             <================== //
  //                         Get data categories
  // ==================>                             <================== //

  getCategories() {
    return axios
      .get(api.PRODUCTS_CATEGORIES)
      .then(res => {
        // Map all categories to leave only useful fields
        const categories = res.data.map(item => ({ title: item.title, id: item._id }));

        // Default sorting from a -> b
        categories.sort((a, b) => a.title.localeCompare(b.title));

        // Update State
        this.setState({
          categories,
          category: categories.length
            ? categories[0].title
            : this.props.lang.constants.product.defaultCategory
        });
      })
      .catch(err => err);
  }

  // ==================>                             <================== //
  //                     Get dish by title (link)
  // ==================>                             <================== //

  async getDish() {
    // Get router props
    const { match, history } = this.props;

    // In purpose to get first field (field could be changed in future)
    const field = Object.keys(match.params)[0];

    // Define current dish link
    const prodLink = match.params[field];

    // Try to get existing dish
    const dish = await axios
      .get(`${api.PRODUCTS}/${prodLink}`)
      .then(res => res.data)
      .catch(err => err);

    // Redirect if not found page
    if (!dish) {
      // If it equals 'new-item' (which is default for new item) -> just stop
      // Else -> redirect to Not Found
      return (prodLink === 'new-item') ? null : history.push(routes.NOT_FOUND)
    };

    // Get dish variables
    const {
      title, link, _id, img, amount, price, proteins,
      fats, carbs, ccal, ccalUnified, category
    } = dish;

    // Update state
    this.setState({
      title, link, id: _id, amount, price, proteins, fats, carbs, ccal,
      category, ccalUnified, img: new Buffer(img.data).toString()
    });
  }

  // ==================>                             <================== //
  //                        Get products request
  // ==================>                             <================== //

  getProducts = () => {
    return axios
      .get(api.PRODUCTS)
      .then(res => {
        // Map all products to leave only useful fields
        const products = res.data.map(item => ({
          title: item.title,
          id: item._id,
          ccal: item.ccalUnified,
          proteins: item.proteins,
          carbs: item.carbs,
          fats: item.fats,
          unit: item.unit,
          amount: item.amount
        }));

        // Default sorting by title
        products.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        console.log('=====> products', products);
        console.log('=====> res.data', res.data);

        // Update State
        this.setState({
          products,
          product: products.length
            ? products[0]
            : this.props.lang.constants.product.defaultCategory
        });
      })
      .catch(err => err);
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    return (
      <Wrapper addClass='Dish'
        header={this.state.title
          ? this.state.title
          : this.props.lang.constants.product.header}
        >

        <div className='Dish-Info'>
          <h2>
            {this.state.title ? this.state.title : this.props.lang.constants.product.header}
          </h2>

          <form className='Form'>
            <Img
              lang={this.props.lang.constants.product}
              src={this.state.img}
              alt={this.state.title}
              onPreviewImg={this.handlePreviewImg} />
            <Data
              lang={this.props.lang.constants.product}
              currency={this.props.userProfile.currency}
              title={this.state.title}
              link={this.state.link}
              inputsValues={{
                'title': this.state.title
              }}
              disabledValues={{
                'price': this.state.price,
                'proteins': this.state.proteins,
                'fats': this.state.fats,
                'carbs': this.state.carbs,
                'ccal': this.state.ccal,
                'amount': this.state.amount
              }}
              category={this.state.category}
              categoriesOptions={this.state.categories}
              onChange={this.handleChangeCcal}
              onInputChange={this.handleChange}
              onSave={this.handleSave}
              onDelete={this.handleDelete}
            />
          </form>
        </div>

        <Products
          addProduct={
            <Product
              products={this.state.products}
              product={this.state.product}
              onInputChange={this.handleChange}
            />}
         />

        {/* <UsedIn lang={this.props.lang.constants.product} /> */}
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Img
/* ------------------------------------------------------------------- */

const Img = ({ src, alt, lang, onPreviewImg }) => (
  <div className='Dish-Img'>
    <img src={src} alt={alt} />
    <label htmlFor='uploadImg'>{lang.imgUpload}</label>
    <input type='file' id='uploadImg' onChange={onPreviewImg} />
  </div>
);

/* ------------------------------------------------------------------- */
/*                               Data
/* ------------------------------------------------------------------- */

class Data extends Component {
  constructor(props) {
    super(props);

    // =====> Config for categories select
    this.categoriesSelect =  {
      label: this.props.lang.categoryLabel,
      id: 'category'
    }

    // =====> Config for units select
    this.unitsSelect = {
      label: this.props.lang.unitLabel,
      id: 'unit'
    }

    // =====> Config for inputs
    this.inputs = [
      {
        type: 'text',
        id: 'title',
        label: this.props.lang.titleLabel,
        placeholder: this.props.lang.titlePholder,
      }
    ];

    // =====> Config for disabled inputs
    this.disabledInputs = [
      {
        type: 'number',
        id: 'price',
        label: this.props.lang.priceLabel + ', ' + this.props.currency,
        placeholder: this.props.lang.pricePholder + ', ' + this.props.currency,
        disabled: true
      },
      {
        type: 'number',
        id: 'proteins',
        label: this.props.lang.proteinsLabel,
        placeholder: this.props.lang.proteinsPholder,
        disabled: true
      },
      {
        type: 'number',
        id: 'fats',
        label: this.props.lang.fatsLabel,
        placeholder: this.props.lang.fatsPholder,
        disabled: true
      },
      {
        type: 'number',
        id: 'carbs',
        label: this.props.lang.carbsLabel,
        placeholder: this.props.lang.carbsPholder,
        disabled: true
      },
      {
        type: 'text',
        id: 'ccal',
        label: this.props.lang.caloriesLabel,
        placeholder: this.props.lang.caloriesLabel,
        disabled: true
      },
      {
        type: 'text',
        id: 'amount',
        label: 'Вес',
        placeholder: 'Вес',
        disabled: true
      }
    ];
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    // Get this.props variables
    const { inputsValues, onInputChange, category, categoriesOptions,
    onDelete, onSave, link, disabledValues } = this.props;

    return (
      <div className='Dish-Data'>
        <Inputs data={this.inputs} values={inputsValues}
        onChange={onInputChange} />

        <Select config={this.categoriesSelect} value={category}
        options={categoriesOptions} onChange={onInputChange} />

        <h2>Вес, цена и нутриенты блюда</h2>

        <Inputs data={this.disabledInputs} values={disabledValues} />

        <div className='Form-Rows'>
          <SubmitLink link={routes.PRODUCTS}
            value={this.props.lang.deleteBtn} onClick={onDelete} />
          <SubmitLink link={`${routes.PRODUCTS}/${link}`}
            value={this.props.lang.saveBtn} onClick={onSave} />
        </div>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Products
/* ------------------------------------------------------------------- */

class Products extends Component {
  render() {
    return (
      <div className='Dish-Products'>
        <h2> Products </h2>
        {this.props.addProduct}
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Add product
/* ------------------------------------------------------------------- */

const Product = ({ products, product, onInputChange }) => {
  const unitsWithPc = [
    { "title": "gr", "id": 3 },
    { "title": "kg", "id": 2 },
    { "title": "PC (-es)", "id": 1 }
  ];
  const unitsWithoutPc = [ { "title": "gr", "id": 3 }, { "title": "kg", "id": 2 } ];

  // Define which units to use
  const units = product.title && +product.unit.id === 1
    ? unitsWithPc
    : unitsWithoutPc;

  return (
    <form className='Form'>
      <Select
        config={{ id: 'product' }}
        value={product.title}
        options={products}
        onChange={onInputChange}
      />

      <Input type='number' id='prodAmount' value='123' onChange={onInputChange} />

      <Select
        config={{ id: 'unit' }}
        value={units[0].title}
        options={units}
        onChange={onInputChange}
      />
    </form>
  )
};

/* ------------------------------------------------------------------- */
/*                   Provide router props & Export
/* ------------------------------------------------------------------- */

export default withAlert(withRouter(withLang(withUser(Dish))));


//
