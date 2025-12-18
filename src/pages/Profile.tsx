import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/users.api";
import { useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name
    }
  });

  const onSubmit = async (data: ProfileForm) => {
    await updateProfile(data);

    // refresh logged-in user cache
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  if (!user) return null;

  return (
    <div className="max-w-lg p-6 mx-auto">
      <h1 className="mb-4 text-xl font-semibold">
        My Profile
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full rounded border bg-gray-100 p-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full rounded border p-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
