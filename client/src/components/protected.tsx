// import { axiosPrivate } from "@/api/axios";
// import useAuth from "@/hooks/useAuth";
// import { useNavigate } from "react-router";
import useAxiosPrivate from "@/hooks/react-query/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Protected() {
  const axiosPrivateInstance = useAxiosPrivate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["protected"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get("/user/protected");

      return response.data;
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  // useEffect(() => {
  //   // let isMounted = true;
  //   const controller = new AbortController();
  //   const fetchData = async () => {
  //     try {
  //       await axiosPrivateInstance.get("/user/protected", {
  //         signal: controller.signal,
  //       });
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.log(error.message);
  //       }
  //     }
  //   };
  //   fetchData();
  //   return () => {
  //     // isMounted = false;
  //     controller.abort();
  //   };
  // }, [axiosPrivateInstance]);

  return <h1 className="text-7xl">Protected</h1>;
}
