import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const API = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("access");

    const isPublicRoute =
      req.url.includes("/token/") ||
      req.url.includes("/register/");

    if (token && !isPublicRoute) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

    // 🔁 Response interceptor (handle expired token)
    API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🔥 If access token expired
        if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
        ) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
            // ❌ No refresh → force logout  
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            // 🔄 Get new access token
            const res = await axios.post(`${BASE_URL}/token/refresh/`, {
            refresh,
            });

            const newAccess = res.data.access;

            // ✅ Save new token
            localStorage.setItem("access", newAccess);

            // 🔁 Retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return API(originalRequest);
        } catch (refreshError) {
            // ❌ Refresh failed → logout
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
        }

        return Promise.reject(error);
    }
    );

    export default API;

















// Interceptors → centralized middleware for requests/responses
// isPublicRoute → prevents token from being sent to login/register
// Authorization header → only sent to protected routes