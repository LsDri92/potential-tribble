import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { APPCOLORS } from '../utils/Constants';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate('/')} // Puedes cambiar la ruta según lo necesites
      sx={{
        position: 'fixed',
        top: 50,
        left: 30,
        scale: 1.5,
        backgroundColor: APPCOLORS.backbuttonColor,
        color: 'white', // Ajusta el color del ícono si es necesario
        '&:hover': {
          backgroundColor: APPCOLORS.hoverButtonsColor, // Color al pasar el mouse
        }
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
