import {combineReducers} from 'redux';

import {CHOOSE_CURRENCY, CurrencyValues} from '../actions';
const {EUR} = CurrencyValues;

function currencyValue(state = EUR, action) {
  switch (action.type) {
    case CHOOSE_CURRENCY:
      return action.value

    default:
      return state
  }
};

// export default function myApp(state = {}, action) {
//   return {
//     currencyValue: currencyValue(state.currencyValue, action)
//   }
// };

const myApp = combineReducers({
  currencyValue
});

export default myApp



// function myApp(state = initialState, action) {
//   switch (action.type) {
//
//     case CHOOSE_CURRENCY:
//       return Object.assign({}, state, {
//         currency: action.value
//       })
//
//       default:
//         return state
//   }
// }
