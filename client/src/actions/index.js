export const CHOOSE_CURRENCY = 'CHOOSE_CURRENCY';

export const CurrencyValues = {
  USD: 'USD',
  EUR: 'EUR',
  UAH: 'UAH'
};

export function chooseCurrency(value) {
  return {
    type: CHOOSE_CURRENCY,
    value
  }
};

// export const boundChooseCurrency = value => dispatch(chooseCurrency(value));
