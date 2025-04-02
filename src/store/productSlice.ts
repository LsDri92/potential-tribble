import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { saveToIndexedDB, loadFromIndexedDB } from '../utils/indexedDB';

// Thunk para cargar productos desde IndexedDB
export const loadProducts = createAsyncThunk('products/load', async () => {
    return await loadFromIndexedDB();
});

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
            saveToIndexedDB([...state.products]); // Evita referencia mutada
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.codigo === action.payload.codigo);
            if (index !== -1) {
                state.products[index] = action.payload;
                saveToIndexedDB([...state.products]); // Evita referencia mutada
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.codigo !== action.payload);
            saveToIndexedDB([...state.products]); // Evita referencia mutada
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        });
    },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
