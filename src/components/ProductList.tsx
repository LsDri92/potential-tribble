import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Modal,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { CategoryManager } from './AddCategoriaModal';
import { RootState, AppDispatch } from '../store/store';
import { loadProducts, addProduct, updateProduct, deleteProduct } from '../store/productSlice';
import { loadCategories } from '../store/categorySlice';
import { Product } from '../models/Product';
import { ApplyPercentageIncrease } from './ApplyPercentageIncrease';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { APPCOLORS } from '../utils/Constants';
import { AddProductModal } from './AddProductModal';

export const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openPercentageModal, setOpenPercentageModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadCategories());
  }, [dispatch]);

  const handleAddProduct = (newProduct: Product) => {
    if (editingProduct) {
      dispatch(updateProduct(newProduct));
    } else {
      dispatch(addProduct(newProduct));
    }
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setOpenProductModal(true);
  };

  const handleDeleteProduct = (codigo: string) => {
    dispatch(deleteProduct(codigo));
  };

  const handleApplyIncrease = (category: string, percentage: number, operation: 'increase' | 'decrease') => {
    const updatedProducts = products.map((product: Product) =>
      product.categoria === category
        ? { ...product, precioVenta: Math.round((product.precioVenta * (operation === 'increase' ? 1 + percentage / 100 : 1 - percentage / 100)) * 100) / 100 }
        : product
    );
    updatedProducts.forEach(product => dispatch(updateProduct(product)));
  };

  const tableHeaders = useMemo(() => ['Código', 'Descripción', 'Categoría', 'Precio Costo', 'Precio Venta', 'Stock', 'Utilidad', 'Acciones'], []);

  return (
    <Container sx={{ maxWidth: '100%', padding: 0 }}>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} my={2}>
        <Button variant="contained" sx={{ width: isMobile ? '100%' : 150, height: 50, fontWeight: 'bold', backgroundColor: APPCOLORS.buttonsColor, '&:hover': { backgroundColor: APPCOLORS.hoverButtonsColor } }} onClick={() => setOpenProductModal(true)}>
          Agregar Producto
        </Button>
        <Button variant="contained" sx={{ width: isMobile ? '100%' : 150, height: 50, fontWeight: 'bold', backgroundColor: APPCOLORS.buttonsColor, '&:hover': { backgroundColor: APPCOLORS.hoverButtonsColor } }} onClick={() => setOpenCategoryModal(true)}>
          Administrar Categorías
        </Button>
        <Button variant="contained" sx={{ width: isMobile ? '100%' : 250, height: 50, fontWeight: 'bold', backgroundColor: APPCOLORS.buttonsColor, '&:hover': { backgroundColor: APPCOLORS.hoverButtonsColor } }} onClick={() => setOpenPercentageModal(true)}>
          Aumentar Precios por Categoría
        </Button>
      </Box>
      <Table sx={{ borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
        <TableHead>
          <TableRow>
            {tableHeaders.map(header => (
              <TableCell key={header} sx={{ backgroundColor: APPCOLORS.headertablecolor, fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.codigo} sx={{ borderBottom: '1px solid #eee' }}>
              {[product.codigo, product.descripcion, product.categoria, product.precioCosto, product.precioVenta, product.stock, (product.precioVenta - product.precioCosto).toFixed(2)].map((value, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>{value}</TableCell>
              ))}
              <TableCell style={{ textAlign: 'center' }}>
                <IconButton onClick={() => handleEditProduct(product)} color="info">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteProduct(product.codigo)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddProductModal open={openProductModal} onClose={() => setOpenProductModal(false)} onAddProduct={handleAddProduct} productToEdit={editingProduct} categories={categories} />
      <Modal open={openCategoryModal} onClose={() => setOpenCategoryModal(false)}>
        <Box sx={{ width: isMobile ? '90%' : 400, margin: '100px auto', backgroundColor: APPCOLORS.modalBackground, padding: '20px', borderRadius: '8px' }}>
          <CategoryManager />
        </Box>
      </Modal>
      <ApplyPercentageIncrease open={openPercentageModal} onClose={() => setOpenPercentageModal(false)} categories={categories} onApply={handleApplyIncrease} />
    </Container>
  );
};