import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  };

  export const signupUser = async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  };

  export const getStores = async (params) => {
    const response = await api.get("/stores", {
      params,
    });
  
    return response.data;
  };

  export const rateStore = async (storeId, rating) => {
    const response = await api.post(`/stores/${storeId}/rate`, {
      rating,
    });
  
    return response.data;
  };

// 🔹 Admin APIs

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAllStoresAdmin = async () => {
  const response = await api.get("/admin/stores");
  return response.data;
};

export const addUserAdmin = async (userData) => {
  const response = await api.post("/admin/add-user", userData);
  return response.data;
};

export const addStoreAdmin = async (storeData) => {
  const response = await api.post("/admin/stores", storeData);
  return response.data;
};

export const getOwnerStores = async () => {
  const response = await api.get("/stores/owner/dashboard");
  return response.data.data;
};

export const updatePassword = async (passwordData) => {
  const response = await api.put(
    "/auth/update-password",
    passwordData
  );
  return response.data;
};

export const getStoreRatings = async (storeId) => {
  const response = await api.get(
    `/owner/stores/${storeId}/ratings`
  );

  return response.data;
};

export default api;