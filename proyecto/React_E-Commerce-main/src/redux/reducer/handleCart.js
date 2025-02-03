// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    // Asegurarse de que sea un array válido
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Error al cargar el carrito del localStorage:", error);
    return [];
  }
};


const handleCart = (state = getInitialCart(), action) => {
  switch (action.type) {
    case "ADDITEM": {
      const existingItemIndex = state.findIndex(
        (item) =>
          item.ProductId === action.payload.ProductId &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        // Producto ya existe, incrementar cantidad
        return state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, qty: item.qty + 1 } // Crear nuevo objeto para evitar mutación
            : item
        );
      } else {
        // Producto nuevo, agregarlo con qty = 1
        return [...state, { ...action.payload, qty: 1 }];
      }
    }

    case "DELITEM": {
      const existingItemIndex = state.findIndex(
        (item) =>
          item.ProductId === action.payload.ProductId &&
          item.color === action.payload.color
      );

      if (existingItemIndex !== -1) {
        const updatedState = state.map((item, index) => {
          if (index === existingItemIndex) {
            if (item.qty > 1) {
              // Reducir cantidad y devolver nuevo objeto
              return { ...item, qty: item.qty - 1 };
            }
            return null; // Marca para eliminar
          }
          return item;
        });

        // Filtra los elementos marcados como `null`
        return updatedState.filter((item) => item !== null);
      }

      return state; // Si no encuentra el producto, retorna el estado actual
    }

    default:
      return state;
  }
};
export default handleCart;
