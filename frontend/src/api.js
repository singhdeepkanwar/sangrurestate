import axios from "axios";

// Automatically switch between Localhost and Railway based on environment
const API_URL = import.meta.env.MODE === "development"
  ? "http://127.0.0.1:8000/api"
  : "https://sangrurestate-production.up.railway.app/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// --- PUBLIC ENDPOINTS ---
export const getProperties = () => api.get("/properties/");
export const getProperty = (id) => api.get(`/properties/${id}/`);
export const submitLead = (data) => api.post("/leads/", data);

// --- AUTHENTICATION ---
// Used in Auth.tsx
export const loginUser = (data) => api.post("/login/", data);
export const registerUser = (data) => api.post("/register/", data); 

// --- PROTECTED ENDPOINTS ---
// Used in ListProperty.tsx

// Helper to attach the token to requests
const getAuthConfig = (token) => ({
    headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data" // Important for image uploads
    }
});

export const addProperty = (formData, token) => {
    return api.post("/properties/", formData, getAuthConfig(token));
};

export const createProperty = (formData, token) => {
    // Alias for addProperty in case you used this name elsewhere
    return addProperty(formData, token);
};

export const getMyProfile = (token) => {
    return api.get("/profile/", {
        headers: { Authorization: `Bearer ${token}` }
    });
};
// Get properties posted by the logged-in user
export const getMyProperties = (token) => {
    return api.get("/properties/my-listings/", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Get properties the user has showed interest in (submitted leads)
export const getMyInterests = (token) => {
    return api.get("/leads/my-interests/", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export default api;