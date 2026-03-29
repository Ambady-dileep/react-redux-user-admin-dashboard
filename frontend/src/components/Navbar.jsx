import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    if (loading) return null;

    return (
        <nav className="bg-zinc-900 border-b border-zinc-800 shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-white font-bold text-lg tracking-tight">
                        <span className="text-indigo-400">User</span>Admin
                    </Link>
                    <Link to="/" className="text-zinc-400 hover:text-white text-sm transition">
                        Home
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">

                    {!user && (
                        <>
                            <Link
                                to="/login"
                                className="text-zinc-400 hover:text-white text-sm transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
                            >
                                Get started
                            </Link>
                        </>
                    )}

                    {user && (
                        <>
                            {user.is_admin && (
                                <Link
                                    to="/admin"
                                    className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg transition"
                                >
                                    Admin
                                </Link>
                            )}

                            {/* Profile link with avatar */}
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-zinc-800 transition"
                            >
                                {user?.profile_image ? (
                                    <img
                                        src={getImageUrl(user.profile_image)}
                                        alt={user.username}
                                        className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-zinc-300 text-sm hidden sm:block">
                                    {user.username}
                                </span>
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;