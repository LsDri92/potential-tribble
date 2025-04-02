import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Thunk para cargar categorías desde el archivo JSON
export const loadCategories = createAsyncThunk('categories/load', async () => {
  const categories = await window.electron.readCategories(); // Función IPC para leer el archivo
  return categories;
});

// Thunk para guardar categorías en el archivo JSON
export const saveCategories = createAsyncThunk('categories/save', async (categories: string[]) => {
  await window.electron.writeCategories(categories); // Función IPC para escribir el archivo
  return categories;
});

interface CategoryState {
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CategoryState = {
  categories: [],
  status: 'idle',
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<string>) {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    editCategory(state, action: PayloadAction<{ oldCategory: string, newCategory: string }>) {
      const { oldCategory, newCategory } = action.payload;
      state.categories = state.categories.map(category =>
        category === oldCategory ? newCategory : category
      );
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(category => category !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload; // Cargar las categorías
      })
      .addCase(loadCategories.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(saveCategories.fulfilled, (state, action) => {
        state.categories = action.payload; // Actualizar las categorías después de guardar
      });
  },
});

export const { addCategory, editCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
