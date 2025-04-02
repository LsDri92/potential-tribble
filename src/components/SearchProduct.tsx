import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TableHead,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { AppDispatch, RootState } from '../store/store';
import { Product } from '../models/Product';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const SearchProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const products = useSelector((state: RootState) => state.products.products);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.codigo.includes(searchTerm) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
    }
    setOpen(false);
  };

  return (
    <Container>
      <TextField
        label="Buscar Producto por Código o Descripción"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Descripción</TableCell>
            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Precio Venta</TableCell>
            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchTerm && filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: 'center' }}>No se encontró ningún producto</TableCell>
            </TableRow>
          ) : filteredProducts.map(product => (
            <TableRow key={product.codigo}>
              <TableCell>{product.descripcion}</TableCell>
              <TableCell style={{ backgroundColor: '#ADD8E6', textAlign: 'center' }}>{product.precioVenta}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <IconButton color="primary" onClick={() => handleAddToCart(product)}>
                  <ShoppingCartIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Agregar al Carrito</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas agregar el producto {selectedProduct?.descripcion} al carrito?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={confirmAddToCart} color="primary" autoFocus>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};