import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import ForgetPassword from "./pages/forgetPassword";
import { Toaster } from "react-hot-toast";
import Register from "./pages/register";
import AdminDashboard from "./pages/admin/adminDashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/user" element={<div>User Dashboard</div>} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
