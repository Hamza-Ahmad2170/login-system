import { axiosPrivate } from "@/api/axios";

// import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  //   const { authToken } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // config.headers = config.headers || ({} as AxiosRequestHeaders);
        const token = localStorage.getItem("accessToken");
        // if (token && !config.headers["authorization"]) {
        //   config.headers["authorization"] = `Bearer ${token}`;
        // }
        if (
          !config.headers["Authorization"] ||
          !config.headers["authorization"]
        ) {
          config.headers["Authorization"] = `Bearer ${token}`;
          config.headers["authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error instanceof AxiosError) {
          const prevRequest = error.config as CustomAxiosRequestConfig;
          if (
            error.response?.status === 401 &&
            error.response?.data?.message === "Token has expired" &&
            !prevRequest?._retry
          ) {
            try {
              prevRequest._retry = true;
              const newAccessToken = await refresh();
              if (prevRequest && prevRequest.headers) {
                prevRequest.headers[
                  "authorization"
                ] = `Bearer ${newAccessToken}`;
                prevRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
              }
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }
          return Promise.reject(error);
        }
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
}
