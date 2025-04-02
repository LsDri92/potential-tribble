import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../models/Product';

export interface Transaction {
  id: string;
  items: Product[];
  total: number;
  date: string;
}

interface CartState {
  items: Product[];
  transactions: Transaction[]; // Agregamos una nueva propiedad para transacciones
}

const initialState: CartState = {
  items: [],
  transactions: [], // Inicialmente vacío
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const productInCart = state.items.find((item) => item.codigo === action.payload.codigo);
      if (productInCart) {
        productInCart.stock += 1;
      } else {
        state.items.push({ ...action.payload, stock: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.codigo !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, addTransaction } = cartSlice.actions;
export default cartSlice.reducer;