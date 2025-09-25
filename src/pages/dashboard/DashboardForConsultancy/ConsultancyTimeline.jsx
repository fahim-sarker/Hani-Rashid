import ConsultancyIdeaPost from "@/components/dashboard/consultancyDashboard/ConsultancyIdeaPost";
import WhoToFollow from "@/components/dashboard/profile/WhoToFollow";


const ConsultancyTimeline = () => {
  return (
    <div>
      {/* Create post */}
      <div className="bg-white gap-[10px] sm:gap-5 rounded-lg border border-gray-100 mb-5 flex justify-between items-center p-2 sm:p-4">
        <figure className="w-12 h-12 flex-shrink-0 rounded-full">
          <img
            src="https://i.ibb.co.com/4RMKSy7m/pexels-olly-3785079.jpg"
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </figure>
        <input
          type="text"
          placeholder="Start post an idea"
          className="w-full px-3 sm:px-5 py-2 sm:py-3 outline-none border rounded"
        />
        <button className="sm:px-10 px-3 font-roboto py-2 sm:py-3 rounded-[5px] shadow text-white bg-primaryGreen">
          Post
        </button>
      </div>

      {/* All Posts */}
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 2xl:col-span-9 space-y-6 sm:space-y-8 bg-white p-3 sm:p-5 rounded-lg shadow-lg">
          <ConsultancyIdeaPost />
        </div>
        <div className="lg:col-span-4 2xl:col-span-3">
          <WhoToFollow />
        </div>
      </div>
    </div>
  );
};

export default ConsultancyTimeline;
