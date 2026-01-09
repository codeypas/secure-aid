import type React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { sidebarAdminItems as sidebarItems } from "../../constants/sidebar";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <div
      id="drawer-navigation"
      className="fixed top-0 left-0 z-40 w-60 h-screen p-4 overflow-y-auto bg-white border-r border-gray-200 shadow-sm transition-all duration-300"
      tabIndex={-1}
      aria-labelledby="drawer-navigation-label"
    >
      <div className="py-4 px-2 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Disaster Management System
        </h2>
      </div>

      <div className="py-2">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.href;

            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.href)}
                  className={`flex items-center w-full p-2.5 text-left rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    } hover:cursor-pointer`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-4 transition-colors ${
                      isActive ? "text-gray-900" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      item.label === "Flood" ||
                      item.label === "Landslide" ||
                      item.label === "Cyclone"
                        ? "ml-4"
                        : "mr-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 w-full hover:cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
