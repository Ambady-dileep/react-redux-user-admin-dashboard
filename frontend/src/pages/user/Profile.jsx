import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../services/axios";
import { toast } from "react-toastify";
import { fetchProfile } from "../../features/auth/authSlice";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ username: "", email: "", profile_image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "", profile_image: null });
      setPreview(user.profile_image || null);
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (formData.profile_image) data.append("profile_image", formData.profile_image);
      await API.patch("/users/me/", data, { headers: { "Content-Type": "multipart/form-data" } });
      await dispatch(fetchProfile());
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
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
            <img
              src={preview || "https://via.placeholder.com/100"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
          <p className="text-xs text-gray-400 mt-2">Tap to change photo</p>
        </div>

        {/* Fields */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

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