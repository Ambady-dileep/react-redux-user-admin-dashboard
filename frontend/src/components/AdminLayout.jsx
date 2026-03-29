import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminLayout({ children }) {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    const navLinks = [
        {
            to: "/admin",
            label: "Dashboard",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            to: "/admin/users",
            label: "Users",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            to: "/admin/users/create",
            label: "Create User",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="flex h-full bg-slate-50">

            {/* Sidebar */}
            <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-4 mt-6">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                            >
                                <span className={isActive ? "text-indigo-500" : "text-slate-400"}>
                                    {link.icon}
                                </span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info at bottom */}
                <div className="px-3 py-4 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
                        {user?.profile_image ? (
                            <img
                                src={getImageUrl(user.profile_image)}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-700 text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;