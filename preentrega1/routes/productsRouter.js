import Router from 'express';
import { getProducts, saveProducts } from '../services/productsService.js';

const productsRouterFactory = (io) => {
  const router = Router();


  router.get('/', function(req, res) {
      const products = getProducts();
      res.send(products);
  });

  router.get('/:pid', function(req, res) {
      const products = getProducts();
      const product = products.find(p => p.id == req.params.pid);
      if (!product) {
          return res.status(404).send({ message: 'Product not found' });
      }
      res.send(product);
  });


  router.post('/', function(req, res) {
      const products = getProducts();
      const size = products.length + 1; 
      const { title, description, code, price, status, stock, category, thumbnails } = req.body;

      if (!title || !description || !code || !price || !status || !stock || !category) {
          return res.status(400).send({ message: 'All fields are required and must not be null or empty' });
      }

      const product = {
          id: size,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails: thumbnails || null 
      };


      products.push(product);
      saveProducts(products);

      io.emit('newProduct', product);  

      return res.send({ status: 'Product created', product });
  });


  router.put('/:pid', function(req, res) {
      const products = getProducts();
      const productFinded = products.find(p => p.id == req.params.pid);
      if (!productFinded) {
          return res.status(404).send({ message: 'Product not found' });
      }
      const productIndex = products.findIndex(p => p.id == req.params.pid);
      const product = {
          id: productFinded.id, 
          title: req.body.title || productFinded.title,
          description: req.body.description || productFinded.description,
          code: req.body.code || productFinded.code,
          price: req.body.price || productFinded.price,
          status: req.body.status || productFinded.status,
          stock: req.body.stock || productFinded.stock,
          category: req.body.category || productFinded.category,
          thumbnails: req.body.thumbnails || productFinded.thumbnails || null
      };

      products[productIndex] = product;
      saveProducts(products);

      return res.send({ status: 'Product updated' });
  });


  router.delete('/:pid', function(req, res) {
      const products = getProducts();
      const productFinded = products.find(p => p.id == req.params.pid);
      if (!productFinded) {
          return res.status(404).send({ message: 'Product not found' });
      }
      const productIndex = products.findIndex(p => p.id == req.params.pid);
      products.splice(productIndex, 1);
      saveProducts(products);
                         
      io.emit('deleteProduct', req.params.pid);   

      return res.send({ status: 'Product has been deleted' });
  });

  return router;
};

export default productsRouterFactory;
