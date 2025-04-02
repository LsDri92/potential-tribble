import React from 'react';
import { Button, Container, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { APPCOLORS } from '../utils/Constants';

export const MainScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Container maxWidth="sm">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {[{ label: "Buscador de Artículos", icon: <SearchIcon />, path: "/buscar" },
            { label: "Lista de Productos", icon: <ListIcon />, path: "/productos" },
            { label: "Venta", icon: <ShoppingCartIcon />, path: "/cart" }].map((button, index) => (
            <Grid key={index} display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => navigate(button.path)}
                sx={{ 
                  width: 180, 
                  height: 100,  
                  fontWeight: 'bold', 
                  backgroundColor: APPCOLORS.buttonsColor, 
                  borderRadius: '16px',
                  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
                  '&:hover': { 
                    backgroundColor: APPCOLORS.hoverButtonsColor,
                    boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
                  }
                }}
                startIcon={button.icon}
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
