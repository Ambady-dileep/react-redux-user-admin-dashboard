import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const displayName = user?.first_name
        ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
        : user?.username || "User";

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-5">

                {/* Avatar */}
                <div className="relative">
                    {user?.profile_image ? (
                        <img
                            src={getImageUrl(user.profile_image)}
                            alt={user.username}
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                </div>

                {/* Welcome */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Welcome back ✌️</p>
                    <h1 className="text-2xl font-semibold text-gray-900">{displayName}</h1>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-500 text-sm hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                >
                    Sign Out
                </button>

            </div>
        </div>
    );
}

export default Home;