import { useForm } from "react-hook-form";
import { login } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuthToken } from "../context/AuthContext";
import { toastSuccess, toastError } from "../utils/toast";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { setToken } = useAuthToken();

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log("Logging in with data:", data);
      const { data: res } = await login(data);
      setToken(res.token);
      // return;
      toastSuccess("Logged in successfully");
      navigate("/");
    } catch (error) {
      toastError(error, "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-lg font-semibold text-gray-800">
          Sign In
        </h1>

        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email Address"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-5">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
          Sign In
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
