import { productModel } from '../src/models/product.model.js';

export const getProducts = async (req) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const category = req.query.category;
        const availability = req.query.availability === 'true';
        const query = {};

        if (category) query.category = category;
        if (availability) query.stock = { $gt: 0 };

        const sort = req.query.sort;
        const options = { limit, page, lean: true };
        if (sort) options.sort = { price: sort };

        const prod =  await productModel.paginate(query, options);
        console.log('products:', prod)
        return await productModel.paginate(query, options);
    } catch (error) {
        console.error('Error retrieving products:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        return await productModel.findById(id).lean();
    } catch (error) {
        console.error('Error retrieving product by ID:', error);
        throw error;
    } 
};

export const createProduct = async (productData) => {
    try {
        return await productModel.create(productData);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        return await productModel.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        return await productModel.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};
