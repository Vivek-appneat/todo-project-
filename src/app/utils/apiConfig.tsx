import axios from "axios";

const defaultHeaders = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

type apiPath = {
  url: string;
  data?: any;
  method: string;
  headers?: any;
  noHeaders?: any;
};

export function apiClient({
  url,
  data = {},
  method = "",
  headers = {},
  noHeaders,
  ...rest
}: apiPath) {
  return new Promise(async (resolve, reject) => {
    const accessToken = localStorage.getItem("token");

    // Prepare headers with authorization
    const requestHeaders = {
      ...(noHeaders ? {} : defaultHeaders),
      ...headers,
    };

    // Add Authorization header if token exists
    if (accessToken && accessToken !== "" && accessToken !== null) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    axios({
      method,
      url,
      headers: requestHeaders,
      data,
      ...rest,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
