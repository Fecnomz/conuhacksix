import { Button } from "@heroui/react";
import { ThemeSwitch } from "../components/theme-switch";

interface SidebarProps {
  logoText?: string;
  onCompanyInfoClick?: () => void;
  onAgentsClick?: () => void;
}

export default function Sidebar({
  logoText = "LOGO",
  onCompanyInfoClick,
  onAgentsClick,
}: SidebarProps) {
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
          onClick={onCompanyInfoClick}
        >
          Company Information
        </Button>
        <Button
          variant="solid"
          className="w-full py-2.5 rounded-md bg-white text-blue-800 font-medium hover:bg-gray-100 transition-all shadow-sm mt-4"
          onClick={onAgentsClick}
        >
          Agents
        </Button>
      </div>

      {/* Spacer to push content up */}
      <div className="flex-grow"></div>

      {/* Theme Switch positioned at the bottom-right */}
      <div className="absolute bottom-4 right-4">
        <ThemeSwitch />
      </div>

      {/* Footer Section aligned with ThemeSwitch */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-300">
        <p>&copy; 2025 Company Name</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}