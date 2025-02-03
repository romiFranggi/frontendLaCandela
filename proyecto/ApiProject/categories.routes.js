const { Router } = require('express');
const {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
} = require('./categories.controllers.js');

const router = Router();

//#region categorias
router.get("/categorias", getCategories);

router.get("/categorias/:id", getCategory);

router.post("/categorias", postCategory);

router.put("/categorias/:id", putCategory);

router.delete("/categorias/:id", deleteCategory);
//#endregion

module.exports = router;
