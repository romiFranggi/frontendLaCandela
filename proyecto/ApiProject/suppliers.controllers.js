const sql = require('mssql');
const { getConnection } = require('./connection');

module.exports = {
  getSuppliers: async (req, res) => {
    try {
      const pool = await getConnection();

      const result = await pool.request().query("SELECT * FROM Suppliers");

      res.json(result.recordset);
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  getSupplier: async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("SELECT * FROM Suppliers where SupplierId = @id");

      console.log(result);

      if (result.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json(result.recordset[0]);
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  postSupplier: async (req, res) => {
    try {
      const pool = await getConnection();

      // Crear el proveedor
      const result = await pool
        .request()
        .input("name", sql.NVarChar(100), req.body.Name)
        .input("phone", sql.NVarChar(15), req.body.Phone)
        .input("cost", sql.Decimal(18, 2), req.body.Cost)
        .input("email", sql.NVarChar(100), req.body.Email)
        .input("lastPurchaseDate", sql.Date, req.body.LastPurchaseDate)
        .query(
          "INSERT INTO Suppliers (Name, Phone, Cost, Email, LastPurchaseDate) OUTPUT INSERTED.SupplierId VALUES (@name, @phone, @cost, @Email, @lastPurchaseDate)"
        );

      const supplierId = result.recordset[0].SupplierId;
      
      res.json({
        SupplierId: supplierId,
        Name: req.body.Name,
        Phone: req.body.Phone,
        Cost: req.body.Cost,
        Email: req.body.Email,
        LastPurchaseDate: req.body.LastPurchaseDate,
      });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  putSupplier: async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .input("name", sql.NVarChar(100), req.body.Name)
        .input("phone", sql.NVarChar(15), req.body.Phone)
        .input("cost", sql.Decimal(18, 2), req.body.Cost)
        .input("email", sql.NVarChar(100), req.body.Email)
        .input("lastPurchaseDate", sql.Date, req.body.LastPurchaseDate)
        .query(
          "UPDATE Suppliers SET Name = @name, Phone = @phone, Cost = @cost, Email = @email, LastPurchaseDate = @lastPurchaseDate WHERE SupplierId = @id"
        );

      if (result.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json({
        SupplierId: req.params.id,
        Name: req.body.Name,
        Phone: req.body.Phone,
        Cost: req.body.Cost,
        Email: req.body.Email,
        LastPurchaseDate: req.body.LastPurchaseDate,
      });
    } catch (e) {
      return res.json({ message: e.message });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const pool = await getConnection();

      const deleteResult = await pool
        .request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM Suppliers WHERE SupplierId = @id");

      if (deleteResult.rowsAffected[0] == 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json({ message: "Supplier deleted successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },
};
