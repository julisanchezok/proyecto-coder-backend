import Router from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/productsService.js';
import { productModel } from '../src/models/product.model.js';

const productsRouter = (io) => {
    const router = Router();

    router.get('/', async function(req, res) {
        try {
            const products = await getProducts(req);
            res.send({ result: "success", payload: products });
        } catch (error) {
            console.log('Cannot access to products: ' + error);
            res.status(500).send({ result: "error", message: "Cannot retrieve products" });
        }
    });

    router.get('/:pid', async function(req, res) {
        try {
            const product = await getProductById(req.params.pid);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.send(product);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving product' });
        }
    });

    router.post('/', async function(req, res) {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || !price || !status || (!stock && stock != 0) || !category) {
                return res.status(400).send({ message: 'All fields are required and must not be null or empty' });
            }

            const product = await createProduct({
                title, description, code, price, status, stock, category, thumbnails: thumbnails || []
            });

            io.emit('newProduct', product);
            res.send({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).send({ message: 'Error creating product' });
        }
    });


    router.put('/:pid', async function(req, res) {
        try {
            const updatedProduct = await updateProduct(req.params.pid, req.body);
            if (!updatedProduct) {
                return res.status(404).send({ message: 'Product not found' });
            }

            io.emit('updateProduct', updatedProduct);
            res.send({ status: 'Product updated', payload: updatedProduct });
        } catch (error) {
            res.status(500).send({ message: 'Error updating product' });
        }
    });

    router.delete('/:pid', async function(req, res) {
        try {
            const deletedProduct = await deleteProduct(req.params.pid);
            if (!deletedProduct) {
                return res.status(404).send({ message: 'Product not found' });
            }

            io.emit('deleteProduct', req.params.pid);
            res.send({ status: 'Product has been deleted' });
        } catch (error) {
            res.status(500).send({ message: 'Error deleting product' });
        }
    });

    return router;
};

export default productsRouter;
