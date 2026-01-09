const API_URL = import.meta.env.VITE_API_URL;

// Función genérica para llamar a la API
async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error("Error al obtener datos");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

// Obtener todos los productos
export async function getProductos() {
  return fetchAPI(`/productos?populate=*`);
}

// Obtener un producto por ID
export async function getProducto(id) {
  return fetchAPI(`/productos/${id}?populate=*`);
}

// Obtener categorías
export async function getCategorias() {
  return fetchAPI(`/categorias?populate=*`);
}

// Obtener productos marcados como oferta
export async function getOfertas() {
  return fetchAPI(
    `/productos?filters[es_oferta][$eq]=true&populate=*`
  );
}

// Obtener combos (nueva colección)
export async function getCombos() {
  return fetchAPI(`/combos?populate=*`);
}
