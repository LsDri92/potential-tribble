export {};

declare module 'jspdf-autotable' {
  const autoTable: (options: any) => void;
  export default autoTable;
}

declare global {
  interface Window {
    electron: {
      getProductsFilePath: () => Promise<string>; // Devuelve la ruta del archivo de productos
      importXlsx: (filePath: string) => Promise<{ success: boolean; message: string; products: Product[] }>;
      readProducts: () => Promise<Product[]>; // Lee productos desde el archivo JSON
      writeProducts: (products: Product[]) => Promise<void>; // Escribe productos en el archivo JSON
      readCategories: () => Promise<string[]>; // Lee categorías desde el archivo JSON
      writeCategories: (categories: string[]) => Promise<void>; // Escribe categorías en el archivo JSON
    };
  }
}
