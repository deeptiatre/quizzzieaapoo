import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("📡 API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const authService = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getProfile: () => API.get("/auth/profile/getprofile"),
};

export { authService };
