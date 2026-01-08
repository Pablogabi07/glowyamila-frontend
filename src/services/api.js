const API_URL = "http://localhost:1337/api";

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

export async function getProductos() {
  return fetchAPI(
    `/productos?populate[imagen_principal]=true&populate[categoria]=true`
  );
}

export async function getProducto(id) {
  return fetchAPI(
    `/productos/${id}?populate[imagen_principal]=true&populate[categoria]=true&populate[galeria]=true`
  );
}

export async function getCategorias() {
  return fetchAPI(`/categorias`);
}
