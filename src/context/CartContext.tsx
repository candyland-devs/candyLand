// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  nombre_cliente: string;
  email_cliente: string;
  direccion_envio: string;
}

interface CartContextType {
  cart: Product[];
  addItem: (product: Omit<Product, "quantity">) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: number;
  sendOrder: (orderData: OrderData) => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  sendOrder: async () => {},
});

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addItem = (product: Omit<Product, "quantity">) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (id: number) => setCart(cart.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const sendOrder = async (orderData: OrderData) => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!orderData.nombre_cliente || !orderData.email_cliente || !orderData.direccion_envio) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      console.log("📦 Enviando pedido:", { ...orderData, products: cart });

      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...orderData,
          products: cart 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el pedido");
      }

      console.log("✅ Pedido creado:", data);
      clearCart();
      alert(`¡Pedido #${data.id_pedido} confirmado! 
Total: $${data.total.toFixed(2)}
Recibirás un email de confirmación.`);
      
    } catch (error) {
      console.error("❌ Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Hubo un error al enviar el pedido: ${errorMessage}`);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, total, sendOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);