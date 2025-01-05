import axios from "@/api/axios";
import useAuth from "./useAuth";

import { refreshSchema } from "@/api-validator/refresh";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

export default function useRefreshToken() {
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();

  const refresh = async (): Promise<string | undefined> => {
    try {
      const response = await axios.post(
        "/user/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      const data = refreshSchema.parse(response.data);

      if (!data.success) {
        throw new Error(data.message);
      }

      localStorage.setItem("accessToken", data.accessToken);
      setAuthToken(data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("accessToken");
          setAuthToken(undefined);
          navigate("/"); // Redirect to login page
          console.log(error.response?.data?.message);
        }
      }
      throw error;
    }
  };
  return refresh;
}
