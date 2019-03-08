import React, { Component } from 'react';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Api
import * as api from '../../config/api';

// =====> Lang
import { withLang } from '../../config/lang';

/* ------------------------------------------------------------------- */
/*                            My components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';
import List from '../../components/ListFilter';
import Modal from '../../components/Modal';
import withAlert from '../../components/Alert';
import ListOfItems from '../../components/ListOfItems';
import { capitalize } from '../../components/UsefulF';

/* ------------------------------------------------------------------- */
/*                               Products
/* ------------------------------------------------------------------- */

class Products extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      isOpen: false,
      catTitle: '',
      catImg: '',
      catImgTitle: this.props.lang.constants.products.catImgTitle,
      categories: [],
      products: [],
    };
  }

  // ==================>                             <================== //
  //                  Handle open/close Modal component
  // ==================>                             <================== //

  handleOpenModal = (e) => {
    // Close onClick at btn or out of modal inner
    if (e.target.closest('.Modal-Close') || !e.target.closest('.Modal-Inner'))
    this.setState(state => ({isOpen: !state.isOpen}))
  }

  // ==================>                             <================== //
  //                     Handle click on add button
  // ==================>                             <================== //

  handleAddItem = async (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Receive data from State
    const { catTitle, catImg } = this.state;

    // Get products prop from lang
    const { products } = this.props.lang.constants;

    // Stop running & show error message if there is no text
    if (this.state.catTitle === '')
    return this.props.showAlert(products.addEmptyCatTitleMsg, 'error');

    // Save & send new category
    await axios
      .post(api.PRODUCTS_CATEGORIES, { img: catImg, title: capitalize(catTitle) })
      .then(res => this.props.showAlert(products.addCategoryMsg, 'success'))
      .catch(err => this.props.showAlert(products.existMsg, 'error'));

    // Reset input value
    this.setState({ catTitle: '', catImg: '', catImgTitle: products.catImgTitle });

    // Request new categories
    await this.getCategories()
  }

  // ==================>                             <================== //
  //                         Handle preview img
  // ==================>                             <================== //

  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // Get global prop from lang
    const { global } = this.props.lang.constants;

    // =====> Error: file type is not image
    if (file && file.type.indexOf('image') === -1)
    return this.props.showAlert(global.onlyImgsMsg, 'error');

    // =====> Error: jile size is more than global.fileSize
    if (file && file.size > global.fileSize)
    return this.props.showAlert(global.fileTooBigMsg, 'error');

    // Change label value of file input
    if (file) this.setState({catImgTitle: file.name});

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({catImg: reader.result});

    // Put reader.result into file
    if (file) reader.readAsDataURL(file);
  }

  // ==================>                             <================== //
  //                     Handle click on remove btn
  // ==================>                             <================== //

  handleRemoveItem = async (e) => {
    // Define clicked category: id, label text, value of assotiated input
    this.id = e.target.htmlFor;
    this.rename = e.target.getAttribute('type');
    this.inputValue = document.getElementById(this.id).value;

    // Find category title by id
    const { categories } = this.state;
    this.title = capitalize(categories.find(item => item.id === this.id).title);

    // Get products prop from lang
    const { products } = this.props.lang.constants;

    // =====> Ask if sure & stop running if not sure
    if (!window.confirm(products.confirmMsg)) return;

    // Check if there any products using this category
    // If they are -> save into array
    this.existProducts = await axios
      .get(api.PRODUCTS, { params: { category: this.title } })
      .then(res => res.data)
      .catch(err => err);

    // =====> Error: Can't rename into empty string
    if (this.rename.toLowerCase() === 'rename' && this.inputValue === '')
    return this.props.showAlert(products.renameEmptyCatTitleMsg, 'error');

    // If btn value is 'rename' & input Value !== initial title
    // Then -> PUT request to change category title
    // Also if there are any products in this category
    // Then -> PUT request to change their category title
    if (await this.handleRenameItem()) return;

    // If there are products in category -> decline DELETE
    if (this.existProducts.length > 0)
    return this.props.showAlert(products.notEmptyCategoryMsg, 'error');

    await axios
      .delete(`${api.PRODUCTS_CATEGORIES}/${this.id}`)
      .then(res => this.props.showAlert(products.deleteCategoryMsg, 'success'))
      .catch(err => err);

    // Request & update categories
    await this.getCategories();
  }

  // ==================>                             <================== //
  //                       Handle rename category
  // ==================>                             <================== //

  handleRenameItem = async () => {
    if (this.rename.toLowerCase() === 'rename' && this.inputValue !== this.title) {
      // Get products prop from lang
      const { products } = this.props.lang.constants;

      await axios
        .put(`${api.PRODUCTS_CATEGORIES}/${this.id}`, { title: capitalize(this.inputValue) })
        .then(async res => {
          // Show success message
          this.props.showAlert(products.updateCategoryMsg, 'success');

          // If there are any matching products
          // Then -> PUT new category title into matching products
          if (this.existProducts.length > 0) {
            await this.existProducts.forEach( async item => {

              await axios
                .put(`${api.PRODUCTS}/${item._id}`, { category: capitalize(this.inputValue) })
                .catch(err => err);

            });
          };

          // Request again updated categories and products
          this.getCategories();
          this.getProducts();
        })
        .catch(err => this.props.showAlert(products.existMsg, 'error'));

      // Return true value -> to stop running DELETE func further
      return true
    };

    // Return false value -> to proceed DELETE func
    return false;
  }

  // ==================>                             <================== //
  //                 Handle catTitle input value changes
  // ==================>                             <================== //

  handleCatTitleChange = (e) => this.setState({ catTitle: capitalize(e.target.value) })

  // ==================>                             <================== //
  //                 Lifecycle hook (just before render)
  // ==================>                             <================== //

  componentDidMount() {
    // Get all categories before first render
    this.getCategories();
    this.getProducts();
  }

  // ==================>                             <================== //
  //                       Get categories request
  // ==================>                             <================== //

  getCategories = () => {
    return axios
      .get(api.PRODUCTS_CATEGORIES)
      .then(res => {
        const categories = res.data.map(item => ({
          title: item.title,
          img: new Buffer(item.img.data).toString(),
          id: item._id
        }));

        // Default sorting from a -> b
        categories.sort((a, b) => a.title.localeCompare(b.title));

        // Update State
        this.setState({categories})
      })
      .catch(err => err);
  }

  // ==================>                             <================== //
  //                        Get products request
  // ==================>                             <================== //

  getProducts = () => {
    // Requesting data from server. Header 'data' specifies filename
    return axios
      .get(api.PRODUCTS)
      .then(products => {
        // Default sorting by title
        products.data.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        // Update State
        this.setState({products: products.data})
      })
      .catch(err => err);
  }

  // ==================>                             <================== //
  //                                Render
  // ==================>                             <================== //

  render() {
    // Get products prop from lang
    const { products } = this.props.lang.constants;

    const { listHeaders } = products;

    return (
      <Wrapper addClass='Products' header={products.header}>
        <List
          headers={[
            { colS: 2, type: 'string', filter: 'title', value: listHeaders.title.value, span: listHeaders.title.span },
            { type: 'number', filter: 'ccalUnified', value: listHeaders.ccal.value, span: listHeaders.ccal.span },
            { type: 'number', filter: 'proteins', value: listHeaders.proteins.value, span: listHeaders.proteins.span },
            { type: 'number', filter: 'fats', value: listHeaders.fats.value, span: listHeaders.fats.span },
            { type: 'number', filter: 'carbs', value: listHeaders.carbs.value, span: listHeaders.carbs.span },
            { type: 'string', filter: 'category', value: listHeaders.category.value, span: listHeaders.category.span },
          ]}
          lang={products}
          onModalOpen={this.handleOpenModal}
          categories={this.state.categories}
          items={this.state.products}
        />
        <Modal isOpen={this.state.isOpen} onClick={this.handleOpenModal}>
          <ListOfItems
            lang={products}
            inputs={[
              {
                type: 'text',
                id: 'catTitle',
                placeholder: products.catTitle,
                onChange: this.handleCatTitleChange.bind(this),
              }
            ]}
            inputsValues={{
              catTitle: this.state.catTitle
            }}
            img={this.state.catImgTitle}
            items={this.state.categories}
            onAdd={this.handleAddItem}
            onRemove={this.handleRemoveItem}
            onChange={this.handleCatTitleChange}
            onPreviewImg={this.handlePreviewImg}
          />
        </Modal>
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                   Provide authUser prop & Export
/* ------------------------------------------------------------------- */

// export default (withUser(withLang(Products)))
export default withAlert(withLang(Products))


//
