const { Router } = require('express')
const clienteController = require('../controllers/clientesController')

const router = Router()

router.get('/', clienteController.getClientes)
router.post('/create', clienteController.createCliente)

module.exports = router
