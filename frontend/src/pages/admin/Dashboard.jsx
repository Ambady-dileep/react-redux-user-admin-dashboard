import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../features/admin/adminSlice";

function Dashboard() {
    const dispatch = useDispatch();
    const { users, totalCount } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const adminUsers = users?.filter((u) => u.is_admin).length;
    const regularUsers = users?.filter((u) => !u.is_admin).length;

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Dashboard</h2>
            <p className="text-sm text-slate-400 mb-6">Overview of your platform.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-slate-800">{totalCount ?? 0}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Regular Users</p>
                    <p className="text-3xl font-bold text-slate-800">{regularUsers ?? 0}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Admin Users</p>
                    <p className="text-3xl font-bold text-slate-800">{adminUsers ?? 0}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;