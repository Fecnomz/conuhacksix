import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/Card";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleCompanyInfoClick = () => {
    console.log("Company Information clicked");
  };

  const handleAgentsClick = () => {
    console.log("Agents clicked");
  };

  return (
    <div className="h-screen w-full flex bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar
        onCompanyInfoClick={handleCompanyInfoClick}
        onAgentsClick={handleAgentsClick}
      />

      {/* Main Content */}
      <div className="w-3/4 p-10">
        <h1 className="text-4xl font-extrabold mb-3">Welcome {`{companyName}`}</h1>
        <hr className="mb-4" />
        <p className="mb-8">Here is your company overview and key resources to get started.</p>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-8">
          <CardComponent
            imageSrc="https://via.placeholder.com/40"
            imageAlt="Company Logo"
            title="Company Updates"
            subtitle="companywebsite.com"
            description="Stay updated with the latest news and events within the company."
            badgeColorClass="bg-green-500"
          />

          <CardComponent
            imageSrc="https://via.placeholder.com/40"
            imageAlt="Agents"
            title="Agents Information"
            subtitle="agentdetails.com"
            description="Access important details about company agents and representatives."
            badgeColorClass="bg-red-500"
          />

          <CardComponent
            imageSrc="https://via.placeholder.com/40"
            imageAlt="Resources"
            title="Company Resources"
            subtitle="resources.com"
            description="Find the resources you need to excel in your role within the company."
            badgeColorClass="bg-yellow-500"
          />
        </div>
      </div>
    </div>
  );
}
