import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ConsultancyIdeaPost from "./ConsultancyIdeaPost";
import { IdeaPopup } from "@/components/dashboard/idea/IdeaPopup";
import useAxios from "@/components/Hooks/Api/UseAxios";

const ConsultancyIdea = () => {
    const axiosInstance = useAxios();
    const [open, setOpen] = useState(false); // ✅ control popup state

    const { data: consultancyIdeaData, isLoading, refetch } = useQuery({
        queryKey: ["consultancyIdeaData"],
        queryFn: async () => {
            const res = await axiosInstance.get("/show-idea");
            return res.data;
        },
    });

    if (isLoading) return "Loading...";

    return (
        <>
            <div className="flex gap-2 flex-wrap p-3 sm:p-0 !pb-5 justify-center sm:justify-between items-center">
                <p className="text-xl sm:text-2xl font-medium text-[#212B36]">
                    Recently Posted Idea
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* ✅ pass open, setOpen, and refetchIdeas */}
                    <IdeaPopup open={open} setOpen={setOpen} refetchIdeas={refetch} />
                    <button className="text-sm sm:text-base sm:px-3 px-2 py-1 sm:py-2 rounded bg-slate-200 text-gray-500 border">
                        My Idea
                    </button>
                </div>
            </div>

            <hr />

            <div className="space-y-5 mt-7">
                {consultancyIdeaData?.data?.map((idea) => (
                    <ConsultancyIdeaPost
                        key={idea.id}
                        data={idea}
                        refetchIdeas={refetch}
                    />
                ))}
            </div>
        </>
    );
};

export default ConsultancyIdea;
