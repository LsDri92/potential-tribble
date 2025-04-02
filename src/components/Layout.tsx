import React from 'react';
import logo from '../assets/logo.png';
import { AppBar, Toolbar, Box, Tabs, Tab, Container, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { APPCOLORS } from '../utils/Constants';


const tabRoutes = ['/buscar', '/productos', '/cart'];

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Determina el índice de la pestaña en función de la ruta actual
  const currentTab = tabRoutes.indexOf(location.pathname);
  const tabIndex = currentTab === -1 ? 0 : currentTab;

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    navigate(tabRoutes[newIndex]);
  };

  return (
    <>
      {/* AppBar en toda la aplicación */}
      <AppBar position="fixed" sx={{ backgroundColor: APPCOLORS.headertablecolor, top: 0, left: 0, right: 0 }}>
        <Toolbar>
          <Box alignSelf="start" width="100%" display="flex" justifyContent="flex-start">
            <img 
              src={logo} 
              alt="Logo" 
              style={{ height: isMobile ? '80px' : '150px', transition: 'height 0.3s ease' }}
            />
          </Box>
        </Toolbar>
        {/* Tabs pegadas al AppBar, scrollable en móviles */}
        <Tabs 
          value={tabIndex} 
          onChange={handleChange} 
          variant={isMobile ? "scrollable" : "fullWidth"} 
          scrollButtons={isMobile ? "auto" : false} 
          centered={!isMobile ? true : false}
          sx={{ backgroundColor: "white" }}
        >
          <Tab label="Buscar" />
          <Tab label="Productos" />
          <Tab label="Ventas"  disabled={true}/>
        </Tabs>
      </AppBar>

      {/* Espaciado ajustado para que el contenido empiece pegado a las Tabs */}
      <Box mt={isMobile ? -14 : -20}>
        <Container>
          <Outlet /> {/* Se renderizará el contenido de la ruta actual */}
        </Container>
      </Box>
    </>
  );
};

export default Layout;
