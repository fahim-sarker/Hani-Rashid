import dateIcon from "../../../assets/icons/calendar.png";
import react from "../../../assets/icons/love_react.png";
import msg from "../../../assets/icons/msg.png";
import offers from "../../../assets/icons/offers.png";
import watchList from "../../../assets/icons/watchlist.png";
import offerIcon from "../../../assets/icons/offer.png";
import download from "../../../assets/icons/download.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { IdeaPopup } from "@/components/dashboard/idea/IdeaPopup";
import useFetchData from "@/components/Hooks/Api/UseFetchData";
import toast from "react-hot-toast";
import useAxios from "@/components/Hooks/Api/UseAxios";

const ConsultancyIdeaPost = ({ data, refetchIdeas }) => {
    const [open, setOpen] = useState(false);
    const [openIdeaPopup, setOpenIdeaPopup] = useState(false);
    const menuRef = useRef();
    const Axios = useAxios();

    console.log("hello data", data);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const handleEdit = () => {
        setOpen(false);
        setOpenIdeaPopup(true);
    };

    const handleDelete = async () => {
        setOpen(false);
        try {
            await Axios.delete(`/delete-idea/${data.id}`);
            toast.success("Idea deleted successfully");
            refetchIdeas();
        } catch (error) {
            toast.error("Failed to delete idea");
            console.error(error);
        }
    };
    const {
        id,
        name,
        description,
        created_at_diff,
        likes_count,
        comments_count,
        followers_count,
        ideaimage,
    } = data;

    const token = JSON.parse(localStorage.getItem("authToken"));
    const { data: userData } = useFetchData("/me", token);

    const thumbnail = ideaimage?.[0]?.image;
    const company_logo = userData?.data?.avatar;
    const company_name = userData?.data?.name;

    return (
        <>
            <div className="bg-white shadow p-3 sm:p-5 rounded-lg grid lg:grid-cols-12 gap-5 2xl:gap-7">
                <div className="lg:col-span-4 2xl:col-span-3">
                    <figure className="h-[200px] sm:h-[300px] rounded">
                        <img
                            src={thumbnail}
                            alt="thumbnail"
                            className="w-full h-full object-cover rounded"
                        />
                    </figure>
                </div>

                <div className="lg:col-span-8 2xl:col-span-9">
                    <div className="flex justify-between relative">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                            <figure className="w-12 h-12 sm:w-14 sm:h-14 rounded-full">
                                <img
                                    src={company_logo}
                                    alt="company_logo"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </figure>
                            <h3 className="font-medium text-lg sm:text-xl">{company_name}</h3>
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <FiMoreVertical size={20} />
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={handleEdit}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <Link to={`/dashboard/consultancyFirms/ideaDetails/${id}`}>
                        <h3 className="text-[#212B36] font-medium text-lg sm:text-[22px] mb-2">
                            {name}
                        </h3>
                    </Link>

                    <p className="text-[#797676] text-sm sm:text-base mb-3">
                        {description.slice(0, 220)}
                        <span className="text-xl">........</span>
                    </p>

                    <button className="flex items-center gap-2 bg-[#E0FFF6] border border-primaryGreen px-3 py-1 text-sm sm:text-base sm:px-4 sm:py-2 rounded-full">
                        <img src={download} alt="download" />
                        <span className="text-gray-600">PDF</span>
                    </button>

                    <div className="flex flex-wrap gap-5 mt-3 sm:mt-5 justify-between items-center">
                        <div className="flex gap-4 sm:gap-5 items-center">
                            <button className="sm:flex hidden bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                                <img src={dateIcon} alt="" className="w-5 h-5" />
                                <span>{created_at_diff}</span>
                            </button>

                            <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                                <img src={react} alt="" className="w-5 h-5" />
                                <span>{likes_count}K</span>
                            </button>

                            <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                                <img src={msg} alt="" className="w-5 h-5" />
                                <span>{comments_count}K</span>
                            </button>

                            <button className="flex bg-[#F4F6FB] px-2 py-1 text-xs sm:px-4 sm:py-2 rounded-full border-gray-100 shadow-sm border gap-1 sm:text-sm text-gray-700 items-center">
                                <img src={offers} alt="" className="w-5 h-5" />
                                <span>{followers_count} offers</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex rounded px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-[10px] items-center gap-1 sm:gap-2 bg-primaryGreen text-white">
                                <img src={watchList} alt="" className="w-5 h-5" />
                                <p>Watch List</p>
                            </button>

                            <button className="flex rounded px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-[10px] items-center gap-1 sm:gap-2 bg-primaryGreen text-white">
                                <img src={offerIcon} alt="" className="w-5 h-5" />
                                <p>Sent Offer</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {openIdeaPopup && (
                <IdeaPopup
                    isEdit={true}
                    open={openIdeaPopup}
                    setOpen={setOpenIdeaPopup}
                    ideaData={data}
                    refetchIdeas={refetchIdeas}

                />
            )}
        </>
    );
};

export default ConsultancyIdeaPost;
