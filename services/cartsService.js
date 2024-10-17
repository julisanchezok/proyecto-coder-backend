import { cartModel } from '../src/models/cart.model.js';
import { productModel } from '../src/models/product.model.js';

export const deleteProductFromCart = async (cid, pid) => {
    try {
        return await cartModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        throw error;
    }
};

export const updateCart = async (cid, products) => {
    try {
        return await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
};
 
export const updateProductQuantityInCart = async (cid, pid, quantity) => {
    try {
        return await cartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        throw error;
    }
};

export const deleteAllProductsFromCart = async (cid) => {
    try {
        return await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
    } catch (error) {
        console.error('Error deleting all products from cart:', error);
        throw error;
    }
};

export const getCartWithProducts = async (cid) => {
    try {
        return await cartModel.findById(cid).populate('products.product');
    } catch (error) {
        console.error('Error retrieving cart with products:', error);
        throw error;
    }
};
