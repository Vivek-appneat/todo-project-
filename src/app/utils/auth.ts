// Authentication utility functions

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token !== "" && token !== "undefined";
};

export const logout = (): void => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};
