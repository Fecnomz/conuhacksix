import { Button } from "@heroui/react";
import { ThemeSwitch } from "../components/theme-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  logoText?: string;
  onAgentsClick?: () => void;
}

export default function Sidebar({
  logoText = "LOGO",
  onAgentsClick,
}: SidebarProps) {
  const navigate = useNavigate(); // Initialize navigation

  const handleCompanyInfoClick = () => {
    navigate("/companyinfo"); // Redirect to /companyinfo page
  };

  const handleLogout = () => {
    // Clear user data and redirect to login page
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-1/4 h-full bg-blue-900 text-white flex flex-col py-10 px-6 shadow-lg relative">
      {/* Top Section */}
      <div>
        {/* Logo Section */}
        <div className="w-20 h-20 rounded-full bg-gray-400 mb-6 flex items-center justify-center text-2xl font-bold">
          {logoText}
        </div>

        {/* Buttons */}
        <Button
          variant="solid"
          className="w-full py-2.5 rounded-md bg-white text-blue-800 font-medium hover:bg-gray-100 transition-all shadow-sm"
          onPress={handleCompanyInfoClick}
        >
          Company Information
        </Button>
        <Button
          variant="solid"
          className="w-full py-2.5 rounded-md bg-white text-blue-800 font-medium hover:bg-gray-100 transition-all shadow-sm mt-4"
          onPress={onAgentsClick}
        >
          Agents
        </Button>
      </div>

      {/* Spacer to push content up */}
      <div className="flex-grow"></div>

      {/* Theme Switch and Logout positioned at the bottom-right */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3">
        {/* Theme Switch */}
        <ThemeSwitch />

        {/* Logout Icon */}
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          style={{ color: "#ea5149", cursor: "pointer" }}
          size="lg"
          onClick={handleLogout}
        />
      </div>

      {/* Footer Section aligned with ThemeSwitch */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-300">
        <p>&copy; 2025 Company Name</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}
