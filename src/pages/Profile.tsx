import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/users.api";
import { useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "../utils/toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name,
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);

      // refresh logged-in user cache
      toastSuccess("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    } catch (error) {
      toastError(error, "Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-lg font-semibold text-gray-800">
        Profile Details
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            value={user.email}
            disabled
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
