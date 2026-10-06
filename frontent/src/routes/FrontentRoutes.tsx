import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import Register from "../pages/public/Register";
import Login from "../pages/public/login";

import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import UserDetails from "../pages/admin/userDeatails";
import EditUser from "../pages/admin/userEdit";
import AddUser from "../pages/admin/AddUser";

import UserDashboard from "../pages/user/Dashboard";
import UserProfile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";
import ChangePassword from "../pages/user/changePassword";
import NotFoundPage from "../pages/public/NotFoundPage";
import PublicOnlyRoute from "./PublicOnlyRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicOnlyRoute />}>
         <Route path="/" element={<LandingPage />} />
         <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
      </Route>
      {/* User routes */}
      <Route element={<ProtectedRoute/>}>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/users" element={<Users />} />
         <Route path="/admin/users/add" element={<AddUser />} />
         <Route path="/admin/users/:id/edit" element={<EditUser />} />
         <Route path="/admin/users/:id" element={<UserDetails />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
