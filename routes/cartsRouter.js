import { Router } from 'express';
import { 
    deleteProductFromCart, 
    updateCart, 
    updateProductQuantityInCart, 
    deleteAllProductsFromCart, 
    getCartWithProducts 
} from '../services/cartsService.js';

const cartRouter = Router();

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await deleteProductFromCart(req.params.cid, req.params.pid);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting product from cart' });
    }
});

cartRouter.post('/:cid', async (req, res) => {
    try {
        const updatedCart = await updateCart(req.params.cid, req.body);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ message: 'Error updating cart' });
    }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await updateProductQuantityInCart(req.params.cid, req.params.pid, req.body.quantity);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ message: 'Error updating product quantity in cart' });
    }
});

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const updatedCart = await deleteAllProductsFromCart(req.params.cid);
        res.send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting all products from cart' });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await getCartWithProducts(req.params.cid);
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving cart' });
    }
});

export default cartRouter;
