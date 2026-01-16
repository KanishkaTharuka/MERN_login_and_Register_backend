import { Link, Route, Routes } from "react-router-dom";
import UserManagement from "./userManagement.jsx";

export default function AdminDashboard() {
  return (
    <div className="h-screen w-full flex bg-gray-100">
      {/* Sidebar */}
      <div className="h-full w-[260px] bg-white shadow-lg flex flex-col">
        <div className="p-6 text-xl font-bold border-b">Admin Dashboard</div>

        <nav className="flex flex-col p-4 space-y-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/settings"
            className="px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium"
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<h1>Dashboard</h1>} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}
