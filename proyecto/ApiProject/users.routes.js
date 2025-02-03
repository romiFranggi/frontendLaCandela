const { Router } = require('express');
const {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  loginUser
} = require('./users.controllers.js');

const router = Router();

//#region Usuarios
router.get("/usuarios", getUsers);

router.get("/usuarios/:id", getUser);

router.post("/usuarios", postUser);

router.put("/usuarios/:id", putUser);

router.delete("/usuarios/:id", deleteUser);

router.post("/login", loginUser);
//#endregion

module.exports = router;
