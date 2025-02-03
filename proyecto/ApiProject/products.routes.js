const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  getProducts,
  getProductsPerCategory,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
  getProductsPerName,
  getTop10ProductsMostSold,
  getTop10ProductsLeastSold,
} = require('./products.controllers.js');

const router = Router();

//#region Productos
router.get("/productos", getProducts);

router.get("/topProductosVendidos", getTop10ProductsMostSold);

router.get("/topProductosMenosVendidos", getTop10ProductsLeastSold);

router.get("/productos/categorias/:idCategory", getProductsPerCategory);

router.get("/productos/nombre/:NameProduct", getProductsPerName);

router.get("/productos/:id", getProduct);

router.post('/productos', upload.single('image'), postProduct);

router.put("/productos/:id", putProduct);

router.delete("/productos/:id", deleteProduct);
//#endregion

module.exports = router;
