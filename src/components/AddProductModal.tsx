import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography, SelectChangeEvent } from '@mui/material';
import { Product } from '../models/Product';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  productToEdit: Product | null; 
  categories: string[];  
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onAddProduct, productToEdit, categories }) => {
  const [product, setProduct] = useState<Product>({
    codigo: '',
    descripcion: '',
    categoria: categories.length > 0 ? categories[0] : '',
    precioCosto: Number(0),
    precioVenta: Number(0),
    stock: Number(0),
    utilidad: Number(0)
  });

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({
        codigo: '',
        descripcion: '',
        categoria: categories.length > 0 ? categories[0] : '',
        precioCosto: Number(0),
        precioVenta: Number(0),
        stock: Number(0),
        utilidad: Number(0)
      });
    }
  }, [productToEdit, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'precioCosto' || name === 'precioVenta' || name === 'stock') {
      setProduct({
        ...product,
        [name]: Number(value), // Asegurar que sea número
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, categoria: e.target.value });
  };

  const handleSubmit = () => {
    const productWithNumberFields: Product = {
      ...product,
      precioCosto: Number(product.precioCosto), // Aseguramos que sea número
      precioVenta: Number(product.precioVenta), // Aseguramos que sea número
      stock: Number(product.stock),             // Aseguramos que sea número
    };

    onAddProduct(productWithNumberFields); // Aquí se pasa el producto con los campos numéricos corregidos
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        padding: 4,
        backgroundColor: 'white',
        margin: '100px auto',
        maxWidth: 500,
        borderRadius: 2,
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
          {productToEdit ? "Editar Producto" : "Agregar Producto"}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid>
            <TextField
              label="Código"
              name="codigo"
              value={product.codigo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoría</InputLabel>
              <Select value={product.categoria} onChange={handleCategoryChange}>
                {categories.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              label="Descripción"
              name="descripcion"
              value={product.descripcion}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid>
            <TextField
              label="Precio Costo"
              name="precioCosto"
              type="number"
              value={product.precioCosto}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{
                min: 0,
                step: 0.01
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Precio Venta"
              name="precioVenta"
              type="number"
              value={product.precioVenta}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{
                min: 0,
                step: 0.01
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{
                min: 0
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancelar
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ minWidth: 120 }}
            >
              {productToEdit ? "Guardar Cambios" : "Agregar Producto"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
