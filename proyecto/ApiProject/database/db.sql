USE laCandelaDB;

-- Eliminar las tablas en el orden correcto para evitar conflictos de claves foráneas
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS OrderProduct;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS ProductColor;
DROP TABLE IF EXISTS Colors;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Suppliers;
DROP TABLE IF EXISTS Roles;


-- Crear la tabla Categories con jerarquía de categorías y subcategorías
CREATE TABLE Categories (
    CategoryId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    ParentCategoryId INT NULL, -- NULL para categorías generales; apunta a una categoría general para subcategorías
    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(CategoryId)
);

-- Crear la tabla Suppliers con relación a Products
CREATE TABLE Suppliers (
    SupplierId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(15),
    Cost DECIMAL(18, 2) NULL,
    Email NVARCHAR(100) UNIQUE,
    LastPurchaseDate DATE
);

-- Crear la tabla Products con relación a Categories, agregando Largo, Ancho y Color
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1), 
    Name NVARCHAR(100) NOT NULL,
	Price DECIMAL(18, 2),  
    Cost DECIMAL(18, 2) NOT NULL,     
    Description NVARCHAR(255),         
    Quantity INT,
    CategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    CreationDate DATETIME DEFAULT GETDATE(),
    ImageUrl VARCHAR(255), -- Ruta o URL de la imagen del producto
    Rate DECIMAL(3, 2) DEFAULT 0, -- Nueva columna Rate entre 0 y 5, con 2 decimales
    Base DECIMAL(10, 2) NULL,  
    Height DECIMAL(10, 2) NULL,
	Weight DECIMAL(10, 2) NULL,
	Volume DECIMAL(10, 2) NULL,
	Package INT NULL,
    ALaVenta BIT DEFAULT 0,
	SupplierId INT NOT NULL FOREIGN KEY REFERENCES Suppliers(SupplierId),
    soldCount INT DEFAULT 0,
    Color NVARCHAR(30) NULL
);

CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL
);

-- Crear la tabla Users con los campos adicionales
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(50) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Birthdate DATE,
    Address NVARCHAR(255),
    RUT NVARCHAR(20) /* UNIQUE */ NULL,
    Phone NVARCHAR(15),
    ContactName NVARCHAR(100),
    RoleId INT DEFAULT 2, 
    CONSTRAINT FK_RoleId FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

INSERT INTO Roles (RoleName) VALUES 
('Administrador'), 
('Cliente');

-- Insertar categorías generales
INSERT INTO Categories (Name, ParentCategoryId) VALUES 
    ('Velas', NULL), --1
    ('Sahumerios', NULL), --2
    ('Decoraciones', NULL); --3

CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL, 
    UserEmail NVARCHAR(100) NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(), 
    Status NVARCHAR(50) DEFAULT 'En preparación' CHECK (Status IN ('En preparación', 'Listo para entregar', 'Entregado')),
    Total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) 
);

CREATE TABLE OrderProduct (
    OrderProductId INT PRIMARY KEY IDENTITY(1,1), 
    OrderId INT NOT NULL, 
    ProductId INT NOT NULL, 
    Quantity INT NOT NULL, --esto seria la cantidad que compró de ese producto
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId), 
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) 
);


INSERT INTO Suppliers (Name, Phone, Cost, Email, LastPurchaseDate) VALUES 
    ('Proveedor Aromas', '123456789', 8, 'aromas@example.com', '2024-10-10'),
    ('Proveedor Esencias', '987654321', 5, 'esencias@example.com', '2024-10-15'),
    ('Proveedor Decoración', '555666777', 18, 'decoraciones@example.com', '2024-10-20');  

-- Insertar productos de ejemplo para cada categoría, incluyendo la imagen, rate, y los nuevos campos
-- Los Sahumerios tienen las medidas y color nulos
INSERT INTO Products (Name, Price, Cost, Description, Quantity, CategoryId, CreationDate, ImageUrl, Rate, Base, Height, Weight, Volume, Package, ALaVenta, SupplierId, soldCount, Color) VALUES 	
('Velas lisas', 330.00, 0, 'Pack de 50 velas lisas, ideales para crear una atmósfera cálida en cualquier ocasión.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.16 PM.jpeg', 0, NULL, NULL, NULL, NULL, 50, 1, 1, 0, NULL),	--1
('Velas combinadas', 439.00, 0, 'Pack de 50 velas combinadas en varios colores, perfectas para dar un toque de color.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.19 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 50, 1, 1, 0, NULL),	--2
('Velas super', 720.00, 0, 'Pack de 50 velas de tamaño grande, ideales para una iluminación duradera en el hogar.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.24 PM.jpeg', 0, NULL, NULL, NULL, NULL, 50, 1, 1, 0, NULL),	--3
('Velon 7 dias', 139.00, 0, 'Velón de larga duración, ideal para rituales o decoraciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.24 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL),	--4
('Velon 7 dias combinado', 165.00, 0, 'Velón de 7 días en colores combinados, perfecto para crear un ambiente único.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.25 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL),	--5
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Blanco'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Rosa'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Pastel'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Celeste'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Azul'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Rojo'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Amarillo'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Cian'),
('Velon', 26.00, 0, 'Velón compacto de 4x6 cm, ideal para decoraciones pequeñas o altares.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, 'Violeta'),	--6
('Velon', 39.00, 0, 'Velón de 4x10 cm, de larga duración para espacios acogedores.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 4, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--7
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Blanco'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Amarillo'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Jade'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Verde'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Rosa'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Crema'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Pastel'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Naranja'),
('Velon', 27.00, 0, 'Velón compacto de 3.5x6 cm, perfecto para crear ambientes íntimos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.31 PM.jpeg', 0, 3.5, 6, NULL, NULL, 1, 1, 1, 0, 'Rojo'),	--8
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Verde'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Celeste'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Rosa chillon'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Violeta'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Rojo'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Rosa'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Naranja'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Carmesi'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Blanco'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Crema'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Amarillo'),
('Velon', 39.00, 0, 'Velón de 5x5 cm, perfecto para decoraciones o meditaciones prolongadas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, 'Cera'),	--9
('Velon', 43.00, 0, 'Velón de 5x7 cm para una iluminación duradera y suave.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 7, NULL, NULL, 1, 1, 1, 0, NULL),	--10
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 87, 'Blanco'),	
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Crema'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Amarillo'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Naranja'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Rosa'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Celeste'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Violeta'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Rojo'),
('Velon', 66.00, 0, 'Velón de 5x10 cm, ideal para decoración en cenas o eventos.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.27 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, 'Azul'),--11
('Velon', 65.00, 0, 'Velón de 6x6 cm que proporciona una luz suave y duradera.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 6, 6, NULL, NULL, 1, 1, 1, 0, NULL),	--12
('Velon', 96.00, 0, 'Velón de 6x10 cm, excelente para crear ambientes cálidos y relajantes.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 6, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--13
('Velon', 139.00, 0, 'Velón de 6x15 cm, ideal para decoraciones elegantes y meditaciones prolongadas.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 6, 15, NULL, NULL, 1, 1, 1, 3, NULL),	--14
('Velon', 135.00, 0, 'Velón de 8x8 cm, diseñado para una luz suave y prolongada.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 8, 8, NULL, NULL, 1, 1, 1, 0, NULL),	--15
('Velon', 265.00, 0, 'Velón de 10x10 cm, perfecto para crear un ambiente relajante en cualquier espacio.', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiZLmoQh-a5zKieGb8UCQEDyk8PQfRs5Ew-A&s', 0, 10, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--16
('Velon prisma', 39.00, 0, 'Velón en forma de prisma de 4x6 cm, ideal para decoraciones modernas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.26 PM (1).jpeg', 0, 4, 6, NULL, NULL, 1, 1, 1, 0, NULL),	--17
('Vela cubo', 69.00, 0, 'Vela en forma de cubo de 6 cm, perfecta para decoraciones originales y únicas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.29 PM (1).jpeg', 0, 6, 6, NULL, NULL, 1, 1, 1, 0, NULL),	--18
('Vela disco', 19.00, 0, 'Vela flotante en forma de disco de 4x3 cm, ideal para centros de mesa en agua.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.28 PM (1).jpeg', 0, 4, 3, NULL, NULL, 1, 1, 1, 0, NULL),	--19
('Vela flotante', 15.00, 0, 'Vela flotante de 4x1.5 cm, ideal para decoraciones acuáticas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.29 PM.jpeg', 0, 4, 1.5, NULL, NULL, 1, 1, 1, 0, NULL),	--20
('Vela aromatica', 89.00, 0, 'Vela aromática de 5x5 cm, que proporciona un suave aroma y un ambiente acogedor.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.48 PM (1).jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 15, NULL),	--21
('Vela aromatica', 139.00, 0, 'Vela aromática de 5x10 cm, que crea un ambiente perfumado y cálido por horas.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.48 PM.jpeg', 0, 5, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--22
('Vela aromatica', 135.00, 0, 'Vela aromática de 8x8 cm, con una fragancia suave y elegante.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.49 PM (1).jpeg', 0, 8, 8, NULL, NULL, 1, 1, 1, 0, NULL),	--23
('Vela cónica', 32.00, 0, 'Vela cónica de 30 cm, ideal para decoraciones elegantes y ceremoniales.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.30 PM.jpeg', 0, 30, 30, NULL, NULL, 1, 1, 1, 0, NULL), --24
('Vela torneada', 24.00, 0, 'Vela torneada decorativa con diseño esculpido.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.30 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL),
('Velón perfumado', 52.00, 0, 'Velón perfumado de 3x5 cm, con fragancia relajante.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.49 PM.jpeg', 0, 3, 5, NULL, NULL, 1, 1, 1, 0, NULL), --26
('Velón perfumado', 135.00, 0, 'Velón perfumado de 5x5 cm, ideal para aromatizar ambientes.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.49 PM.jpeg', 0, 5, 5, NULL, NULL, 1, 1, 1, 0, NULL), --27
('Vela perfumada en vaso', 135.00, 0, 'Vela perfumada en vaso de vidrio, perfecta para regalar.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.50 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --28
('Vela perfumada en lata', 135.00, 0, 'Vela perfumada en lata, práctica y fácil de transportar.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.49 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --29
('Vasito con vela', 49.00, 0, 'Vela aromática en vasito, ideal para decorar y perfumar.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.02 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --30
('Fanal', 79.00, 0, 'Fanal decorativo de 8 cm, ideal para iluminar ambientes exteriores.', 30, 3, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.02 PM (4).jpeg', 0, 8, 8, NULL, NULL, 1, 1, 1, 0, NULL), --31
('Fanal', 125.00, 0, 'Fanal decorativo de 10 cm para ambientes acogedores.', 30, 3, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.03 PM (1).jpeg', 0, 10, 10, NULL, NULL, 1, 1, 1, 0, NULL), --32
('Fanal', 169.00, 0, 'Fanal de 12 cm, ideal para espacios amplios.', 30, 3, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.03 PM.jpeg', 0, 12, 12, NULL, NULL, 1, 1, 1, 0, NULL), --33
('Fanal globo', 39.00, 0, 'Mini fanal globo, diseño moderno y compacto.', 30, 3, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.14 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --34
('Fanal globo', 79.00, 0, 'Fanal globo de 10 cm, de diseño contemporáneo.', 30, 3, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.14 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --35
('Fanal globo', 135.00, 0, 'Fanal globo de 12 cm, perfecto para iluminar con estilo.', 30, 3, GETDATE(), 'https://acdn.mitiendanube.com/stores/933/006/products/fanal-globo1-4ef1ebc03b543fcce716691726121922-1024-1024.jpg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --36
('Fanal globo', 199.00, 0, 'Fanal globo de 15 cm, ilumina espacios amplios.', 30, 3, GETDATE(), 'https://acdn.mitiendanube.com/stores/933/006/products/fanal-globo1-4ef1ebc03b543fcce716691726121922-1024-1024.jpg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL), --37
('Fanal globo', 315.00, 0, 'Fanal globo de 20 cm, para decoración elegante.', 30, 3, GETDATE(), 'https://acdn.mitiendanube.com/stores/933/006/products/fanal-globo1-4ef1ebc03b543fcce716691726121922-1024-1024.jpg', 0, 10, 10, NULL, NULL, 1, 1, 1, 20, NULL), --38
('Vela miel', 27.00, 0, 'Vela de miel de 3x3 cm, natural y suave.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.50 PM (1).jpeg', 0, 3, 3, NULL, NULL, 1, 1, 1, 0, NULL), --39
('Vela miel', 43.00, 0, 'Vela de miel de 3x6 cm, aroma natural y relajante.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.51 PM (1).jpeg', 0, 3, 6, NULL, NULL, 1, 1, 1, 0, NULL), --40
('Vela miel', 30.00, 0, 'Vela de miel de 2x10 cm, pequeña y perfumada.', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.51 PM.jpeg', 0, 2, 10, NULL, NULL, 1, 1, 1, 0, NULL), --41
('Vela miel', 45.00, 0, 'Vela miel de 2x20', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.52 PM.jpeg', 0, 2, 20, NULL, NULL, 1, 1, 1, 53, NULL),	--42
('Vela miel buda', 95.00, 0, 'Vela miel buda', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.52 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 1, 0, NULL),	--43
('Vela de cera', 110.00, 0, 'Vela de cera 2x45 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.54 PM.jpeg', 0, 2, 45, NULL, NULL, 1, 1, 1, 0, NULL),	--44
('Vela de cera', 159.00, 0, 'Vela de cera 2.5x50 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.54 PM.jpeg', 0, 2.5, 50, NULL, NULL, 1, 1, 1, 0, NULL),	--45
('Vela de cera', 235.00, 0, 'Vela de cera 3.5x50cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.54 PM.jpeg', 0, 3.5, 50, NULL, NULL, 1, 1, 1, 0, NULL),	--46
('Cirio', 829.00, 0, 'Cirio de 4x60 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.55 PM.jpeg', 0, 4, 60, NULL, NULL, 1, 1, 1, 0, NULL),	--47
('Cirio', 1239.00, 0, 'Cirio de 6x60 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.55 PM.jpeg', 0, 6, 60, NULL, NULL, 1, 1, 1, 0, NULL),	--48
('Cirio', 1859.00, 0, 'Cirio de 7x60 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.55 PM.jpeg', 0, 7, 60, NULL, NULL, 1, 1, 1, 0, NULL),	--49
('Cirio', 3629.00, 0, 'Cirio de 10x60 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.55 PM.jpeg', 0, 10, 60, NULL, NULL, 1, 1, 1, 0, NULL),	--50
('Cirio', 105.00, 0, 'Cirio de 6x7 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.55 PM (1).jpeg', 0, 6, 7, NULL, NULL, 1, 1, 1, 0, NULL),	--51
('Cirio', 135.00, 0, 'Cirio de 6x9 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.57 PM.jpeg', 0, 6, 9, NULL, NULL, 1, 1, 1, 0, NULL),
('Cirio', 189.00, 0, 'Cirio de 6x15 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.56 PM.jpeg', 0, 6, 15, NULL, NULL, 1, 1, 1, 0, NULL),	--53
('Cirio', 239.00, 0, 'Cirio de 6x20 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.56 PM (1).jpeg', 0, 6, 20, NULL, NULL, 1, 1, 1, 0, NULL),	--54
('Cirio', 135.00, 0, 'Cirio de 7x7 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 7, 7, NULL, NULL, 1, 1, 1, 0, NULL),	--55
('Cirio', 159.00, 0, 'Cirio de 7x9 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 7, 9, NULL, NULL, 1, 1, 1, 0, NULL),	--56
('Cirio', 269.00, 0, 'Cirio de 7x15 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 7, 15, NULL, NULL, 1, 1, 1, 0, NULL),	--57
('Cirio', 299.00, 0, 'Cirio de 7x20 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 7, 20, NULL, NULL, 1, 1, 1, 0, NULL),	--58
('Cirio', 378.00, 0, 'Cirio de 10x10 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.57 PM.jpeg', 0, 10, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--59
('Cirio', 529.00, 0, 'Cirio de 10x15 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 10, 15, NULL, NULL, 1, 1, 1, 0, NULL),	--60
('Cirio', 659.00, 0, 'Cirio de 10x20 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 10, 20, NULL, NULL, 1, 1, 1, 0, NULL),	--61
('Cirio', 795.00, 0, 'Cirio de 10x25 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 10, 25, NULL, NULL, 1, 1, 1, 0, NULL),	--62
('Cirio', 989.00, 0, 'Cirio de 10x30 cm', 30, 1, GETDATE(), 'https://http2.mlstatic.com/D_NQ_NP_775522-MLM74472996775_022024-O.webp', 0, 10, 30, NULL, NULL, 1, 1, 1, 0, NULL),	--63
('Velon', 315.00, 0, 'Velon de 10x10 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.58 PM.jpeg', 0, 10, 10, NULL, NULL, 1, 1, 1, 0, NULL),	--64
('Velon', 439.00, 0, 'Velon de 10x15 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.58 PM (1).jpeg', 0, 10, 15, NULL, NULL, 1, 1, 1, 0, NULL),	--65
('Velon', 549.00, 0, 'Velon de 10x20 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.59 PM.jpeg', 0, 10, 20, NULL, NULL, 1, 1, 1, 0, NULL),	--66
('Vela inglesa', 289.00, 0, 'Vela inglesa de 15 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.48.59 PM (1).jpeg', 0, 15, 15, NULL, NULL, 50, 1, 2, 10, NULL),	--67
('Vela inglesa', 399.00, 0, 'Vela inglesa de 25 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsAppUnknown2025-01-19at2.32.34PM/WhatsAppImage2024-11-28at6.48.59PM(1).jpeg', 0, 25, 25, NULL, NULL, 50, 1, 2, 0, NULL),	--68
('Vela N° de cumpleaños', 32.00, 0, 'Vela que representa un numero, ideal para cumpleaños', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.00 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--69
('Vela vestido', 110.00, 0, 'Vela con forma de vestido', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.00 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--70
('Acuario con vela', 135.00, 0, 'Acuario con una vela', 30, 1, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5BjCr3Cn7uNyzQfp44sIe5sOuSsjq2V8-5Q&s', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--71
('Vela corazon', 45.00, 0, 'Vela con forma de corazón', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.02 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--72
('Apaga velas', 345.00, 0, 'Apaga velas', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.02 PM (3).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--73
('Vela citronella', 199.00, 0, 'Vela citronella', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.02 PM (2).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--74
('Vela led', 28.00, 0, 'Vela led de 3x3 cm', 30, 1, GETDATE(), '', 0, 3, 3, NULL, NULL, 1, 1, 2, 0, NULL),	--75
('Vasito acrilico vela led', 49.00, 0, 'Vasito acrilico para tu vela led', 30, 1, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--76
('Acuario vidrio', 49.00, 0, 'Acuario vidrio de 6 cm', 30, 1, GETDATE(), '', 0, 6, 6, NULL, NULL, 1, 1, 2, 0, NULL),	--77
('Acuario vidrio', 59.00, 0, 'Acuario vidrio de 8 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.14 PM (1).jpeg', 0, 8, 8, NULL, NULL, 1, 1, 2, 0, NULL),	
('Acuario vidrio', 105.00, 0, 'Acuario vidrio de 10 cm', 30, 1, GETDATE(), '', 0, 10, 10, NULL, NULL, 1, 1, 2, 0, NULL),	--79
('Acuario vidrio', 169.00, 0, 'Acuario vidrio de 15 cm', 30, 1, GETDATE(), '', 0, 15, 15, NULL, NULL, 1, 1, 2, 0, NULL),	--80
('Acuario vidrio', 249.00, 0, 'Acuario vidrio de 18 cm', 30, 1, GETDATE(), '', 0, 18, 18, NULL, NULL, 1, 1, 2, 0, NULL),	--81
('Acuario vidrio', 269.00, 0, 'Acuario vidrio de 20 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.15 PM.jpeg', 0, 20, 20, NULL, NULL, 1, 1, 2, 0, NULL),	--82
('Votivo vidrio', 29.00, 0, 'Votivo de vidrio de 5x3 cm', 30, 1, GETDATE(), '', 0, 5, 3, NULL, NULL, 1, 1, 2, 0, NULL),	--83
('Votivo vidrio', 29.00, 0, 'Votivo de vidrio de 4x6 cm', 30, 1, GETDATE(), '', 0, 4, 6, NULL, NULL, 1, 1, 2, 0, NULL),	--84
('Votivo vidrio campana', 29.00, 0, 'Votivo de vidrio con forma de campana', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.16 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--85,0
('Votivo vidrio conico', 39.00, 0, 'Votivo de vidrio con forma conica', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.21 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--86
('Vidrio cilindro', 199.00, 0, 'Vidrio con forma de cilindro de 10x15 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.18 PM.jpeg', 0, 10, 15, NULL, NULL, 1, 1, 2, 0, NULL),	--87
('Vidrio cilindro', 215.00, 0, 'Vidrio con forma de cilindro de 9x20 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.17 PM (1).jpeg', 0, 9, 20, NULL, NULL, 1, 1, 2, 0, NULL),	--88
('Vidrio cilindro', 289.00, 0, 'Vidrio con forma de cilindro de 9x25 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.17 PM.jpeg', 0, 9, 25, NULL, NULL, 1, 1, 2, 0, NULL),	--89
('Vidrio cilindro', 255.00, 0, 'Vidrio con forma de cilindro de 12x12 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.18 PM (1).jpeg', 0, 12, 12, NULL, NULL, 1, 1, 2, 0, NULL),	--90
('Vidrio cilindro', 374.00, 0, 'Vidrio con forma de cilindro de 12x20 cm', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.20 PM.jpeg', 0, 12, 20, NULL, NULL, 1, 1, 2, 0, NULL),	--91
('Globo vidrio facetado', 159.00, 0, 'Globo vidrio facetado chico', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.21 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--92
('Globo vidrio facetado', 199.00, 0, 'Globo vidrio facetado grande', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.22 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2, 0, NULL),	--93
('Vidrio campana', 29.00, 0, 'Vidrio campana', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.22 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--94
('Acuario marroqui', 259.00, 0, 'Acuario marroqui', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.23 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--95
('Lata mandala', 69.00, 0, 'Lata mandala con forma cuadrada', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.24 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--96
('Lata mandala', 79.00, 0, 'Lata mandala bombe', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.25 PM (1).jpeg', 0, NULL, NULL,  NULL, NULL, 1, 1, 2,0, NULL),	--97
('Lata mandala', 99.00, 0, 'Lata mandala con forma de corazón', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.23 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--98
('Lata mandala', 99.00, 0, 'Lata mandala grande', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.25 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--99
('Candelabro vidrio mini', 99.00, 0, 'Candelabro vidrio mini', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.25 PM (2).jpeg', 0, NULL, NULL, NULL, NULL, 1, 1, 2,0, NULL),	--100
('Candelabro vidrio diamante', 135.00, 0, 'Candelabro vidrio diamante', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.26 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 0, 2,0, NULL),	--101
('Candelabro vidrio facetado', 115.00, 0, 'Candelabro vidrio facetado', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.26 PM (1).jpeg', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--102
('Candelabro hierro tres patas', 215.00, 0, 'Candelabro hierro tres patas', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.27 PM (1).jpeg', 0, NULL,  NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--103
('Candelabro hierro vela conica', 195.00, 0, 'Candelabro hierro vela conica', 30, 1, GETDATE(), 'https://lacandelaalmacenamiento.blob.core.windows.net/contenedor/WhatsApp Unknown 2025-01-19 at 2.32.34 PM/WhatsApp Image 2024-11-28 at 6.49.27 PM.jpeg', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--104
('Velador MDF calado con vidrio laminado', 285.00, 0, 'Velador MDF calado con vidrio laminado', 30, 3, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXv9uMTwEC3JHS6BlFCiNuVfrqS3uR9NxhA&s', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--105
('Velador MDF calado con vidrio chico', 170.00, 0, 'Velador MDF calado con vidrio chico', 30, 3, GETDATE(), 'https://acdn.mitiendanube.com/stores/002/339/329/products/laser-team-3-velador71-4b16227e8f58f8b0c816827170777682-1024-1024.png', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--106
('Velador MDF calado con vidrio mini', 139.00, 0, 'Velador MDF calado con vidrio mini', 30, 3, GETDATE(), 'https://acdn.mitiendanube.com/stores/002/339/329/products/laser-team-3-velador71-4b16227e8f58f8b0c816827170777682-1024-1024.png', 0, NULL,  NULL, NULL, NULL, 1, 0, 2, 70, NULL),	--107
('Porta velas caireles', 139.00, 0, 'Porta velas caireles', 30, 1, GETDATE(), '', 0, NULL,  NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--108
('Difusor chico', 169.00, 0, 'Difusor chico', 30, 3, GETDATE(), 'https://f.fcdn.app/imgs/40f7c8/mispetates.com/mipeuy/9edb/original/catalogo/GF.33-simil-madera-claro-1/1920-1200/vaporizador-chico-con-transparencia-simil-madera-claro.jpg', 0,  NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--109
('Difusor 20 dias', 279.00, 0, 'Difusor 20 dias', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--110
('Difusor 45 dias', 445.00, 0, 'Difusor 45 dias', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--111
('Lampara de sal', 790.00, 0, 'Lampara de sal 2kg', 30, 3, GETDATE(), '', 0, NULL, 2, NULL, NULL, 1, 0, 2, 0, NULL),	--112
('Lampara de sal', NULL, 0, 'Lampara de sal 3kg', 30, 3, GETDATE(), '', 0, NULL, 3, NULL, NULL, 1, 0, 2, 0, NULL),	--113
('Lampara de sal', 990.00, 0, 'Lampara de sal 4kg', 30, 3, GETDATE(), '', 0, NULL, 4, NULL, NULL, 1, 0, 2, 0, NULL),	--114
('Lampara de sal mini usb', 499.00, 0, 'Lampara de sal mini usb', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--115
('Antorchas jardin', 120.00, 0, 'Antorchas jardin', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--116
('Hornito mini', 179.00, 0, 'Hornito mini', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--117
('Hornito mediano', 325.00, 0, 'Hornito mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--118
('Hornito grande', 565.00, 0, 'Hornito grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--119
('Hornito metal', 345.00, 0, 'Vela con aroma a canela', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--120
('Esencias para hornito liquida', 99.00, 0, 'Esencias para hornito liquida', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--121
('Esencias para hornito solida', 158.00, 0, 'Hornito mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--122
('Plato barro chico', 85.00, 0, 'Plato barro chico', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--123
('Plato barro mediano', 79.00, 0, 'Plato barro mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--124
('Plato barro grande', 169.00, 0, 'Plato barro grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--125
('Plato ceramica natural', 129.00, 0, 'Plato ceramica natural', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--126
('Plato ceramica mini', 45.00, 0, 'Plato ceramica mini', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--127
('Plato ceramica chico', 59.00, 0, 'Plato ceramica chico', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--128
('Quemador ceramica mini', 65.00, 0, 'Quemador ceramica mini', 30, 2, GETDATE(), 'https://essencewaxmelt.com/cdn/shop/files/IMG-20241104_145116.jpg?v=1730730220&width=1946', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--129
('Quemador ceramica con tapa', 299.00, 0, 'Quemador ceramica con tapa', 30, 2, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8RPsoXhI0ioB1Xg3c7BKiyLy7JfpynBxdew&s', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--130
('Porta sahumerio ceramica buda', 129.00, 0, 'Porta sahumerio ceramica buda', 30, 2, GETDATE(), 'https://f.fcdn.app/imgs/64f6bd/mispetates.com/mipeuy/1d46/original/catalogo/OHR.MP252-blanco-1/1920-1200/porta-sahumerio-buda-blanco.jpg', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 8, NULL),	--131
('Quemador cemento', 199.00, 0, 'Quemador cemento', 30, 2, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQYJVYAuAhF1xcU-sIEf7SMAlq1GNzqKIxgg&s', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--132
('Quemador colgante', 490.00, 0, 'Quemador colgante', 30, 2, GETDATE(), 'https://m.media-amazon.com/images/I/61medT62ddL._AC_SL1500_.jpg', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--133
('Campana bronce mini', 279.00, 0, 'Campana bronce mini', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--134
('Campana bronce chica', 399.00, 0, 'Campana bronce chica', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--135
('Campana bronce mediana', 530.00, 0, 'Campana bronce mediana', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--136
('Campana bronce grande', 545.00, 0, 'Campana bronce grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--137
('Tablita porta sahumerio', 49.00, 0, 'Tablita porta sahumerio', 30, 2, GETDATE(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnKQ8YGFoTkfphRjy2GtP637xxljP-rRVHPg&s', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--138
('Base porta sahumerio', 99.00, 0, 'Base porta sahumerio', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--139
('Torre porta sahumerio', 395.00, 0, 'Torreporta sahumerio', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 2, 0, NULL),	--140
('Sahumerios comunes', 17.00, 0, 'Sahumerios comunes', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--141
('Sahumerios pasta', 25.00, 0, 'Sahumerios pasta', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--142
('Sahumerios naturales', 89.00, 0, 'Sahumerios naturales', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--143
('Conitos sahumerio', 45.00, 0, 'Conitos sahumerio', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--144
('Mandala MDF', 229.00, 0, 'Mandala MDF 30cm', 30, 3, GETDATE(), '', 0, 30, 30, NULL, NULL, 1, 0, 3, 0, NULL),	--145
('Mandala MDF', 560.00, 0, 'Mandala MDF 60cm', 30, 3, GETDATE(), '', 0, 60, 60, NULL, NULL, 1, 0, 3, 0, NULL),	--146
('Letras MDF', 19.00, 0, 'Letras MDF 7cm', 30, 3, GETDATE(), '', 0, 7, 7, NULL, NULL, 1, 0, 3, 0, NULL),	--147
('Letras MDF', 49.00, 0, 'Letras MDF 15cm', 30, 3, GETDATE(), '', 0, 15, 15, NULL, NULL, 1, 0, 3, 0, NULL),	--148
('Cubo MDF', 99.00, 0, 'Cubo MDF 8cm', 30, 3, GETDATE(), '', 0, 8, 8, NULL, NULL, 1, 0, 3, 0, NULL),	--149
('Cubo de MDF', 145.00, 0, 'Cubo de MDF 10 cm', 30, 3, GETDATE(), '', 0, 10, 10, NULL, NULL, 1, 0, 3, 0, NULL),	--150
('Cubo de MDF', 175.00, 0, 'Cubo de MDF 12 cm', 30, 3, GETDATE(), '', 0, 12, 12, NULL, NULL, 1, 0, 3, 0, NULL),	--151
('Porta te', 278.00, 0, 'Porta te de madera x3', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 3, 0, 3, 0, NULL),	--152
('Porta te', 349.00, 0, 'Porta te de madera x6', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 6, 0, 3, 0, NULL),	--153
('Porta te', 375.00, 0, 'Porta te de madera x9', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 9, 0, 3, 0, NULL),	--154
('Cajon de madera', 289.00, 0, 'Cajon de madera chico', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--155
('Cajon de madera', 385.00, 0, 'Cajon de madera mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--156
('Cajon de madera', 399.00, 0, 'Cajon de madera grande', 30, 3, GETDATE(), '', 0, 0, 0, NULL, NULL, 1, 0, 3, 0, NULL),	--157
('Figura de MDF', 19.00, 0, 'Figura de MDF 3 cm', 30, 3, GETDATE(), '', 0, 3, 3, NULL, NULL, 1, 0, 3, 0, NULL),	--158
('Figura de MDF', 24.00, 0, 'Figura de MDF 6 cm', 30, 3, GETDATE(), '', 0, 6, 6, NULL, NULL, 1, 0, 3, 0, NULL),	--159
('Figura de MDF', 45.00, 0, 'Figura de MDF 9 cm', 30, 3, GETDATE(), '', 0, 9, 9, NULL, NULL, 1, 0, 3, 0, NULL),	--160
('Caja de madera', 77.00, 0, 'Caja de madera 7 cm', 30, 3, GETDATE(), '', 0, 7, 7, NULL, NULL, 1, 0, 3, 0, NULL),	--161
('Caja de madera', 120.00, 0, 'Caja de madera 10 cm', 30, 3, GETDATE(), '', 0, 10, 10, NULL, NULL, 1, 0, 3, 0, NULL),	--162
('Caja de madera', 240.00, 0, 'Caja de madera 15 cm', 30, 3, GETDATE(), '', 0, 15, 15, NULL, NULL, 1, 0, 3, 0, NULL),	--163
('Caja de madera', 290.00, 0, 'Caja de madera 20 cm', 30, 3, GETDATE(), '', 0, 20, 20, NULL, NULL, 1, 0, 3, 0, NULL),	--164
('Pintura acrilica', 89.00, 0, 'Pintura acrilica 60 cc', 30, 3, GETDATE(), '', 0, NULL, NULL, 60, NULL, 1, 0, 3, 0, NULL),	--165
('Pintura acrilica', 159.00, 0, 'Pintura acrilica 120 cc', 30, 3, GETDATE(), '', 0, NULL, NULL, 120, NULL, 1, 0, 3, 0, NULL),	--166
('Pintura acrilica', 279.00, 0, 'Pintura acrilica 250 cc', 30, 3, GETDATE(), '', 0, 10, NULL, 250, NULL, 1, 0, 3, 0, NULL),	--167
('Tempera', 23.00, 0, 'Tempera 15 cc', 30, 3, GETDATE(), '', 0, NULL, NULL, 15, NULL, 1, 0, 3, 0, NULL),	--168
('Ladrillo oasis', 89.00, 0, 'Ladrillo oasis', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--169
('Bolsa musgo', 185.00, 0, 'Bolsa musgo', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--170
('Ramo flores secas', 199.00, 0, 'Ramo de flores secas', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--171
('Parafina', 199.00, 0, 'Parafina x1 kg', 30, 1, GETDATE(), '', 0, NULL, NULL, 1, NULL, 1, 0, 3, 0, NULL),	--172
('Pabilo fino', 12.00, 0, 'Pabilo fino', 30, 1, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--173
('Pabilo grueso', 15.00, 0, 'Pabilo grueso', 30, 1, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--174
('Color para velas', 65.00, 0, 'Colo para velas 60 cc', 30, 1, GETDATE(), '', 0, NULL, NULL, 60, NULL, 1, 0, 3, 0, NULL),	--175
('Escencia para velas', 159.00, 0, 'Escencia para velas', 30, 1, GETDATE(), '', 0, 10, 10, 30, NULL, 1, 0, 3, 0, NULL),	--176
('Molde silicona', 110.00, 0, 'Molde de silicona', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--177
('Glicerina para jabon', 490.00, 0, 'Glicerina para jabon', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--178
('Color para jabon', 55.00, 0, 'Color para jabon 60 cc', 30, 3, GETDATE(), '', 0, NULL, NULL, 60, NULL, 1, 0, 3, 0, NULL),	--179
('Escencia para jabon', 130.00, 0, 'Escencia para jabon 30 cc', 30, 3, GETDATE(), '', 0, NULL, NULL, 30, NULL, 1, 0, 3, 0, NULL),	--180
('Cera de soja', 790.00, 0, 'Cera de soja para velas', 30, 1, GETDATE(), '', 0, NULL, 0.5, NULL, NULL, 1, 0, 3, 0, NULL),	--181
('Cera de soja', NULL, 0, 'Cera de soja para velas', 30, 1, GETDATE(), '', 0, NULL, NULL, 0.25, NULL, 1, 0, 3, 0, NULL),	--182
('Pabilo para soja', 5.00, 0, 'Pabilo para soja 12 cm', 30, 1, GETDATE(), '', 0, 12, 12, NULL,  NULL, 1, 0, 3, 0, NULL),	--183
('Pabilo para soja', 7.00, 0, 'Pabilo para soja 20 cm', 30, 1, GETDATE(), '', 0, 20, 20, NULL,  NULL, 1, 0, 3, 0, NULL),	--184
('Laminas de miel', 75.00, 0, 'Laminas de miel', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--185
('Pastillero de metal', 20.00, 0, 'Pastillero de metal 5 cm', 30, 3, GETDATE(), '', 0, 5, 5, NULL, NULL, 1, 0, 3, 0, NULL),	--186
('Pastillero de metal', 28.00, 0, 'Pastillero de metal 7 cm', 30, 3, GETDATE(), '', 0, 7, 7, NULL, NULL, 1, 0, 3, 0, NULL),	--187
('Buda', 30.00, 0, 'Buda en yeso mini', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--188
('Buda', 124.00, 0, 'Buda en yeso chico', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--189
('Buda', 518.00, 0, 'Buda en yeso mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--190
('Buda', 769.00, 0, 'Buda en yeso grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--191
('Rana', 145.00, 0, 'Rana en yeso', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--192
('Angeles', 65.00, 0, 'Angeles en yeso chico', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--193
('Angeles', 165.00, 0, 'Angeles en yeso mediano', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--194
('Angeles', 319.00, 0, 'Angeles en yeso grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--195
('Virgen', 110.00, 0, 'Virgen en yeso chica', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--196
('Virgen', 318.00, 0, 'Virgen en yeso grande', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--197
('Flor', 89.00, 0, 'Flor de yeso', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--198
('Curcifijo', 120.00, 0, 'Curcifijo de yeso', 30, 3, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL),	--199
('Porta sahumerios', 52.00, 0, 'Porta sahumerios de yeso', 30, 2, GETDATE(), '', 0, NULL, NULL, NULL, NULL, 1, 0, 3, 0, NULL);	--200

INSERT INTO Users (UserName, Password, Email, Birthdate, Address, RUT, Phone, ContactName,RoleId) VALUES 
    ('JuanPerez', 'password123', 'juan.perez@example.com', '1990-05-21', 'Calle Falsa 123', '12345678-9', '123456789', 'Juan Pérez',2),
    ('MariaLopez', 'password456', 'maria.lopez@example.com', '1985-10-11', 'Avenida Siempre Viva 742', '98765432-1', '987654321', 'Maria Lopez',2),
    ('CarlosDiaz', 'password789', 'carlos.diaz@example.com', '2000-02-29', 'Boulevard Central 500', '55555555-5', '555666777', 'Carlos Diaz',2),
	('Admin', 'admin123', 'admin@hotmail.com', '2000-02-29', 'Boulevard Central 500', '55555555-5', '12345678', 'Admin',1);

INSERT INTO Orders(UserId, UserEmail, OrderDate, Status, Total) VALUES
(1, 'juan.perez@example.com', getdate(), 'En preparación', 660);

INSERT INTO OrderProduct(OrderId, ProductId,Price,Quantity) VALUES
(1, 1, 330, 2);

