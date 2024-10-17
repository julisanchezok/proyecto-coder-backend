import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './services/productsService.js';

import productsRouter from './routes/productsRouter.js';  
import cartRouter from './routes/cartsRouter.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products/:pid', async (req, res) => {
  const product = await getProductById(req.params.pid);
  res.render('productview', { product: product});
}); 

app.get('/products', async (req, res) => {
  const products = await getProducts(req);
  res.render('products', { products: products.docs });
});
app.get('/', async (req, res) => {
  const products = await getProducts(req);
  res.render('home', { products: products.docs });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await getProducts(req);
  res.render('realTimeProducts', { products });
});

io.on('connection', async (socket) => {
  let products = await getProducts({ query: {} });
  socket.emit('products', products.docs);

  socket.on('newProduct', async (productData) => {
    const newProduct = await createProduct(productData);
    io.emit('products', (await getProducts({ query: {} })).docs);
  });

  socket.on('deleteProduct', async (productId, req) => {
    await deleteProduct(productId);
    io.emit('products', await getProducts(req));
  });
});

mongoose.connect('mongodb+srv://julietaagosanchez:3WjyRJqV8JcH0y0R@codercluster.9pvyy.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster')
.then(response =>{
  console.log('connected to database')
})
.catch(error =>{
  console.log('cannot connect to database:', error)
  process.exit()
}) 

app.use('/api/products', productsRouter(io));
app.use('/api/cart', cartRouter);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
