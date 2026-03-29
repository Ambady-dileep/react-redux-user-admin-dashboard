import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../features/admin/adminSlice";
import { Link } from "react-router-dom";

function UserList() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(search));
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setDeletingId(id);
      await dispatch(deleteUser(id));
      setDeletingId(null);
    }
  };

  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage all registered users on the platform.
        </p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition"
          />
        </div>

        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          + Create User
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {loading && deletingId === null ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading users…</p>
          </div>

        ) : userList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-4xl">👤</p>
            <p className="text-gray-500 font-medium">No users found</p>
            <p className="text-gray-400 text-sm">Try a different search or create a new user.</p>
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3.5">Username</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {userList.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">

                    {/* Username */}
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {user.username}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-500">
                      {user.email}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition"
                        >
                          ✏ Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === user.id ? (
                            <>
                              <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              Deleting…
                            </>
                          ) : (
                            "🗑 Delete"
                          )}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
              Showing {userList.length} user{userList.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;