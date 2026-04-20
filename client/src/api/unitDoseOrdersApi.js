import axios from "axios";
import { getToken } from "../helpers/getToken";

const api = axios.create({
  baseURL: "http://localhost:5000/api/unit-dose-orders",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getPatientByCode(patientCode) {
  const { data } = await api.get(`/patient/${patientCode}`);
  return data;
}

export async function getSections() {
  const { data } = await api.get("/sections");
  return data || [];
}

export async function searchOrders(filters) {
  const { data } = await api.get("/", {
    params: filters,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        } else if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });

      return searchParams.toString();
    },
  });

  return data;
}

export async function getOrderByNo(orderNo) {
  const { data } = await api.get(`/${orderNo}`);
  return data;
}

export async function getOrderDetails(orderNo) {
  const { data } = await api.get(`/${orderNo}/details`);
  return data;
}

export async function saveOrderItems(orderNo, payload) {
  const { data } = await api.post(`/${orderNo}/save`, payload);
  return data;
}

export async function syncOrdersFromOracle() {
  const { data } = await api.post("/sync");
  return data;
}

export async function searchOrdersReport(filters) {
  const { data } = await api.get("/report", {
    params: filters,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        } else if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });

      return searchParams.toString();
    },
  });

  return data;
}
