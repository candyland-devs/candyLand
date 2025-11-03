import React from "react";
import { useCart } from "../../../context/CartContext";  // ← Importa tu contexto

interface Producto {
  id: number;
  title: string;
  price: string;
  id_categoria: number;
  unidad_medida: string;
  peso: string;
}

interface CatalogCardProps {
  producto: Producto;
}

const CatalogCard = ({ producto }: CatalogCardProps) => {
  const { addItem } = useCart();  // ← Usa tu contexto existente

  const { id, title, price, peso, unidad_medida } = producto;
  const priceNum = parseFloat(price);

  if (!id || !title || isNaN(priceNum) || priceNum <= 0) {
    console.warn("⚠️ Producto inválido:", producto);
    return null;
  }

  const handleAddToCart = () => {
    // ✅ Adapta la estructura a tu CartContext (name en lugar de title)
    addItem({ 
      id, 
      name: title,  // ← Tu contexto usa "name" no "title"
      price: priceNum 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Imagen del producto */}
      <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <span className="text-6xl">🍬</span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        
        {/* Info adicional */}
        {peso && unidad_medida && (
          <p className="text-sm text-gray-600 mb-2">
            📦 {peso} • {unidad_medida}
          </p>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-pink-600">
            ${priceNum.toFixed(2)}
          </span>
        </div>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-semibold hover:bg-pink-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          <span>Agregar al carrito</span>
        </button>
      </div>
    </div>
  );
};

export default CatalogCard;