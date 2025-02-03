const sql = require('mssql');
const { getConnection } = require('./connection');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
const getUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Users WHERE UserId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
const postUser = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("userName", sql.NVarChar(50), req.body.UserName)
      .input("password", sql.NVarChar(255), req.body.Password)
      .input("email", sql.NVarChar(100), req.body.Email)
      .input("birthdate", sql.Date, req.body.Birthdate)
      .input("address", sql.NVarChar(255), req.body.Address)
      .input("rut", sql.NVarChar(20), req.body.RUT)
      .input("phone", sql.NVarChar(15), req.body.Phone)
      .input("contactName", sql.NVarChar(100), req.body.ContactName)
      .input("roleId", sql.Int, 2)
      .query(
        `INSERT INTO Users (UserName, Password, Email, Birthdate, Address, RUT, Phone, ContactName, RoleId) 
         VALUES (@userName, @password, @email, @birthdate, @address, @rut, @phone, @contactName, @roleId); 
         SELECT SCOPE_IDENTITY() AS Id`
      );

    res.json({
      Id: result.recordset[0].Id,
      UserName: req.body.UserName,
      Email: req.body.Email,
      Birthdate: req.body.Birthdate,
      Address: req.body.Address,
      RUT: req.body.RUT,
      Phone: req.body.Phone,
      ContactName: req.body.ContactName,
      RoleId: 2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Actualizar un usuario existente
// const putUser = async (req, res) => {
//   try {
//     const pool = await getConnection();
//     const result = await pool
//       .request()
//       .input("userId", sql.Int, req.params.UserId)
//       .input("userName", sql.NVarChar(50), req.body.UserName)
//       .input("password", sql.NVarChar(255), req.body.Password)
//       .input("email", sql.NVarChar(100), req.body.Email)
//       .input("birthdate", sql.Date, req.body.Birthdate)
//       .input("address", sql.NVarChar(255), req.body.Address)
//       .input("rut", sql.NVarChar(20), req.body.RUT)
//       .input("phone", sql.NVarChar(15), req.body.Phone)
//       .input("contactName", sql.NVarChar(100), req.body.ContactName)
//       .query(
//         "UPDATE Users SET UserName = @userName, Password = @password, Email = @email, Birthdate = @birthdate, Address = @address, RUT = @rut, Phone = @phone, ContactName = @contactName WHERE Id = @userId"
//       );

//     if (result.rowsAffected[0] == 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       Id: req.params.id,
//       UserName: req.body.UserName,
//       Password: req.body.Password,
//       Email: req.body.Email,
//       Birthdate: req.body.Birthdate,
//       Address: req.body.Address,
//       RUT: req.body.RUT,
//       Phone: req.body.Phone,
//       ContactName: req.body.ContactName,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const putUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("userId", sql.Int, req.params.id)
      .input("roleId", sql.Int, req.body.RoleId)
      .query("UPDATE Users SET RoleId = @roleId WHERE UserId = @userId");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Rol actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ message: "Error al actualizar el rol." });
  }
};



// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Users WHERE UserId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función de login para validar credenciales
const jwt = require("jsonwebtoken");


const loginUser = async (req, res) => {
  const { Email, Password } = req.body;


  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar(100), Email)
      .input("Password", sql.NVarChar(255), Password)
      .query("SELECT * FROM Users WHERE Email = @Email AND Password = @Password");



    if (result.recordset.length > 0) {
      const user = result.recordset[0];



      const token = jwt.sign(
        {
          userId: user.UserId,
          roleId: user.RoleId,
          email: user.Email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );


      res.json({
        codigo: 200,
        apiKey: token,
        email: user.Email,
        userName: user.UserName,
        roleId: user.RoleId,
        userId: user.UserId,
      });
    } else {
      res.status(401).json({
        codigo: 401,
        ok: false,
        message: "Credenciales incorrectas",
      });
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({
      codigo: 500,
      message: "Error en el servidor",
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  loginUser,
};
