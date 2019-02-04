import * as routes from './routes';

const api = '/api';

export const HOME = api + routes.HOME;
export const LOGIN = api + routes.LOGIN;
export const REGISTER = api + routes.REGISTER;
export const PROFILE = api + routes.PROFILE;
export const DASHBOARD = api + routes.DASHBOARD;
export const MENU = api + routes.MENU;
export const DISHES = api + routes.DISHES;
export const DISHES_CATEGORIES = api + '/dishesCategories';
export const PRODUCTS = api + routes.PRODUCTS;
export const PRODUCTS_CATEGORIES = api + '/productsCategories';

// import {
//   HOME as home,
//   LOGIN as login,
//   PROFILE as profile,
//   DASHBOARD as dashboard,
//   MENU as menu,
//   DISHES as dishes,
//   PRODUCTS as products
// } from './routes';
//
// const api = '/api';
//
// export const HOME = api + home;
// export const LOGIN = api + login;
// export const PROFILE = api + profile;
// export const DASHBOARD = api + DASHBOARD;
// export const MENU = api + menu;
// export const DISHES = api + dishes;
// export const DISHES_CATEGORIES = api + '/dishesCategories';
// export const PRODUCTS = api + products;
// export const PRODUCTS_CATEGORIES = api + '/productsCategories';
// export const CATEGORIES = '/categories';
