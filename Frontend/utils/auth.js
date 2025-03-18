// src/utils/auth.js
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode"; // ✅ Use named import
 

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUser = () => {
  const token = getToken();
  return token ? jwtDecode(token) : null;
};

export const isAuthenticated = () => !!getToken();
