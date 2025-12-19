import { useForm } from "react-hook-form";
import { login } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuthToken } from "../context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { setToken } = useAuthToken();


  const onSubmit = async (data: LoginForm) => {
    console.log("Logging in with data:", data);
    const { data: res } = await login(data);
    setToken(res.token); 
    // return;
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-xl font-semibold text-center">
          Login
        </h1>

        <div className="mb-3">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mb-4">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full rounded border p-2"
          />
        </div>

        <button className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
          Login
        </button>

        {/* ✅ Toggle to Register */}
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
