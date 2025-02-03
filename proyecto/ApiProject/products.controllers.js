const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const { getConnection } = require("./connection.js");
const sql = require("mssql");

const getProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Products");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProductsPerCategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.idCategory)
      .query("SELECT * FROM Products WHERE CategoryId = @id");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProductsPerName = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("name", sql.VarChar, req.params.NameProduct)
      .query("SELECT * FROM Products WHERE Name = @name");
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Products where ProductId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=lacandelaalmacenamiento;AccountKey=yLrwbIGPnfkqZVHUevFj+Qvr4lzXXg91QzanZekpSUu1PYmnAIOnQ29XMpVm+z103IlWaesaKyoR+ASt5eb/uw==;EndpointSuffix=core.windows.net';

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'contenedor';

const uploadImageToAzureBlob = async (file) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = `product-${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(file.path);
  console.log(`Subido a ${blobName} exitosamente`, uploadBlobResponse);

  return blockBlobClient.url;
};

const postProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha recibido una imagen' });
    }

    // Subir la imagen a Azure Blob Storage
    const imageUrl = await uploadImageToAzureBlob(req.file);

    // Crear conexión con la base de datos
    const pool = await getConnection();

    // Parseo y validación de los datos del request
    const creationDate = new Date();
    const price = parseFloat(req.body.Price) || 0;
    const cost = parseFloat(req.body.Cost) || 0;
    const quantity = parseInt(req.body.Quantity) || 0;
    const categoryId = parseInt(req.body.CategoryId) || null;
    const rate = parseFloat(req.body.Rate) || null;
    const base = parseFloat(req.body.Base) || null;
    const height = parseFloat(req.body.Height) || null;
    const weight = parseFloat(req.body.Weight) || null;
    const volume = parseFloat(req.body.Volume) || null;
    const package = parseInt(req.body.Package) || null;
    const aLaVenta = req.body.ALaVenta === "true" || req.body.ALaVenta === 1;
    const supplierId = parseInt(req.body.SupplierId) || null;
    const color = req.body.Color || null;

    // Insertar el producto en la base de datos
    const result = await pool
      .request()
      .input("name", sql.NVarChar(100), req.body.Name)
      .input("price", sql.Decimal(18, 2), price)
      .input("cost", sql.Decimal(18, 2), cost)
      .input("description", sql.NVarChar(255), req.body.Description)
      .input("quantity", sql.Int, quantity)
      .input("categoryId", sql.Int, categoryId)
      .input("imageUrl", sql.VarChar(255), imageUrl)
      .input("creationDate", sql.DateTime, creationDate)
      .input("rate", sql.Decimal(3, 2), rate)
      .input("base", sql.Decimal(10, 2), base)
      .input("height", sql.Decimal(10, 2), height)
      .input("weight", sql.Decimal(10, 2), weight)
      .input("volume", sql.Decimal(10, 2), volume)
      .input("package", sql.Int, package)
      .input("aLaVenta", sql.Bit, aLaVenta)
      .input("supplierId", sql.Int, supplierId)
      .input("color", sql.NVarChar(30), color)
      .query(`
        INSERT INTO Products 
        (Name, Price, Cost, Description, Quantity, CategoryId, ImageUrl, CreationDate, Rate, Base, Height, Weight, Volume, Package, ALaVenta, SupplierId, Color) 
        VALUES 
        (@name, @price, @cost, @description, @quantity, @categoryId, @imageUrl, @creationDate, @rate, @base, @height, @weight, @volume, @package, @aLaVenta, @supplierId, @color); 
        SELECT SCOPE_IDENTITY() AS Id
      `);

    // Responder con los datos insertados
    res.json({
      Id: result.recordset[0].Id,
      Name: req.body.Name,
      Price: price,
      Cost: cost,
      Description: req.body.Description,
      Quantity: quantity,
      CategoryId: categoryId,
      ImageUrl: imageUrl,
      CreationDate: creationDate.toISOString(),
      Rate: rate,
      Base: base,
      Height: height,
      Weight: weight,
      Volume: volume,
      Package: package,
      ALaVenta: aLaVenta,
      SupplierId: supplierId,
      Color: color,
    });

  } catch (e) {
    console.error("Error en postProduct:", e);
    res.status(500).json({ message: e.message });
  }
};


const putProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.NVarChar(100), req.body.Name)
      .input("price", sql.Decimal(18, 2), req.body.Price)
      .input("cost", sql.Decimal(18, 2), req.body.Cost)
      .input("description", sql.NVarChar(255), req.body.Description)
      .input("quantity", sql.Int, req.body.Quantity)
      .input("alaventa", sql.Bit, req.body.ALaVenta)
      .input("supplierId", sql.Int, req.body.SupplierId)
      .input("color", sql.NVarChar(30), req.body.Color)
      .query(
        "UPDATE Products SET Name = @name, Price = @price, Cost = @cost, Description = @description, Quantity = @quantity, ALaVenta = @alaventa, SupplierId = @supplierId, Color = @color WHERE ProductId = @id"
      );

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ProductId: req.params.id,
      Name: req.body.Name,
      Price: req.body.Price,
      Cost: req.body.Cost,
      Description: req.body.Description,
      Quantity: req.body.Quantity,
      ALaVenta: req.body.ALaVenta,
      SupplierId: req.body.SupplierId,
      Color: req.body.Color,
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Products WHERE ProductId = @id");

    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

const getTop10ProductsMostSold = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT TOP 10 
    ProductId, 
    Name, 
    Price, 
    soldCount
  FROM Products
  ORDER BY soldCount DESC, ProductId ASC
  `);
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message })
  }
}

const getTop10ProductsLeastSold = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT TOP 10 
    ProductId, 
    Name, 
    Price, 
    soldCount
FROM Products
ORDER BY soldCount ASC, ProductId ASC
  `);
    res.json(result.recordset);
  } catch (e) {
    return res.json({ message: e.message })
  }
}

const updateProductStock = async (productId, quantity) => {
  try {
    if (quantity <= 0) {
      return { success: false, error: "La cantidad debe ser mayor que 0." };
    }

    const pool = await getConnection();
    const transaction = pool.transaction();
    await transaction.begin();

    const result = await transaction
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT Quantity, soldCount FROM Products WHERE ProductId = @productId");

    if (result.recordset.length === 0) {
      await transaction.rollback();
      return { success: false, error: `Producto con ID ${productId} no encontrado.` };
    }

    const currentStock = result.recordset[0].Quantity;
    const currentSoldCount = result.recordset[0].soldCount;

    if (currentStock < quantity) {
      await transaction.rollback();
      return { success: false, error: `Stock insuficiente para el producto ${productId}. Stock disponible: ${currentStock}` };
    }

    const updatedStock = currentStock - quantity;
    const updatedSoldCount = currentSoldCount + quantity;

    await transaction
      .request()
      .input("productId", sql.Int, productId)
      .input("quantity", sql.Int, updatedStock)
      .input("soldCount", sql.Int, updatedSoldCount)
      .query("UPDATE Products SET Quantity = @quantity, SoldCount = @soldCount WHERE ProductId = @productId");

    await transaction.commit();

    return { success: true, newStock: updatedStock, newSoldCount: updatedSoldCount };
  } catch (error) {
    console.error(`Error al actualizar el stock para el producto ${productId}:`, error.message);
    return { success: false, error: "Error al actualizar el stock." };
  }
};

module.exports = {
  getProducts,
  getProductsPerCategory,
  getProductsPerName,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
  updateProductStock,
  getTop10ProductsMostSold,
  getTop10ProductsLeastSold,
};