import { Product } from "../models/Product";

const DB_NAME = 'ProductDB';
const STORE_NAME = 'products';

// Función para abrir la base de datos
export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'codigo' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error al abrir la base de datos"));
    });
};

// Guardar productos en IndexedDB
export const saveToIndexedDB = async (products: Product[]) => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        store.clear(); // Limpiar datos previos

        // Guardamos productos individualmente
        products.forEach((product) => {
            store.put(product);
        });

        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(new Error("Error al guardar en IndexedDB"));
        });
    } catch (error) {
        console.error(error);
    }
};

// Cargar productos desde IndexedDB
export const loadFromIndexedDB = async (): Promise<Product[]> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Error al cargar productos"));
        });
    } catch (error) {
        console.error(error);
        return [];
    }
};
