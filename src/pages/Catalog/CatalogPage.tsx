import React, { useState, useEffect } from "react";
import CatalogCard from "../../components/Catalog/CatalogCard/CatalogCard";

interface Producto {
  id: number;
  title: string;
  price: string;
  id_categoria: number;
  unidad_medida: string;
  peso: string;
}

const CatalogPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "todas">("todas");

  const API_URL = "http://localhost:3001/api/productos";

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🌐 Fetching desde:", API_URL);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📥 Datos recibidos:", data);
      
      setProductos(data);
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err instanceof Error ? err.message : "Error al conectar");
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(p => {
    const cumpleFiltro = p.title.toLowerCase().includes(filtro.toLowerCase());
    const cumpleCategoria = categoriaSeleccionada === "todas" || 
                           p.id_categoria === categoriaSeleccionada;
    return cumpleFiltro && cumpleCategoria;
  });

  const categoriasIds = ["todas", ...new Set(productos.map(p => p.id_categoria))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🍭</div>
          <p className="text-xl text-gray-600 font-semibold">Cargando dulces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">
            🍭 Sweet Market - Catálogo
          </h1>
          <p className="text-gray-600 text-lg">
            {productos.length} productos disponibles
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            <p className="font-bold">⚠️ Error: {error}</p>
            <p className="text-sm mt-1">Verifica que el backend esté corriendo en {API_URL}</p>
            <button 
              onClick={fetchProductos}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(
                e.target.value === "todas" ? "todas" : Number(e.target.value)
              )}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categoriasIds.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "todas" ? "📂 Todas las categorías" : `Categoría ${cat}`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-600 font-semibold mb-2">
              No se encontraron productos
            </p>
            <p className="text-gray-500">
              Intenta con otro término de búsqueda o categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map(producto => (
              <CatalogCard 
                key={producto.id} 
                producto={producto}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;