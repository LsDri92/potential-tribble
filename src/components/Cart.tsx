import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, TextField, Typography, Box, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { RootState } from '../store/store';
import { addToCart, removeFromCart, clearCart, Transaction, addTransaction } from '../store/cartSlice';
import { Product } from '../models/Product';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const transactions = useSelector((state: RootState) => state.cart.transactions);
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAdd = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleRemove = (codigo: string) => {
    dispatch(removeFromCart(codigo));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCompleteTransaction = () => {
    const total = calculateTotal();
    const newTransaction: Transaction = {
      id: new Date().getTime().toString(),
      items: [...cartItems],
      total,
      date: new Date().toLocaleString(),
    };

    dispatch(addTransaction(newTransaction)); // Guardamos la transacción en Redux
    localStorage.setItem('transactions', JSON.stringify([...transactions, newTransaction])); // Persistimos en localStorage
    dispatch(clearCart()); // Limpiamos el carrito después de guardar
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, product) => sum + product.precioVenta * product.stock, 0);
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Mi Tienda', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 20, 40);

    const tableData = cartItems.map((item) => [
      item.descripcion,
      item.stock, // Usamos el stock para la cantidad
      `$${item.precioVenta.toFixed(2)}`,
      `$${(item.precioVenta * item.stock).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Total']],
      body: tableData,
      startY: 50,
    });

    doc.save('ticket.pdf');
  };

  const closeDay = () => {
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const ws = XLSX.utils.json_to_sheet(allTransactions.map((transaction: Transaction) => ({
      ID: transaction.id,
      Fecha: transaction.date,
      Total: transaction.total,
      Productos: transaction.items.map(item => item.descripcion).join(', '),
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transacciones del Día');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'transacciones_dia.xlsx');
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ticket de Compra
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />

        {cartItems.length === 0 ? (
          <Typography>No hay productos en el carrito.</Typography>
        ) : (
          <Box>
            {cartItems.map((product) => (
              <Box key={product.codigo} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>
                  {product.descripcion} - ${product.precioVenta.toFixed(2)} x {product.stock}
                </Typography>
                <Box>
                  <Button variant="contained" size="small" onClick={() => handleAdd(product)}>
                    +
                  </Button>
                  <Button variant="contained" size="small" color="secondary" onClick={() => handleRemove(product.codigo)} sx={{ ml: 1 }}>
                    -
                  </Button>
                </Box>
              </Box>
            ))}
            <Divider sx={{ marginY: 2 }} />
            <TextField
              label="Descuento (%)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="h6">Total: ${calculateTotal().toFixed(2)}</Typography>
          </Box>
        )}

         {/* Modal de Vista Previa del Ticket */}
          <Dialog open={isModalOpen} onClose={closeModal}>
              <DialogTitle>Vista Previa del Ticket</DialogTitle>
              <DialogContent>
                <Typography>Supermercado</Typography>
                <Typography>Fecha: {new Date().toLocaleDateString()}</Typography>
                <Typography>Hora: {new Date().toLocaleTimeString()}</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unitario</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.codigo}>
                          <TableCell>{item.descripcion}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>${item.precioVenta.toFixed(2)}</TableCell>
                          <TableCell>${(item.precioVenta * item.stock).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="h6">Total:</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={generatePDF} color="primary">Descargar Ticket</Button>
                <Button onClick={closeModal} color="secondary">Cerrar</Button>
              </DialogActions>
            </Dialog>

        {cartItems.length > 0 && (
          <Box mt={3}>
            <Button variant="contained" color="primary" onClick={handleClearCart} sx={{ marginRight: 2 }}>
              Vaciar Carrito
            </Button>
            <Button variant="contained" color="secondary" onClick={openModal} sx={{ marginRight: 2 }}>
              Generar Ticket
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCompleteTransaction} sx={{ marginRight: 2 }}>
              Completar Compra
            </Button>
            <Button variant="contained" color="success" onClick={closeDay} sx={{ marginRight: 2 }}>
              Cierre del Día
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;
