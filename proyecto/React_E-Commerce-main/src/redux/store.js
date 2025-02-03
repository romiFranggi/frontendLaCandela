import {configureStore} from '@reduxjs/toolkit';
import rootReducers from './reducer';

const store = configureStore({
    reducer: rootReducers,
})

store.subscribe(() => {
    const cart = store.getState().handleCart;
    localStorage.setItem("cart", JSON.stringify(cart));
  });

export default store;
