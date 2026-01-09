import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Bottombar from "../../components/admin/Bottombar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Large screen mode */}
        <div className="hidden md:block w-56">
          <Sidebar />
        </div>

        {/* Main content area with proper padding for mobile bottom bar */}
        <main className="flex-1 bg-slate-100 md:pl-2 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Small screen mode - bottom bar */}
      <div className="fixed bottom-0 w-full md:hidden z-50">
        <Bottombar />
      </div>
    </div>
  );
};

export default AdminLayout;
