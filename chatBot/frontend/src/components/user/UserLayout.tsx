import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Bottombar from "./Bottombar";

const UserLayout: React.FC = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Large screen mode */}
        <div className="hidden md:block w-56">
          <Sidebar />
        </div>
        {/* Small screen mode */}
        <div className="fixed flex justify-center bottom-0 w-full md:hidden">
          <Bottombar />
        </div>
        <main className="flex-1 bg-slate-100 md:pl-2">
          <Outlet />
          {pathname !== "/dashboard/chatbot" ? (
            <div
              className="fixed bottom-15 md:bottom-6 right-7 cursor-pointer"
              onClick={() => {
                navigate("/dashboard/chatbot");
              }}
            >
              <div className="relative w-15 h-15 z-[199]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse blur-lg"></div>
                <img src="/chatbot-logo.png" className="relative w-15 h-15" />
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
