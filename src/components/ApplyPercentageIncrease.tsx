import React, { useState } from 'react';
import { Button, Modal, Box, TextField, MenuItem, Select, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface ApplyPercentageIncreaseProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  onApply: (category: string, percentage: number, operation: 'increase' | 'decrease') => void;
}

export const ApplyPercentageIncrease: React.FC<ApplyPercentageIncreaseProps> = ({
  open,
  onClose,
  categories,
  onApply,
}) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [operation, setOperation] = useState<'increase' | 'decrease'>('increase'); // Nueva opción para aumentar o reducir

  const handleApplyIncrease = () => {
    if (selectedCategory && percentage !== 0) {
      onApply(selectedCategory, percentage, operation);
      onClose(); // Cerrar el modal
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <h2>{operation === 'increase' ? 'Aumentar' : 'Reducir'} precios por categoría</h2>

        {/* Selección de categoría */}
        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as string)}
            label="Categoría"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selección de aumento o reducción */}
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'increase' | 'decrease')}
          >
            <FormControlLabel value="increase" control={<Radio />} label="Aumentar" />
            <FormControlLabel value="decrease" control={<Radio />} label="Reducir" />
          </RadioGroup>
        </FormControl>

        {/* Campo para el porcentaje */}
        <TextField
          label="Porcentaje (%)"
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
        />

        {/* Botón para aplicar el cambio */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleApplyIncrease}
          disabled={!selectedCategory || percentage === 0}
        >
          {operation === 'increase' ? 'Aplicar Aumento' : 'Aplicar Reducción'}
        </Button>
      </Box>
    </Modal>
  );
};
