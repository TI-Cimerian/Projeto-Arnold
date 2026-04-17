const express = require('express')
const cors = require('cors')
const maquinasRoutes = require('./routes/maquinasRoutes')
const clienteRoutes = require('./routes/clienteRoutes')
const pedidosRoutes = require('./routes/pedidosRoutes')
const app = express()
const PORT = 3001
const HOST = '0.0.0.0'
// const HOST = 'localhost'

app.use(cors())
app.use(express.json())
app.use('/maquinas', maquinasRoutes)
app.use('/clientes', clienteRoutes)
app.use('/pedidos', pedidosRoutes)

app.get('/api', (req, res) => {
  res.json({ message: 'Olá do backend!' })
})
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`)
})
