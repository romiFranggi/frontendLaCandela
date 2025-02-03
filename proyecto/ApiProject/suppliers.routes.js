const { Router } = require('express');
const {
  getSuppliers,
  getSupplier,
  postSupplier,
  putSupplier,
  deleteSupplier,
} = require('./suppliers.controllers.js');

const router = Router();

//#region proveedores
router.get("/proveedores", getSuppliers);

router.get("/proveedores/:id", getSupplier);

router.post("/proveedores", postSupplier);

router.put("/proveedores/:id", putSupplier);

router.delete("/proveedores/:id", deleteSupplier);
//#endregion

module.exports = router;
