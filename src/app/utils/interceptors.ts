import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("token");
    
    // Add Authorization header if token exists
    if (accessToken && accessToken !== "" && accessToken !== null) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    // Set default headers
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.log("❌ 401 Unauthorized - Clearing token and redirecting to login");
      
      // Clear token from localStorage
      localStorage.removeItem("token");
      
      // Redirect to login page if in browser
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
