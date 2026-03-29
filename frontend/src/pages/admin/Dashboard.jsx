import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../features/admin/adminSlice";

function Dashboard() {
    const dispatch = useDispatch();
    const { users, totalCount } = useSelector((state) => state.admin);

    console.log("USERS IS:", users, typeof users, Array.isArray(users));

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const adminUsers = users?.filter((u) => u.is_admin).length;
    const regularUsers = users?.filter((u) => !u.is_admin).length;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dashboard</h2>

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 text-sm mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-slate-800">{totalCount}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 text-sm mb-1">Regular Users</h3>
                    <p className="text-3xl font-bold text-slate-800">{regularUsers}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-slate-500 text-sm mb-1">Admin Users</h3>
                    <p className="text-3xl font-bold text-slate-800">{adminUsers}</p>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;