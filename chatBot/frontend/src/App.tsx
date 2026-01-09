import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const LoginPage = lazy(() => import("./pages/user/Login"));
const PrecipitationDashboard = lazy(
  () => import("./pages/user/PrecipitationDashboard")
);
const Earthquake = lazy(() => import("./pages/user/Earthquake"));
const Chatbot = lazy(() => import("./pages/user/Chatbot"));
const NotFound = lazy(() => import("./pages/user/Notfound"));
const Register = lazy(() => import("./pages/user/Register"));
const UserLayout = lazy(() => import("./components/user/UserLayout"));
const ProtectedRoute = lazy(() => import("./components/shared/ProtectedRoute"));
const Flood = lazy(() => import("./pages/user/Flood"));
const LandSlide = lazy(() => import("./pages/user/LandSlides"));
const Cyclones = lazy(() => import("./pages/user/Cyclones"));
const DashboardWeather = lazy(() => import("./pages/user/Dashboard"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Users = lazy(() => import("./pages/admin/Users"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Inbox = lazy(() => import("./pages/admin/Inbox"));
const IndividualEmail = lazy(() => import("./pages/admin/IndividualEmail"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute allowedRoles="user" />}>
            <Route path="/dashboard" element={<UserLayout />}>
              <Route index path="" element={<DashboardWeather />} />
              <Route path="rainfall" element={<PrecipitationDashboard />} />
              <Route path="earthquakes" element={<Earthquake />} />
              <Route path="floods" element={<Flood />} />
              <Route path="landslides" element={<LandSlide />} />
              <Route path="cyclones" element={<Cyclones />} />
              <Route path="chatbot" element={<Chatbot />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index path="" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path=":id" element={<IndividualEmail />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
export default App;
