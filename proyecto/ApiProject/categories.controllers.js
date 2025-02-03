const { getConnection } = require("./connection.js");
const sql = require("mssql");

module.exports.getCategories = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query("SELECT * FROM Categories");

    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Categories where CategoryId = @id");

    console.log(result);

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.recordset[0]);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

module.exports.postCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("name", sql.NVarChar(100), req.body.Name)
      .input("parentcategoryid", sql.Int, req.body.ParentCategoryId)
      .query(
        "INSERT INTO Categories (Name, ParentCategoryId) VALUES (@name, @parentcategoryid); SELECT SCOPE_IDENTITY() AS CategoryId"
      );

    console.log(result);

    res.json({
      Id: result.recordset[0].CategoryId,
      Name: req.body.Name,
      ParentCategoryId: req.body.ParentCategoryId,
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

module.exports.putCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.NVarChar(100), req.body.Name)
      .input("parentcategoryid", sql.Int, req.body.ParentCategoryId)
      .query(
        "UPDATE Categories SET Name = @name, ParentCategoryId = @parentcategoryid WHERE CategoryId = @id"
      );

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      Id: req.params.id,
      Name: req.body.Name,
      ParentCategoryId: req.body.ParentCategoryId,
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Categories WHERE CategoryId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (e) {
    return res.json({ message: e.message });
  }
};
