const { Router } = require('express')
const pedidosController = require('../controllers/pedidosController')

const router = Router()

router.get('/', pedidosController.getAllPedidos)
router.get('/:id', pedidosController.getPedidoByID)
router.post('/create', pedidosController.createPedido)

module.exports = router
