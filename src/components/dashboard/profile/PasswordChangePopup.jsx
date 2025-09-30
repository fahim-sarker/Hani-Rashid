import useAxios from "@/components/Hooks/Api/UseAxios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import PasswordStrengthBar from "react-password-strength-bar";

export function PasswordChangePopup() {
  const [open, setOpen] = useState(false);
  const Axiosinstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const password = watch("password");
  const token = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("authToken") || "null")
    : null;

  const onSubmit = async (data) => {
    try {
      const response = await Axiosinstance.post(
        "change-password",
        {
          current_password: data.current_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
        {
          headers: {
            accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response?.status === 200) {
        toast.success("Password changed successfully");
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#0B2948] flex gap-2 items-center text-white px-3 sm:px-4 py-2 sm:py-3 rounded sm:rounded-lg">
          Change Password
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[797px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center block">
            Change password
          </DialogTitle>
          <DialogDescription className="text-center mb-5">
            Enter your new password below to complete
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Old password */}
          <div className="mb-4">
            <label htmlFor="current_password" className="text-lg block font-medium mb-2">
              Old Password
            </label>
            <div className="relative">
              <input
                id="current_password"
                type={showOldPassword ? "text" : "password"}
                {...register("current_password", { required: "Old Password is required" })}
                placeholder="Password here"
                className="bg-transparent outline-none border p-3 mb-2 rounded block w-full border-gray-300"
              />
              <span
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute cursor-pointer right-4 top-4"
              >
                {showOldPassword ? <IoEyeOutline className="text-xl" /> : <IoEyeOffOutline className="text-xl" />}
              </span>
            </div>
            {errors.current_password && <span className="text-red-500">{errors.current_password.message}</span>}
          </div>

          {/* New password */}
          <div className="mb-4">
            <label htmlFor="password" className="text-lg block font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}/,
                    message: "Password must be 6-15 characters, include uppercase, lowercase, and a number.",
                  },
                })}
                placeholder="Password here"
                className="bg-transparent outline-none border p-3 mb-2 rounded block w-full border-gray-300"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 top-4"
              >
                {showPassword ? <IoEyeOutline className="text-xl" /> : <IoEyeOffOutline className="text-xl" />}
              </span>
            </div>
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          {/* Confirm password */}
          <div className="mb-4">
            <label htmlFor="password_confirmation" className="text-lg block font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                {...register("password_confirmation", {
                  required: "Confirm Password is required",
                  validate: (value) => value === getValues("password") || "Passwords do not match",
                })}
                placeholder="Password here"
                className="bg-transparent outline-none border p-3 mb-2 rounded block w-full border-gray-300"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-4 top-4"
              >
                {showConfirmPassword ? <IoEyeOutline className="text-xl" /> : <IoEyeOffOutline className="text-xl" />}
              </span>
            </div>
            {errors.password_confirmation && <span className="text-red-500">{errors.password_confirmation.message}</span>}
          </div>

          {/* Password strength bar */}
          <div className="w-full pt-2">
            <PasswordStrengthBar className="strengthBar" password={password} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-5 w-full block mt-5 mx-auto py-3 text-center rounded shadow bg-primaryGreen text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
