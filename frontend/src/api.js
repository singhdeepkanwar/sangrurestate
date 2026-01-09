import axios from "axios";

// Automatically detects if running locally or on Vercel
const API_URL = import.meta.env.MODE === "development"
  ? "http://127.0.0.1:8000/api"  // Local Django
  : "https://sangrurestate-production.up.railway.app/api"; // Production Django

export const getProperties = () => axios.get(`${API_URL}/properties/`);
// ... rest of your file
// --- AUTHENTICATION ---

export const register = (formData) => axios.post(`${API_URL}/register/`, formData);

// Django returns { access: "...", refresh: "..." }
export const login = (formData) => axios.post(`${API_URL}/login/`, formData);

// Get currently logged-in user details
export const getMyProfile = (token) => {
  return axios.get(`${API_URL}/users/me/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- PROPERTIES ---

export const addProperty = (formData, token) => {
  return axios.post(`${API_URL}/properties/`, formData, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      // Axios sets multipart boundary automatically when passing FormData
      'Content-Type': 'multipart/form-data' 
    }
  });
};

// --- LEADS (Buying Inquiries) ---

// Public: Submit interest in a property
export const submitLead = (data) => axios.post(`${API_URL}/leads/`, data);

// Private: View leads (for admins/owners)
export const getLeads = (token) => {
  return axios.get(`${API_URL}/leads/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- CONTACT US ---

// Public: General contact form
export const submitContact = (data) => axios.post(`${API_URL}/contact/`, data);
export const getProperty = (id) => axios.get(`${API_URL}/properties/${id}/`);