import jsPDF from 'jspdf';
import { Product } from '../models/Product';

export const generatePDF = (products: Product[]) => {
  const doc = new jsPDF();
  doc.text('Ticket de Venta', 10, 10);
  let y = 20;
  products.forEach((product) => {
    doc.text(`${product.descripcion} - $${product.precioVenta}`, 10, y);
    y += 10;
  });
  doc.save('ticket.pdf');
};
