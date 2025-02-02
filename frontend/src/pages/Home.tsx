import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import CardComponent from "../components/Card";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-900 text-white flex flex-col py-8 px-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 mb-8"></div>

        <Button
          variant="solid"
          className="w-full mb-4 py-3 rounded-lg bg-white text-blue-900 font-semibold hover:bg-gray-200 transition-all shadow-md"
        >
          Company Information
        </Button>
        <Button
          variant="solid"
          className="w-full py-3 rounded-lg bg-white text-blue-900 font-semibold hover:bg-gray-200 transition-all shadow-md"
        >
          Agents
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Welcome {`{companyName}`}</h1>
        <hr className="mb-4" />
        <p className="text-gray-600 mb-8">Company description</p>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-6">
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
