import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const validate = (field, value) => {
    if (field === "username") {
      if (!value.trim()) return "Username is required.";
      if (value.trim().length < 3) return "Must be at least 3 characters.";
    }

    if (field === "password") {
      if (!value) return "Password is required.";
      if (value.length < 8) return "Must be at least 8 characters.";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      username: validate("username", formData.username),
      password: validate("password", formData.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    const result = await dispatch(login(formData));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Login successful");
      await dispatch(fetchProfile());
      navigate("/");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.username
                  ? "border-red-300 focus:ring-red-100 bg-red-50"
                  : "border-gray-200 focus:ring-blue-200 bg-gray-50"
              }`}
            />

            {errors.username && (
              <p className="text-red-500 text-xs mt-1.5 px-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded-2xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? "border-red-300 focus:ring-red-100 bg-red-50"
                    : "border-gray-200 focus:ring-blue-200 bg-gray-50"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye Slash
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 px-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-3 rounded-2xl text-sm transition mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;