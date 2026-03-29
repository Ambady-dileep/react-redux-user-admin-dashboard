import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const { user, access, initialized } = useSelector((state) => state.auth);

    if (!initialized) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400 text-sm">Loading...</p>
            </div>
        );
    }

    if (!access) return <Navigate to="/login" />;
    if (!user?.is_admin) return <Navigate to="/" />;

    return children;
}

export default AdminRoute;