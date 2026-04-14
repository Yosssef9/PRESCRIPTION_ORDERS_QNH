import axios from "axios";
import { getToken } from "../helpers/getToken";

const api = axios.create({
  baseURL: "http://localhost:5000/api/prescription-orders",
});
api.interceptors.request.use((config) => {
  const token = getToken();
  console.log("token", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export async function getPatientByCode(patientCode) {
  // await new Promise((resolve) => setTimeout(resolve, 2000000000));
  const { data } = await api.get(`/patient-by-code/${patientCode}`);
  return data;
}
export async function getSections() {
  const { data } = await api.get("/sections");
  console.log("getSections data", data);
  return data || [];
}
export async function searchOrders(filters) {
  const { data } = await api.get("/orders", {
    params: filters,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });

      return searchParams.toString();
    },
  });

  return data;
}
export async function getOrderByNo(orderNo) {
  const { data } = await api.get(`/orders/${orderNo}`);
  return data;
}
export async function getOrderDetails(orderNo) {
  const { data } = await api.get(`/orders/${orderNo}/details`);
  return data;
}
export async function saveOrderItems(orderNo, payload) {
  const { data } = await api.post(`/orders/${orderNo}/save`, payload);
  return data;
}

export async function syncOrdersFromOracle() {
  const { data } = await api.post("/orders/sync");
  return data;
}