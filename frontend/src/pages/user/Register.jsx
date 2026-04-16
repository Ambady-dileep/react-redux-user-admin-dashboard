import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../services/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      else if (data?.password) setErrors((p) => ({ ...p, password: data.password[0] }));
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
              <div style={{ position: "relative" }}>
                <input
                  type={name === "password" ? (showPassword ? "text" : "password") : type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                    errors[name]
                      ? "border-red-300 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:ring-blue-200 bg-gray-50"
                  }`}
                  style={name === "password" ? { paddingRight: "2.75rem" } : {}}
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      // Eye-slash (visible → click to hide)
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      // Eye (hidden → click to show)
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
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