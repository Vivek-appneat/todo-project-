import axios, {
  Method,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";

const defaultHeaders: RawAxiosRequestHeaders = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

type ApiPath<T = unknown> = {
  url: string;
  data?: T;
  method: Method;
  headers?: RawAxiosRequestHeaders;
  noHeaders?: boolean;
};

export function apiClient<T = unknown>({
  url,
  data = {} as T,
  method = "GET",
  headers = {},
  noHeaders = false,
  ...rest
}: ApiPath<T>): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    const accessToken = localStorage.getItem("token");

    const requestHeaders: RawAxiosRequestHeaders = {
      ...(noHeaders ? {} : defaultHeaders),
      ...headers,
    };

    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    axios({
      method,
      url,
      headers: requestHeaders,
      data,
      ...rest,
    })
      .then(resolve)
      .catch(reject);
  });
}
