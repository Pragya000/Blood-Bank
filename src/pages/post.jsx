import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { GET_POST_DETAILS } from "../services/apis";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/core/Feed/PostCard";
import { IoArrowBack } from "react-icons/io5";
import useCustomTitle from "../hooks/useCustomTitle";

const fetchPostDetails = async (postId) => {
  const data = await apiConnector("GET", GET_POST_DETAILS + `/${postId}`);
  return data;
};

export default function Post() {

  useCustomTitle("Post | Blood Connect");

  const { postId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(
    ["post", postId],
    () => fetchPostDetails(postId),
    {
      keepPreviousData: true,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="min-h-[calc(100vh-84px)] w-11/12 max-w-[1200px] mx-auto grid place-content-center relative">
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>{error.message}</p>
      ) : data?.data?.post ? (
        <div className="w-[90vw] sm:w-[550px] ">
        <PostCard post={data?.data?.post} />
        </div>
      ) : (
        <p>Post not found</p>
      )}
    <button
        onClick={() => navigate(-1)}
     className="flex items-center gap-x-2 text-sm bg-blue-100 hover:bg-opacity-70 border-blue-500 rounded-lg text-blue-500 font-medium px-3 py-1 max-w-max absolute top-4 left-0">
        <IoArrowBack />
        <span>Back to Feed</span>
    </button>
    </div>
  );
}
