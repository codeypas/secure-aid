import { useNavigate } from "react-router-dom";
import { sidebarUserItems as sidebarItems } from "../../constants/sidebar";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";

const Bottombar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-12 bg-gray-100 border-t border-gray-200 flex justify-evenly items-center">
      {sidebarItems.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.href)}
          className="text-gray-800 flex flex-col items-center text-sm hover:cursor-pointer"
        >
          <item.icon className="w-5 h-5" />
        </div>
      ))}
      <div
        onClick={handleLogout}
        className="text-gray-800 flex flex-col items-center text-sm hover:cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
      </div>
    </div>
  );
};

export default Bottombar;
