import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import date from "../../../assets/icons/calendar.png";
import react from "../../../assets/icons/love_react.png";
import msg from "../../../assets/icons/msg.png";
import like from "../../../assets/icons/like.png";
import commentImg from "../../../assets/icons/comment.png";
import offers from "../../../assets/icons/offers.png";
import watchList from "../../../assets/icons/watchlist.png";
import offer from "../../../assets/icons/offer.png";
import { IoIosSend } from "react-icons/io";
import useAxios from "@/components/Hooks/Api/UseAxios";

const ConsultancyIdeaDetails = () => {
    const [follow, setFollow] = useState(false);
    const { id } = useParams();
    const axios = useAxios();

    const { data, isPending, isFetching, isLoading } = useQuery({
        queryKey: ["consultancyDetailsIdea", id],
        queryFn: async () => {
            const res = await axios.get(`/idea-details/${id}`);
            return res.data?.data;
        },
    });

    if (isPending || isFetching || isLoading) return <p>Loading...</p>;

    const detailIdea = data;

    return (
        <div>
            {/* Author / Header */}
            <div className="flex px-3 mt-3 sm:mt-0 sm:px-0 items-center justify-between mb-5">
                <div className="flex gap-[10px] sm:gap-4">
                    <figure className="sm:w-16 w-12 h-12 sm:h-16 rounded-full">
                        <img
                            src={detailIdea?.user?.avatar}
                            alt="company_logo"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </figure>
                    <div>
                        <div className="flex gap-5">
                            <h3 className="text-lg sm:text-xl text-[#212B36] font-medium font-roboto">
                                {detailIdea?.user?.name}
                            </h3>
                            <button
                                onClick={() => setFollow(!follow)}
                                className="text-[#3A83CD] block text-sm sm:text-base pt-1 font-medium self-start"
                            >
                                {follow ? "Following" : "+ Follow"}
                            </button>
                        </div>
                        <h3 className="text-gray-800 sm:mt-1">{detailIdea?.industry}</h3>
                    </div>
                </div>
                <p className="text-gray-500 text-sm">{detailIdea?.time_ago}</p>
            </div>

            {/* Description */}
            <p className="text-gray-500 mb-5 px-3 sm:px-0 text-sm sm:text-base">
                {detailIdea?.description}
            </p>

            {/* Thumbnail (if exists) */}
            {detailIdea?.ideaimage?.length > 0 && (
                <figure className="w-full mb-5 rounded px-3 sm:px-0 h-[200px] sm:h-[350px]">
                    <img
                        src={detailIdea?.ideaimage[0]?.image}
                        alt="idea"
                        className="w-full h-full rounded object-cover"
                    />
                </figure>
            )}

            {/* Stats */}
            <div className="flex mt-5 px-3 sm:px-0 flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-3 sm:gap-5 items-center">
                    <button className="sm:flex hidden bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                        <img src={date} alt="" className="w-5 h-5" />
                        <span>{detailIdea?.time_ago}</span>
                    </button>
                    <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                        <img src={react} alt="" className="w-5 h-5" />
                        <span>{detailIdea?.likes_count}</span>
                    </button>
                    <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                        <img src={msg} alt="" className="w-5 h-5" />
                        <span>{detailIdea?.comments_count}</span>
                    </button>
                    <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                        <img src={offers} alt="" className="w-5 h-5" />
                        <span>{detailIdea?.share_ideas_count} offers</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex rounded px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-[10px] items-center gap-1 sm:gap-2 bg-primaryGreen text-white">
                        <img src={watchList} alt="" className="w-5 h-5" />
                        <p>Watch List</p>
                    </button>
                    <button className="flex rounded px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-[10px] items-center gap-1 sm:gap-2 bg-primaryGreen text-white">
                        <img src={offer} alt="" className="w-5 h-5" />
                        <p>Send Offer</p>
                    </button>
                </div>
            </div>

            {/* Comments */}
            <h3 className="text-xl font-medium mt-5 mb-3 px-3 sm:px-0">Comments</h3>

            <div className="bg-white p-3 sm:p-5 border rounded-lg">
                {detailIdea?.comments?.length === 0 ? (
                    <p className="text-gray-500">No comments yet.</p>
                ) : (
                    detailIdea?.comments.map((comment, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={comment?.user?.avatar}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-medium">{comment?.user?.name}</h4>
                                    <p className="text-sm text-gray-500">{comment?.time_ago}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700">{comment?.comment}</p>
                        </div>
                    ))
                )}

                {/* Add Comment */}
                <div className="flex flex-wrap items-center gap-5 sm:gap-10 mt-5">
                    <div className="flex px-4 border py-2 rounded-full gap-4 bg-[#F4F6FB] items-center">
                        <button className="flex gap-1 items-center">
                            <img src={like} alt="like" className="w-5 h-5" />
                            <p>{detailIdea?.likes_count}</p>
                        </button>
                        <button className="flex gap-1 items-center">
                            <img src={commentImg} alt="comment" className="w-5 h-5" />
                            <p>{detailIdea?.comments_count}</p>
                        </button>
                    </div>
                    <div className="relative flex-grow">
                        <textarea
                            rows={1}
                            id="commentText"
                            type="text"
                            className="border border-primaryGreen outline-none pr-16 pl-3 py-3 rounded w-full"
                            placeholder="Reply here...."
                        />
                        <button className="absolute right-3 top-3 bg-primaryGreen text-white w-7 h-7 grid place-items-center rounded">
                            <IoIosSend className="text-xl text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultancyIdeaDetails;
