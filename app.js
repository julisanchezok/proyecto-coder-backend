import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProducts, saveProducts } from './services/productsService.js';  

import productsRouterFactory from './routes/productsRouter.js';  
import cartRouter from './routes/cartRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const products = await getProducts();
  res.render('home', { products });
});


app.get('/realtimeproducts', async (req, res) => {
  const products = await getProducts();
  res.render('realTimeProducts', { products });
});


io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  let products = await getProducts();
  socket.emit('products', products);

 
  socket.on('newProduct', async (product) => {
    console.log("new product")
    products.push(product);
    await saveProducts(products);  
    io.emit('products', products);  
  });

  
  socket.on('deleteProduct', async (productId) => {
    products = products.filter(p => p.id !== productId);
    await saveProducts(products);  
    io.emit('products', products);  
  });
});


app.use('/api/products', productsRouterFactory(io));
app.use('/api/cart', cartRouter);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
