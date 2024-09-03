import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data', 'cart.json'); 

export const getCart = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8'); 
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading cart:', error);
        return []; 
    }
};

export const saveCart = (cart) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(cart, null, 2)); 
    } catch (error) {
        console.error('Error saving cart:', error);
    }
};

