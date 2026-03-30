import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../services/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    if (field === "username") {
      const t = value.trim();
      if (!t) return "Username is required.";
      if (t.length < 3 || t.length > 20) return "Must be 3–20 characters.";
      if (!/^[a-z]+$/.test(t)) return "Only lowercase letters allowed.";
    }
    if (field === "email") {
      if (!value.trim()) return "Email is required.";
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim())) return "Must be a valid @gmail.com address.";
    }
    if (field === "password") {
      if (!value) return "Password is required.";
      if (value.length < 8) return "Min 8 characters.";
      if (!/[A-Z]/.test(value)) return "Need one uppercase letter.";
      if (!/[0-9]/.test(value)) return "Need one number.";
      if (!/[^A-Za-z0-9]/.test(value)) return "Need one special character.";
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
      email: validate("email", formData.email),
      password: validate("password", formData.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setLoading(true);
      await API.post("/users/register/", formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.username) setErrors((p) => ({ ...p, username: data.username[0] }));
      else if (data?.email) setErrors((p) => ({ ...p, email: data.email[0] }));
      else toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", type: "text", placeholder: "Username" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-400 mt-1">Sign up to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {fields.map(({ name, type, placeholder }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                  errors[name]
                    ? "border-red-300 focus:ring-red-100 bg-red-50"
                    : "border-gray-200 focus:ring-blue-200 bg-gray-50"
                }`}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1.5 px-1">{errors[name]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-3 rounded-2xl text-sm transition mt-1"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium transition">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;