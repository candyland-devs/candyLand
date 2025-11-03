import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CarritoPage() {
  const { cart, removeItem, clearCart, total, sendOrder } = useCart();
  
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    email_cliente: "",
    direccion_envio: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFinalizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setLoading(true);
    try {
      await sendOrder(formData);
      // Limpiar formulario después del éxito
      setFormData({
        nombre_cliente: "",
        email_cliente: "",
        direccion_envio: ""
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Tu Carrito</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
            <a 
              href="/catalogo" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Ir al catálogo
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-xl font-semibold">Productos</h2>
              </div>
              
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity} = <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800 font-semibold px-4 py-2 rounded hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <div className="p-4 bg-green-50 border-t-2 border-green-600">
                <div className="flex justify-between items-center text-2xl font-bold text-green-700">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Formulario de envío */}
            <form onSubmit={handleFinalizarCompra} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Datos de entrega</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre_cliente"
                    value={formData.nombre_cliente}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email_cliente"
                    value={formData.email_cliente}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recibirás la confirmación del pedido en este email
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Dirección de envío *
                  </label>
                  <textarea
                    name="direccion_envio"
                    value={formData.direccion_envio}
                    onChange={handleChange}
                    placeholder="Calle, número, piso, código postal, ciudad"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Procesando..." : `Finalizar Compra ($${total.toFixed(2)})`}
                </button>
                
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  Vaciar Carrito
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}