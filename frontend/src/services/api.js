
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

export const getWellnessDashboard = async () => {
  const response = await api.get("/api/wellness/dashboard");
  return response.data;
};

export default api;
