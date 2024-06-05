import { useSearchParams } from "react-router-dom";
import useCustomTitle from "../hooks/useCustomTitle";
import { apiConnector } from "../services/apiConnector";
import { FIND_DONORS } from "../services/apis";
import { useQuery } from "@tanstack/react-query";

const fetchDonors = async (page = 1, limit = 12, maxDistanceInMeters) => {
    const params = {
      page,
      limit,
    };
    if (maxDistanceInMeters) {
      params.maxDistanceInMeters = maxDistanceInMeters;
    }
  
    const data = await apiConnector("GET", FIND_DONORS, {}, {}, params);
    return data;
  };

export default function FindDonors() {

    useCustomTitle("Find Donors | Blood Connect")

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 0;
    const distance = Number(searchParams.get("distance")) || null;
    const limit = 12;

    const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
        ["donors", page, limit, distance],
        () => fetchDonors(page, limit, distance),
        {
            keepPreviousData: true,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
        }
    )

    console.log(data)

    return (
        <div>
            Find Donors
        </div>
    )
}