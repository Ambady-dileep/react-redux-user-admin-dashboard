import { useState } from "react";
import API from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateUser() {
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
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
      await API.post("/users/admin/users/create/", {
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      toast.success("User created!");
      navigate("/admin/users");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.username) setErrors((p) => ({ ...p, username: "This username is already taken." }));
      else if (data?.email) setErrors((p) => ({ ...p, email: "This email is already taken." }));
      else toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "johndoe", hint: "Lowercase letters only, 3–20 chars." },
    { name: "email", label: "Email", type: "email", placeholder: "john@gmail.com", hint: "Must be a @gmail.com address." },
    { name: "password", label: "Password", type: "password", placeholder: "Secret@123", hint: "Min 8 chars, uppercase, number, special char." },
  ];

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
     <div className="w-full max-w-md">

      <button onClick={() => navigate("/admin/users")} className="text-sm text-slate-400 hover:text-slate-600 transition mb-5">
        ← Back to Users
      </button>

      <h1 className="text-lg font-semibold text-slate-800">Create User</h1>
      <p className="text-sm text-slate-400 mb-6">Add a new user to the platform.</p>

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-100 rounded-xl p-6 space-y-4 shadow-sm">
        {fields.map(({ name, label, type, placeholder, hint }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
            <input
              type={type}
              value={formData[name]}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition ${
                errors[name]
                  ? "border-red-300 focus:ring-red-100 bg-red-50"
                  : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-300"
              }`}
            />
            <p className={`text-xs mt-1 ${errors[name] ? "text-red-500" : "text-slate-400"}`}>
              {errors[name] || hint}
            </p>
          </div>
        ))}

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default CreateUser;