import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreList from "./pages/StoreList";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword";



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <StoreList />
            </ProtectedRoute>
          }
        />
<Route
  path="/update-password"
  element={<UpdatePassword />}
/>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;