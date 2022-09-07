const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getBusquedas,getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();




router.get('/:busqueda',validarJWT,  getBusquedas);
router.get('/coleccion/:tabla/:busqueda',validarJWT,  getDocumentosColeccion);


module.exports = router;