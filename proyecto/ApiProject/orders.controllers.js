const sql = require('mssql');
const { getConnection } = require('./connection');

const getOrders = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                o.OrderId,
                u.UserName,
                o.UserEmail,
                o.OrderDate,
                o.Status,
                o.Total,
                op.ProductId,
                p.Name AS ProductName,
                op.Quantity,
                op.Price
            FROM Orders o
            LEFT JOIN OrderProduct op ON o.OrderId = op.OrderId
            LEFT JOIN Users u ON o.UserId = u.UserId
            LEFT JOIN Products p ON op.ProductId = p.ProductId
            ORDER BY o.OrderDate DESC;
        `);

        const orders = result.recordset.reduce((acc, row) => {
            const existingOrder = acc.find(order => order.OrderId === row.OrderId);
            if (existingOrder) {
                existingOrder.products.push({
                    ProductId: row.ProductId,
                    ProductName: row.ProductName,
                    Quantity: row.Quantity,
                    Price: row.Price,
                    Base: row.Base,
                    Height: row.Height,
                    Weight: row.Weight,
                    Volume: row.Volume,
                    Color: row.Color
                });
            } else {
                acc.push({
                    OrderId: row.OrderId,
                    UserName: row.UserName,
                    UserEmail: row.UserEmail,
                    OrderDate: row.OrderDate,
                    Status: row.Status,
                    Total: row.Total,
                    products: row.ProductId ? [{
                        ProductId: row.ProductId,
                        ProductName: row.ProductName,
                        Quantity: row.Quantity,
                        Price: row.Price,
                        Base: row.Base,
                        Height: row.Height,
                        Weight: row.Weight,
                        Volume: row.Volume,
                        Color: row.Color
                    }] : [],
                });
            }
            return acc;
        }, []);

        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: error.message });
    }
};

const putOrder = async (req, res) => {
    try {
        const { Status } = req.body;
        if (!Status) {
            return res.status(400).json({ message: "El campo 'Status' es obligatorio." });
        }

        const pool = await getConnection();
        const transaction = pool.transaction();

        await transaction.begin();

        const result = await transaction
            .request()
            .input("id", sql.Int, req.params.id)
            .input("status", sql.NVarChar(50), Status)
            .query("UPDATE Orders SET Status = @status WHERE OrderId = @id");

        if (result.rowsAffected[0] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Pedido no encontrado." });
        }

        const userEmailResult = await transaction
            .request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT UserEmail FROM Orders WHERE OrderId = @id");

        if (userEmailResult.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Correo electrónico no encontrado para el pedido." });
        }

        const userEmail = userEmailResult.recordset[0].UserEmail;

        await transaction.commit();

        res.status(200).json({ Id: req.params.id, Status, UserEmail: userEmail });
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

const productosVendidos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            WITH MonthData AS (
                SELECT 
                    MONTH(o.OrderDate) AS MonthNumber,
                    SUM(op.Quantity) AS TotalProductsSold
                FROM Orders o
                JOIN OrderProduct op ON o.OrderId = op.OrderId
                GROUP BY MONTH(o.OrderDate)
            )
            SELECT 
                m.MonthNumber,  
                m.Month,  -- Incluye el nombre del mes
                ISNULL(md.TotalProductsSold, 0) AS TotalProductsSold
            FROM 
                (VALUES 
                    (1, 'Enero'), 
                    (2, 'Febrero'), 
                    (3, 'Marzo'), 
                    (4, 'Abril'), 
                    (5, 'Mayo'), 
                    (6, 'Junio'),
                    (7, 'Julio'), 
                    (8, 'Agosto'), 
                    (9, 'Septiembre'), 
                    (10, 'Octubre'), 
                    (11, 'Noviembre'), 
                    (12, 'Diciembre')
                ) AS m(MonthNumber, Month)
            LEFT JOIN MonthData md ON m.MonthNumber = md.MonthNumber
            ORDER BY m.MonthNumber;
        `);

        res.json(result.recordset); // Devuelve los resultados como un JSON
    } catch (e) {
        return res.status(500).json({ message: e.message }); // Devuelve un error en caso de fallo
    }
};

const postOrder = async (userId, products) => {
    if (!products || products.length === 0) {
        return { success: false, error: "Debe proporcionar al menos un producto." };
    }

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const userResult = await transaction.request()
            .input("userId", sql.Int, userId)
            .query("SELECT Email FROM Users WHERE UserId = @userId");

        if (userResult.recordset.length === 0) {
            await transaction.rollback();
            return { success: false, error: "Usuario no encontrado." };
        }

        const userEmail = userResult.recordset[0].Email;

        let total = products.reduce((sum, product) => sum + product.quantity * product.unit_price, 0);

        const orderResult = await transaction.request()
            .input("userId", sql.Int, userId)
            .input("userEmail", sql.NVarChar(100), userEmail)
            .input("total", sql.Decimal(10, 2), total)
            .query(`
                INSERT INTO Orders (UserId, UserEmail, Total) 
                OUTPUT INSERTED.OrderId 
                VALUES (@userId, @userEmail, @total)
            `);

        const orderId = orderResult.recordset[0].OrderId;

        for (const product of products) {
            await transaction.request()
                .input("orderId", sql.Int, orderId)
                .input("productId", sql.Int, product.id)
                .input("quantity", sql.Int, product.quantity)
                .input("price", sql.Decimal(10, 2), product.unit_price)
                .query(`
                    INSERT INTO OrderProduct (OrderId, ProductId, Quantity, Price) 
                    VALUES (@orderId, @productId, @quantity, @price)
                `);
        }
        console.log("Productos ver: ");
        console.log(products);

        await transaction.commit();

        return { success: true, OrderId: orderId, UserId: userId, Total: total, Products: products };
    } catch (error) {
        console.error("Error en postOrder:", error);
        await transaction.rollback();
        return { success: false, error: error.message };
    }
};

module.exports = {
    getOrders,
    postOrder,
    putOrder,
    productosVendidos,
};
