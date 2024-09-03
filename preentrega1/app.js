
import express from 'express'

import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'



const app = express();
const server = app.listen(8080, () => console.log("Listening on port 8080"))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.send('Servidor active')
})
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

