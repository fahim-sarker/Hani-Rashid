import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ConsultancyIdeaPost from "./ConsultancyIdeaPost";
import { IdeaPopup } from "@/components/dashboard/idea/IdeaPopup";

const ConsultancyIdea = () => {
    const { data: consultancyIdeaData, isPending, isFetching, isLoading } = useQuery({
        queryKey: ['consultancyIdeaData'],
        queryFn: async () => {
            const res = await axios.get('/show-idea');
            console.log(res.data);
            return res.data;


        }
    });

    if (isPending || isFetching || isLoading) return 'Loading...';

    return (
        <>
            <div className="flex gap-2 flex-wrap p-3 sm:p-0 !pb-5 justify-center sm:justify-between items-center">
                <p className="text-xl sm:text-2xl font-medium text-[#212B36]">Recently Posted Idea</p>
                <div className="flex items-center gap-2 sm:gap-3">
                    <IdeaPopup />
                    <button className="text-sm sm:text-base sm:px-3 px-2 py-1 sm:py-2 rounded bg-slate-200 text-gray-500 border">
                        My Idea
                    </button>
                </div>
            </div>
            <hr />
            {/* All Ideas */}
            <div className="space-y-5 mt-7">
                {consultancyIdeaData?.data?.map((idea) => (
                    <ConsultancyIdeaPost key={idea.id} data={idea} />
                ))}
            </div>
        </>
    );
};

export default ConsultancyIdea;
