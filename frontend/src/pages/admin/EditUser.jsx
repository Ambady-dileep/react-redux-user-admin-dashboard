import { useEffect, useState } from "react";
import API from "../../services/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "" });
  const [originalData, setOriginalData] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/users/admin/users/${id}/`);
        const { username, email } = res.data;
        setFormData({ username, email });
        setOriginalData({ username, email });
      } catch {
        toast.error("Failed to load user");
        navigate("/admin/users");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  const validateUsername = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Username is required.";
    if (trimmed.length < 3) return "Username must be at least 3 characters.";
    if (trimmed.length > 20) return "Username must be at most 20 characters.";
    if (/\s/.test(trimmed)) return "Username cannot contain spaces.";
    if (!/^[a-z]+$/.test(trimmed))
      return "Only lowercase letters (a–z) allowed. No numbers or special characters.";
    return "";
  };

  const validateEmail = (value) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return "Email is required.";
    const gmailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@gmail\.com$/;
    if (!gmailRegex.test(trimmed)) return "Email must be a valid @gmail.com address.";
    const localPart = trimmed.split("@")[0];
    if (/\.{2,}/.test(localPart)) return "Email cannot contain consecutive dots.";
    return "";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = field === "username" ? validateUsername(value) : validateEmail(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUsername = formData.username.trim().toLowerCase();
    const cleanEmail = formData.email.trim().toLowerCase();

    const usernameError = validateUsername(cleanUsername);
    const emailError = validateEmail(cleanEmail);

    if (usernameError || emailError) {
      setErrors({ username: usernameError, email: emailError });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (cleanUsername === originalData.username && cleanEmail === originalData.email) {
      toast.info("No changes detected.");
      return;
    }

    try {
      setLoading(true);
      await API.put(`/users/admin/users/${id}/update/`, {
        username: cleanUsername,
        email: cleanEmail,
      });
      toast.success("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      const serverData = err?.response?.data;
      if (serverData?.username) {
        setErrors((prev) => ({ ...prev, username: serverData.username[0] }));
        toast.error(`Username: ${serverData.username[0]}`);
      } else if (serverData?.email) {
        setErrors((prev) => ({ ...prev, email: serverData.email[0] }));
        toast.error(`Email: ${serverData.email[0]}`);
      } else {
        toast.error("Update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading user data…</p>
        </div>
      </div>
    );
  }

  // ─── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
     <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition mb-4"
          >
            ← Back to Users
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
          <p className="text-sm text-gray-400 mt-1">
            Update the user's username or email address.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <input
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="e.g. johndoe"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-400 focus:ring-red-200 bg-red-50"
                    : "border-gray-200 focus:ring-green-200 focus:border-green-400 bg-white"
                }`}
              />
              {errors.username ? (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.username}
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1.5">
                  Only lowercase letters (a–z), 3–20 characters, no spaces or numbers.
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="e.g. john@gmail.com"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200 bg-red-50"
                    : "border-gray-200 focus:ring-green-200 focus:border-green-400 bg-white"
                }`}
              />
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.email}
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1.5">
                  Must be a valid @gmail.com address.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!errors.username || !!errors.email}
                className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update User"
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default EditUser;
