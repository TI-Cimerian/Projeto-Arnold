const { Router } = require('express')
const maquinasController = require('../controllers/maquinasController')

const router = Router()

router.get('/', maquinasController.getAllMaquinas)
router.get('/:id', maquinasController.getMaquinaByID)

module.exports = router
