import { toast } from "react-toastify";

export const toastSuccess = (message: string) =>
  toast.success(message);

export const toastError = (error: any, fallback = "Something went wrong") => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallback;

  toast.error(message);
};

export const toastInfo = (message: string) =>
  toast.info(message);
