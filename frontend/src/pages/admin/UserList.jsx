import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchUserStats, deleteUser } from "../../features/admin/adminSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

function UserList() {
  const dispatch = useDispatch();
  const { users, loading, stats, searchCount } = useSelector((state) => state.admin);

  const [search, setSearch]         = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage]             = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const debounceRef = useRef(null);
  const searchRef   = useRef("");

  useEffect(() => {
    dispatch(fetchUserStats());
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    const isSearchChange = searchRef.current !== search;
    searchRef.current = search;

    if (isSearchChange) {
      debounceRef.current = setTimeout(() => {
        dispatch(fetchUsers({ search, page }));
      }, 400);
    } else {
      dispatch(fetchUsers({ search, page }));
    }

    return () => clearTimeout(debounceRef.current);
  }, [search, page]);

const handleSearchChange = (e) => {
  const raw = e.target.value;
  setInputValue(raw);
  setSearch(raw.trim());
  setPage(1);
};

  const totalPages = Math.ceil(searchCount / PAGE_SIZE);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const result = await dispatch(deleteUser(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("User deleted successfully.");
      dispatch(fetchUserStats());
      if (users.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        dispatch(fetchUsers({ search, page }));
      }
    } else {
      toast.error(result.payload?.error || "Failed to delete user.");
    }
    setDeletingId(null);
  };

  const confirmDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">
            Are you sure you want to delete this user?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { closeToast(); handleDelete(id); }}
              className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-800">User Management</h1>
        <p className="text-sm text-slate-400 mt-1">Manage all registered users on the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search users..."
          value={inputValue}
          onChange={handleSearchChange}
          className="flex-1 max-w-sm px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white transition"
        />
        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + Create User
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && deletingId === null ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading users…</p>
          </div>

        ) : userList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-3xl">👤</p>
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-slate-400 text-sm">Try a different search or create a new user.</p>
          </div>

        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wide">
                    <th className="px-5 py-3.5">Username</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {userList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-700">{user.username}</td>
                      <td className="px-5 py-3.5 text-slate-400">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => confirmDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === user.id ? (
                              <span className="flex items-center gap-1">
                                <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                Deleting…
                              </span>
                            ) : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Showing {userList.length} of {searchCount} user{searchCount !== 1 ? "s" : ""}
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2.5 py-1 rounded-lg text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2.5 py-1 rounded-lg text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserList;