// import { useMutation } from "@tanstack/react-query";
import axios from "@/api/axios";
// import { AxiosError } from "axios";
// import { refreshSchema } from "@/api-validator/refresh";
import useAuth from "../useAuth";
import { useMutation } from "@tanstack/react-query";
import { refreshSchema } from "@/api-validator/refresh";

// export default function useRefreshToken() {
//   const { logout, setAuthToken } = useAuth(); // Use the centralized logout function

//   const refreshMutation = useMutation({
//     mutationFn: async () => {
//       const response = await axios.post(
//         "/user/refresh",
//         {},
//         { withCredentials: true }
//       );

//       return response.data;
//     },
//     onSuccess: (data) => {
//       const resData = refreshSchema.parse(data);

//       // if (!data.success) {
//       //   throw new Error(data.message);
//       // }
//       localStorage.setItem("accessToken", data.accessToken);
//       setAuthToken(data.accessToken);
//       return resData.accessToken;
//     },
//     onError: (error: AxiosError) => {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         logout(); // Use centralized logout
//       }

//       throw error;
//     },
//   });

//   return refreshMutation.mutateAsync;
// }

export default function useRefreshToken() {
  const { logout, setAuthToken } = useAuth();

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/user/refresh",
        {},
        { withCredentials: true }
      );

      const data = refreshSchema.parse(response.data);

      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      setAuthToken(data.accessToken);
      return data.accessToken;
    },
    onError: (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
      throw error;
    },
  });
  return refreshMutation.mutateAsync;
}
