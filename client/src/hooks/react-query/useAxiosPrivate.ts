import { useEffect } from "react";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "@/api/axios";
import useAuth from "../useAuth";
import { useQueryClient } from "@tanstack/react-query";
// import useAuth from "../useAuth";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export default function useAxiosPrivate() {
  const refreshToken = useRefreshToken();
  // const queryClient = useQueryClient();
  const { logout } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        if (
          !config.headers["Authorization"] ||
          !config.headers["authorization"]
        ) {
          const token = localStorage.getItem("accessToken");
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
            prevRequest._retry = true;
            try {
              const newAccessToken = await refreshToken();
              if (prevRequest && prevRequest.headers) {
                // prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
  }, [refreshToken, logout]);

  return axiosPrivate;
}
