import { generateConstants } from '../redux/utils';
import * as loaders from '../utils/intl-loader';

const t = generateConstants([
  'LOCALE_INITIALIZE',
  'LOCALE_CHANGE(ASYNC)'
]);

const initialState = { messages: {}, locale: 'en' };

export default function reducer(state = initialState, action) {
  const { type, result, locale, messages } = action;

  switch (type) {
    case t.LOCALE_CHANGE:
      return { ...state, loading: true };

    case t.LOCALE_CHANGE_SUCCESS:
      return { messages: result, locale, loading: false };

    case t.LOCALE_CHANGE_FAIL:
      const { error } = result;
      return { ...state, loading: false, error };

    case t.LOCALE_INITIALIZE:
      return { messages, locale };

    default:
      return state;
  }
}

export function change(locale = 'en') {
  return ({
    types: [t.LOCALE_CHANGE, t.LOCALE_CHANGE_SUCCESS, t.LOCALE_CHANGE_FAIL],
    promise: loaders[locale],
    locale
  });
}

export function initialize(locale, messages) {
  return { type: t.LOCALE_INITIALIZE, locale, messages };
}
