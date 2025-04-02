// Definir el enum de Categorías
export enum Categoria {
  // Se pueden agregar más categorías dinámicamente
}

// Modelo de Producto
export interface Product {
  codigo: string;
  descripcion: string;
  categoria: string; // Ahora es string en lugar de enum
  precioCosto: number;
  precioVenta: number;
  stock: number;
  utilidad?: number;
}
