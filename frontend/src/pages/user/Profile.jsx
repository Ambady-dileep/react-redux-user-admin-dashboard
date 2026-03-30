import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../services/axios";
import { toast } from "react-toastify";
import { fetchProfile } from "../../features/auth/authSlice";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ username: "", email: "", profile_image: null });
  const [errors, setErrors] = useState({ username: "", email: "", profile_image: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "", profile_image: null });
      setPreview(user.profile_image || null);  // keep exactly as original
    }
  }, [user]);

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
    if (field === "profile_image") {
      if (!value) return "";
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(value.type)) return "Only JPG, PNG or WEBP allowed.";
      if (value.size > 2 * 1024 * 1024) return "Image must be under 2MB.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const error = validate("profile_image", file);
    setErrors((prev) => ({ ...prev, profile_image: error }));
    if (error) return;
    setFormData((prev) => ({ ...prev, profile_image: file }));
    setPreview(URL.createObjectURL(file));  // blob preview for new upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      username: validate("username", formData.username),
      email: validate("email", formData.email),
      profile_image: validate("profile_image", formData.profile_image),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("username", formData.username.trim().toLowerCase());
      data.append("email", formData.email.trim().toLowerCase());
      if (formData.profile_image) data.append("profile_image", formData.profile_image);
      await API.patch("/users/me/", data, { headers: { "Content-Type": "multipart/form-data" } });
      await dispatch(fetchProfile());
      toast.success("Profile updated!");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.username) setErrors((p) => ({ ...p, username: data.username[0] }));
      else if (data?.email) {
        const msg = data.email[0];
        setErrors((p) => ({ ...p, email: msg.toLowerCase().includes("exist") ? "This email is already in use." : msg }));
      }
      else toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <label className="cursor-pointer group relative">
            {preview ? (
  <img
    src={preview}
    alt="profile"
    className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
  />
) : (
  <div className="w-20 h-20 rounded-full bg-blue-50 ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all flex items-center justify-center text-blue-400 text-2xl font-bold">
    {user?.username?.charAt(0).toUpperCase()}
  </div>
)}
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" />
          </label>
          <p className="text-xs text-gray-400 mt-2">Tap to change photo</p>
          {errors.profile_image && <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">

          <div>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.username
                  ? "border-red-300 focus:ring-red-100 bg-red-50"
                  : "border-gray-200 focus:ring-blue-200 bg-gray-50"
              }`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1.5 px-1">{errors.username}</p>}
          </div>

          <div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full border rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-300 focus:ring-red-100 bg-red-50"
                  : "border-gray-200 focus:ring-blue-200 bg-gray-50"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 px-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-3 rounded-2xl text-sm transition mt-1"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Profile;