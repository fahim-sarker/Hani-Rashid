import { useForm } from "react-hook-form";
import plusIcon from "../../../assets/icons/plusIcon.png";
import { FiLink, FiX } from "react-icons/fi";
import uploadLogo from "../../../assets/icons/uploadLogo.png";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAxios from "@/components/Hooks/Api/UseAxios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

export function IdeaPopup({
  refetchIdeas,
  ideaData = null,
  isEdit = false,
  open,
  setOpen,

}) {
  const [uploadedVideo, setUploadedVideo] = useState([]);
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [uploadedThumbnails, setUploadedThumbnails] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const Axios = useAxios();
  const token = JSON.parse(localStorage.getItem("authToken"));

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (ideaData) {
      reset({
        portType: ideaData.port_type || "",
        name: ideaData.name || "",
        description: ideaData.description || "",
        industry: ideaData.industry || "",
        ideaStage: ideaData.idea_stage || "",
        insertVideo: ideaData.insted_video || "",
      });

      // Prefill existing images
      if (ideaData.ideaimage && ideaData.ideaimage.length > 0) {
        const pictures = ideaData.ideaimage.map((img) => ({
          id: img.id,
          preview: img.image,
          file: null,
        }));
        setUploadedPictures(pictures);
      }

      // Prefill existing videos
      if (ideaData.idea_video && ideaData.idea_video.length > 0) {
        const videos = ideaData.idea_video.map((vid) => ({
          id: vid.id,
          preview: vid.video,
          file: null,
        }));
        setUploadedVideo(videos);
      }

      if (ideaData.pdf) {
        setUploadedDocs({
          name: ideaData.pdf.split("/").pop(),
          url: ideaData.pdf,
        });
      }
    } else {
      reset({
        portType: "",
        name: "",
        description: "",
        industry: "",
        ideaStage: "",
        insertVideo: "",
      });
      setUploadedPictures([]);
      setUploadedVideo([]);
      setUploadedThumbnails([]);
      setUploadedDocs(null);
    }
  }, [ideaData, reset]);

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      if (isEdit) {
        return Axios.post(`/update-idea/${ideaData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        return Axios.post("/idea-create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Idea updated successfully" : "Idea created successfully");
      reset();
      setUploadedVideo([]);
      setUploadedPictures([]);
      setUploadedThumbnails([]);
      setUploadedDocs(null);
      setIsLoading(false);
      if (setOpen) setOpen(false);
      refetchIdeas && refetchIdeas();
      queryClient.invalidateQueries(['/show-all-idea']);

    },
    onError: (error) => {
      console.log(error);
      toast.error("Upload failed: " + error.message);
      setIsLoading(false);
    },
  });

  // ✅ Delete image/video from backend
  const handleDeleteFile = async (type, id, index) => {
    try {
      setIsLoading(true);
      await Axios.delete(`delete-idea-${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${type === "image" ? "Image" : "Video"} deleted successfully`);

      if (type === "image") {
        setUploadedPictures((prev) => prev.filter((_, i) => i !== index));
      } else if (type === "video") {
        setUploadedVideo((prev) => prev.filter((_, i) => i !== index));
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete file");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedPictures((prev) => {
      const existingFiles = new Set(
        prev.filter((f) => f.file).map((f) => f.file.name + f.file.size)
      );
      const uniqueFiles = newFiles.filter(
        (file) => !existingFiles.has(file.name + file.size)
      );
      return [
        ...prev,
        ...uniqueFiles.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
      ];
    });
  };

  const handleVideoChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedVideo((prev) => {
      const existingFiles = new Set(
        prev.filter((f) => f.file).map((f) => f.file.name + f.file.size)
      );
      const uniqueFiles = newFiles.filter(
        (file) => !existingFiles.has(file.name + file.size)
      );
      return [
        ...prev,
        ...uniqueFiles.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
      ];
    });
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("port_type", data.portType);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("industry", data.industry);
    formData.append("idea_stage", data.ideaStage);
    formData.append("insted_video", data.insertVideo);

    uploadedVideo.forEach((v) => v.file && formData.append("video[]", v.file));
    uploadedPictures.forEach((p) => p.file && formData.append("image[]", p.file));
    uploadedThumbnails.forEach((file) => formData.append("thumbnail[]", file));
    if (uploadedDocs && uploadedDocs.file) formData.append("pdf", uploadedDocs.file);

    mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && (
        <DialogTrigger asChild>
          <button className="flex gap-2 items-center px-2 sm:px-3 py-1 text-sm sm:text-base sm:py-2 rounded text-white bg-primaryGreen">
            <span>Add new Idea</span>
            <img src={plusIcon} alt="plusIcon" />
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[797px] max-h-[calc(100vh-50px)] sm:max-h-[calc(100vh-25px)] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-[22px] text-[#252C32] text-center block">
            {isEdit ? "Edit Idea" : "Create Idea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Port Type */}
          <div>
            <label className="block font-medium mb-2">Port Type</label>
            <select
              defaultValue=""
              className="block w-full px-2 py-2 border outline-none rounded"
              {...register("portType", { required: "Port type is required" })}
            >
              <option value="" disabled>
                Select Port Type
              </option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="Type 3">Type 3</option>
            </select>
            {errors.portType && (
              <span className="text-red-500 text-sm">{errors.portType.message}</span>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="After school enrichment activities"
              className="block w-full px-2 py-2 border outline-none rounded"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-2">
              Idea Description
            </label>
            <textarea
              rows={5}
              className="block text-sm w-full px-2 py-2 border outline-none rounded"
              placeholder="We offer after school clubs and enrichment activities..."
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block font-medium mb-2">Industry</label>
            <select
              defaultValue=""
              className="block w-full px-2 py-2 border outline-none rounded"
              {...register("industry", { required: "Industry is required" })}
            >
              <option value="" disabled>
                Select Industry
              </option>
              <option value="Industry 1">Industry 1</option>
              <option value="Industry 2">Industry 2</option>
              <option value="Industry 3">Industry 3</option>
            </select>
            {errors.industry && (
              <span className="text-red-500 text-sm">{errors.industry.message}</span>
            )}
          </div>

          {/* Idea Stage */}
          <div>
            <label className="block font-medium mb-2">Idea Stage</label>
            <select
              defaultValue=""
              className="block w-full px-2 py-2 border outline-none rounded"
              {...register("ideaStage", { required: "Idea stage is required" })}
            >
              <option value="" disabled>
                Select Idea Stage
              </option>
              <option value="Stage 1">Stage 1</option>
              <option value="Stage 2">Stage 2</option>
              <option value="Stage 3">Stage 3</option>
            </select>
            {errors.ideaStage && (
              <span className="text-red-500 text-sm">{errors.ideaStage.message}</span>
            )}
          </div>

          {/* Video Link */}
          <div>
            <label htmlFor="insertVideo" className="block font-medium mb-2">
              Insert Video
            </label>
            <div className="relative">
              <input
                id="insertVideo"
                type="text"
                {...register("insertVideo")}
                placeholder="Insert a video link"
                className="block w-full px-2 py-2 pr-12 border outline-none rounded"
              />
              <FiLink className="absolute right-3 top-3 text-lg" />
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <p className="block font-medium mb-2">Attach Videos (Optional)</p>
            <label htmlFor="videoUpload" className="block cursor-pointer w-full">
              <div className="text-center border bg-[#def9f1] py-2 rounded">
                <img src={uploadLogo} alt="Upload" className="mx-auto w-7 h-7" />
                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
              </div>
            </label>
            <input
              id="videoUpload"
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleVideoChange}
            />

            {uploadedVideo.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uploadedVideo.map((item, index) => (
                  <div key={index} className="relative">
                    <video
                      src={item.preview}
                      controls
                      className="w-[200px] h-[200px] rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        item.id
                          ? handleDeleteFile("video", item.id, index)
                          : setUploadedVideo((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                      }
                      className="absolute top-1 left-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                    >
                      <FiX />
                    </button>
                    {item.file && (
                      <p className="text-xs text-gray-600 mt-1 break-words">
                        {item.file.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing / New Pictures */}
          <div>
            <p className="block font-medium mb-2">Attach a Picture (Optional)</p>
            <label htmlFor="pictureUpload" className="block cursor-pointer w-full">
              <div className="text-center border bg-[#def9f1] py-2 rounded">
                <img src={uploadLogo} alt="Upload" className="mx-auto w-7 h-7" />
                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
              </div>
            </label>
            <input
              id="pictureUpload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {uploadedPictures.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-1">
                {uploadedPictures.map((item, index) => (
                  <div key={index} className="relative">
                    <img
                      src={item.preview}
                      alt={`Preview ${index}`}
                      className="max-h-[120px] w-[120px] h-full rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        item.id
                          ? handleDeleteFile("image", item.id, index)
                          : setUploadedPictures((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                      }
                      className="absolute top-1 left-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                    >
                      <FiX />
                    </button>
                    {item.file && (
                      <p className="text-xs text-gray-600 mt-1 break-words">
                        {item.file.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <p className="block font-medium mb-2">Attach a Document (Optional)</p>
            <label htmlFor="docsUpload" className="block cursor-pointer w-full">
              <div className="text-center border bg-[#def9f1] py-2 rounded">
                <img src={uploadLogo} alt="Upload" className="mx-auto w-7 h-7" />
                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
              </div>
            </label>
            <input
              id="docsUpload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) =>
                setUploadedDocs({
                  file: e.target.files[0],
                  name: e.target.files[0].name,
                })
              }
            />
            {uploadedDocs && (
              <div className="flex items-center justify-between mt-1 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-600 truncate">{uploadedDocs.name}</p>
                <button
                  onClick={() => setUploadedDocs(null)}
                  type="button"
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-5">
            <DialogClose asChild>
              <button className="bg-transparent text-gray-900 border border-gray-300 px-7 py-2 font-medium rounded-[6px] min-w-[110px]">
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="bg-primaryGreen text-white px-8 py-2 font-medium rounded-[6px] flex items-center justify-center min-h-full min-w-[110px]"
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={18} />
              ) : isEdit ? (
                "Update Idea"
              ) : (
                "Create Idea"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
