import { useEffect, useMemo, useRef, useState } from "react";
import RouterProviderMain from "./RouterProviderMain.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiConnector, axiosInstance } from "../services/apiConnector.js";
import { Toaster } from "react-hot-toast";
import { useUser } from "../store/useUser.js";
import { GET_USER_DETAILS } from "../services/apis.js";

// Create a client
const queryClient = new QueryClient();

export default function RootProvider() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const initialized = useRef(false);
  const { user, setUser, isAuth, setIsAuth } = useUser()

  useEffect(()=>{
    if(!initialized.current){
      initialized.current = true;
      if(isAuth && !user) {
        (async()=>{
          try {
            const data = await apiConnector('GET', GET_USER_DETAILS)
            console.log(data)
            if(!data?.data?.data?.user) {
              setIsAuth(false)
              setSessionExpired(true)
            }
            setUser(data?.data?.data?.user)
          } catch(error) {
            console.log(error)
            setIsAuth(false)
            setSessionExpired(true)
          }
        })()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useMemo(() => {
    // Add a response interceptor to catch session expiry
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === 401) {
          // Do something here
          setSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );
  }, [setSessionExpired]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!sessionExpired ? (
          <RouterProviderMain />
        ) : (
          <div>
            <h1>Session Expired</h1>
          </div>
        )}
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
