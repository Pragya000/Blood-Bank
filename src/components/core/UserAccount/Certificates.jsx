import { useQuery } from "@tanstack/react-query";
import { apiConnector } from "../../../services/apiConnector";
import { LIST_CERTIFICATES } from "../../../services/apis";
import RenderCertificate from "../Certificate/RenderCertificate";
import { useUser } from "../../../store/useUser";

const fetchCertificates = async () => {
    const data = await apiConnector('GET', LIST_CERTIFICATES)
    return data
  }

export default function Certificates() {

    const { data, isLoading, isError, error } = useQuery(["certificates"], fetchCertificates, {
        keepPreviousData: true,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
      });
      const {user} = useUser()

      if (isLoading) {
        return <div>Loading...</div>;
      }
    
      if (isError || !data?.data?.certificates) {
        return <div>Error: {error?.message || "Something Went Wrong!"}</div>;
      }


    return (
        <>
            <div className="pl-4 mt-4 pb-20 overflow-x-hidden">
            <h4 className="text-xl font-semibold my-4 md:ml-4">Your Certificates</h4>
            {data?.data?.certificates.map((certificate) => (
                <RenderCertificate
                key={certificate._id}
                certificate={certificate}
                userName={user?.name}
                 />
            ))}
            </div>
        </>
    )
}