import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data', 'product.json'); 

export const getProducts = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8'); 
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return []; 
    }
};

export const saveProducts = (products) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2)); 
    } catch (error) {
        console.error('Error saving products:', error);
    }
};

export const deleteProducts = (products) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2)); 
    } catch (error) {
        console.error('Error saving products:', error);
    }
};
