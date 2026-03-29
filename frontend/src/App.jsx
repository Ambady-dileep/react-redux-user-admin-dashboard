import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Home from "./pages/user/Home";
import Profile from "./pages/user/Profile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UserList";
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
      const token = localStorage.getItem("access");
      if (token) {
        dispatch(fetchProfile());
      }
    }, []);

    return (
        <BrowserRouter>
            {/* Full screen fixed layout */}
            <div className="h-screen flex flex-col overflow-hidden bg-zinc-950">

                {/* Fixed Navbar */}
                <Navbar />

                {/* Page content fills remaining height */}
                <div className="flex-1 overflow-hidden">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <Dashboard />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <UserList />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users/create"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <CreateUser />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users/:id/edit"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <EditUser />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;