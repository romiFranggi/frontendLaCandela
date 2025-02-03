import API_URL from "../config";
import toast from "react-hot-toast";

const DeleteProduct = async (productId, setProducts, setFilter) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");

    if (isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/productos/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast.success("Producto borrado");

                setProducts(prevProducts => prevProducts.filter(product => product.ProductId !== productId));
                setFilter(prevFilter => prevFilter.filter(product => product.ProductId !== productId));

            } else {
                toast.error("No se borró correctamente");
                throw new Error(`Error al intentar borrar el producto con ID: ${productId}`);
            }
        } catch (err) {
            console.error("Error al borrar:", err);
            toast.error("Error al intentar borrar el producto.");
        }
    } else {
        toast.error("Eliminación del producto cancelada");
    }
};

export default DeleteProduct;

