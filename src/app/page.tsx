"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setToken } from "@/redux/slices/authSlice";
import { loginApi } from "@/app/utils/api";
import { AxiosResponse } from "axios";
import { useAppDispatch } from "@/redux/hook";

type LoginResponse = {
  accessToken: string;
  message?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status: number;
  };
  request?: XMLHttpRequest;
  message: string;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username and password are required");
      setLoading(false);
      return;
    }

    loginApi(username, password)
      .then((res) => {
        const response = res as AxiosResponse<LoginResponse>;
        const token = response?.data?.accessToken;

        if (token && token !== "undefined" && token !== "null") {
          dispatch(setToken(token)); // Redux in token set
          console.log("Login successful");
          router.push("/dashboard");
        } else {
          debugger
          setErrorMsg(response?.data?.message || "Invalid credentials");
        }
      })
      .catch((err: ApiError) => {
        debugger
        console.error("Login error", err);

        if (err.response) {
          debugger
          setErrorMsg(
            err.response.data?.message ||
              `Error ${err.response.status}: Login failed`
          );
        } else if (err.request) {
          debugger
          setErrorMsg("Network error Unable to connect to server");
        } else {
          debugger
          setErrorMsg(err.message || "Login failed");
        }
      })
      .finally(() => {
        debugger
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
