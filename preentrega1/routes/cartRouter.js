import Router from 'express'
import { getCart, saveCart } from '../services/cartService.js'
const router = Router();

router.get('/', function(req, res) {
    const carts = getCart()
    res.send(carts);
});
router.get('/:cid', function(req, res) {
    const carts = getCart();
    const cart = carts.find(p => p.id == req.params.cid);
    if (!cart) {
        return res.status(404).send({ message: 'cart not found' });
    }
    res.send(cart);
});
router.post('/', function(req, res) {
    const carts = getCart();
    const size = carts.length + 1; 
    const {products} = req.body;
    if (!products || products.length == 0 ) {
        return res.status(400).send({ message: 'Cannot post a cart without products' });
    }
    for (let product of products) {
        if (!product.id || !product.quantity || product.quantity <= 0) {
            return res.status(400).send({ message: 'Invalid ID or invalid products' });
        }
    }
    const cart = {
        id: size,
        products: products,
    };
    if (cart) {
        carts.push(cart);
        saveCart(carts);
        return res.send({ status: 'cart created' });
    }
    res.status(400).send({ message: 'Invalid cart data' });
});
router.post('/:cid/product/:pid', function(req, res) {
    const carts = getCart();
    const cartFinded = carts.find(p => p.id == req.params.cid);
    if (!cartFinded) {
        return res.status(404).send({ message: 'cart not found' });
    }
    const productId = req.params.pid;
    let quantity = req.body.quantity || 1;
    const existingProduct = cartFinded.products.find(p => p.id == productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const newProduct = {
            id: productId,
            quantity: quantity
        };
        cartFinded.products.push(newProduct);
    }

    saveCart(carts);
    res.send({ status: 'cart updated' });
});


export default router;