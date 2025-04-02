import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Container, IconButton, List, ListItem, ListItemText, Box, Typography, Divider, Paper, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addCategory, editCategory, deleteCategory, loadCategories, saveCategories } from '../store/categorySlice';

export const CategoryManager: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar categorías cuando el componente se monta
  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  // Función para agregar o editar una categoría
  const handleAddOrEditCategory = () => {
    if (newCategory.trim()) {
      if (editingCategory) {
        dispatch(editCategory({ oldCategory: editingCategory, newCategory }));
        setSuccessMessage(`Categoría "${editingCategory}" actualizada con éxito.`);
      } else {
        dispatch(addCategory(newCategory));
        setSuccessMessage(`Categoría "${newCategory}" agregada con éxito.`);
      }
      // Guardar categorías después de la operación
      dispatch(saveCategories([...categories, newCategory]));
      setNewCategory('');
      setEditingCategory(null); // Reiniciar el campo de edición
    }
  };

  // Función para activar la edición de una categoría
  const handleEditClick = (category: string) => {
    setEditingCategory(category);
    setNewCategory(category);
    setSuccessMessage(null); // Limpiar el mensaje de éxito cuando se comienza a editar
  };

  // Función para borrar una categoría
  const handleDeleteClick = (category: string) => {
    dispatch(deleteCategory(category));
    // Guardar categorías después de borrar
    dispatch(saveCategories(categories.filter((cat) => cat !== category)));
    setSuccessMessage(`Categoría "${category}" eliminada con éxito.`);
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        marginTop: { xs: 3, sm: 5 }, 
        padding: { xs: 1, sm: 2 },
        borderRadius: '12px',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 2, sm: 3 }, 
          borderRadius: '12px',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Administrar Categorías
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />

        {/* Mostrar mensaje de éxito si existe */}
        {successMessage && <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}

        {/* Campo para agregar o editar categoría */}
        <Box 
          display="flex" 
          mb={2}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            fullWidth
            label={editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrEditCategory}
            sx={{ 
              marginTop: { xs: 2, sm: 0 }, 
              marginLeft: { sm: 2 },
              borderRadius: '8px',
              height: { sm: '56px' }, // Mantén la altura en pantallas más grandes
            }}
          >
            {editingCategory ? 'Guardar' : 'Agregar'}
          </Button>
        </Box>

        <Divider sx={{ marginBottom: 3 }} />

        {/* Lista de categorías existentes en un contenedor con scroll */}
        <Typography variant="h6" gutterBottom>
          Categorías Existentes
        </Typography>
        <Box 
          sx={{
            maxHeight: 200,  // Limita la altura del scroll box a unos 3 elementos
            overflowY: 'auto', // Habilita el scroll vertical
            padding: '0 16px', // Añade padding lateral
            border: '1px solid #ddd', // Opcional: añade un borde alrededor de la lista
            borderRadius: '8px'
          }}
        >
          <List>
            {categories.map((category) => (
              <ListItem
                key={category}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: { xs: '8px 0', sm: '10px 0' },
                  borderBottom: '1px solid #ddd',
                }}
              >
                <ListItemText primary={category} />
                <Box>
                  <IconButton
                    onClick={() => handleEditClick(category)}
                    color="info"
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(category)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};
