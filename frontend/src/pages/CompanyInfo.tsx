import { useState } from "react";
import { Input, Button } from "@heroui/react";
import Sidebar from "../components/Sidebar";

const CompanyInfo = () => {
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyURI, setCompanyURI] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company Information Submitted:", {
      companyName,
      phoneNumber,
      companyURI,
      companyDescription,
    });

    // TODO: Add API request to update company information
  };

  return (
    <div className="h-screen w-full flex bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4 p-10">
        <h1 className="text-3xl font-bold mb-4">Edit Company Information</h1>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-600 mb-6"></div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Company Name */}
          <Input className="flex flex-col gap-4"
            label="Company Name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            required
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />

          {/* MongoDB URI */}
          <Input
            label="MongoDB URI"
            type="url"
            value={companyURI}
            onChange={(e) => setCompanyURI(e.target.value)}
            placeholder="Enter your MongoDB connection URI"
            required
          />

          {/* Company Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Company Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Enter your company description"
              rows={5}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            variant="solid"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all mt-4"
            type="submit"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfo;
