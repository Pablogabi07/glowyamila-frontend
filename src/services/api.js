const API_URL = import.meta.env.VITE_API_URL;

// Obtener token del admin (guardado en localStorage)
function getToken() {
  return localStorage.getItem("admin_token");
}

// Headers comunes
function getHeaders(isJSON = true) {
  const token = getToken();

  return {
    Authorization: token ? `Bearer ${token}` : "",
    ...(isJSON && { "Content-Type": "application/json" }),
  };
}

// ------------------------------
// GET genérico
// ------------------------------
async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Error al obtener datos");

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

// ------------------------------
// POST genérico
// ------------------------------
async function postAPI(endpoint, body) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) throw new Error("Error al crear recurso");

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("POST error:", error);
    return null;
  }
}

// ------------------------------
// PUT genérico
// ------------------------------
async function putAPI(endpoint, body) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) throw new Error("Error al actualizar recurso");

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("PUT error:", error);
    return null;
  }
}

// ------------------------------
// DELETE genérico
// ------------------------------
async function deleteAPI(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Error al borrar recurso");

    return true;
  } catch (error) {
    console.error("DELETE error:", error);
    return false;
  }
}

// ------------------------------
// SUBIR IMAGEN A STRAPI
// ------------------------------
export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("files", file);

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir imagen");

    const data = await res.json();
    return data[0]; // devuelve el archivo subido
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// ------------------------------
// GET existentes (tu tienda)
// ------------------------------
export async function getProductos() {
  return fetchAPI(`/productos?populate=*`);
}

export async function getProducto(id) {
  return fetchAPI(`/productos/${id}?populate=*`);
}

export async function getCategorias() {
  return fetchAPI(`/categorias?populate=*`);
}

export async function getOfertas() {
  return fetchAPI(`/productos?filters[es_oferta][$eq]=true&populate=*`);
}

export async function getCombos() {
  return fetchAPI(`/combos?populate=*`);
}

// ------------------------------
// CRUD para el panel
// ------------------------------
export async function crearProducto(data) {
  return postAPI(`/productos`, data);
}

export async function editarProducto(id, data) {
  return putAPI(`/productos/${id}`, data);
}

export async function borrarProducto(id) {
  return deleteAPI(`/productos/${id}`);
}

// ---- Categorías ----
export async function crearCategoria(data) {
  return postAPI(`/categorias`, data);
}

export async function editarCategoria(id, data) {
  return putAPI(`/categorias/${id}`, data);
}

export async function borrarCategoria(id) {
  return deleteAPI(`/categorias/${id}`);
}

// ---- Combos ----
export async function crearCombo(data) {
  return postAPI(`/combos`, data);
}

export async function editarCombo(id, data) {
  return putAPI(`/combos/${id}`, data);
}

export async function borrarCombo(id) {
  return deleteAPI(`/combos/${id}`);
}
