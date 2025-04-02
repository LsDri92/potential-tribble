import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SearchProduct } from './components/SearchProduct';
import { ProductList } from './components/ProductList';
import Cart from './components/Cart';
import { Layout } from './components/Layout';
import { useDispatch } from 'react-redux';
import { loadProducts } from './store/productSlice';
import { AppDispatch } from './store/store';
// import { Box } from '@mui/material';


const App: React.FC = () => {
  const dispatch =  useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);
  return (

    <Router>
      <Routes>
        {/* Rutas envueltas en el Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchProduct />} />
          <Route path="/buscar" element={<SearchProduct />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
    // </Box>
  );
};

export default App;
