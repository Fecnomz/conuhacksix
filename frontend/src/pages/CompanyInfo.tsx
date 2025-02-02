import { useState, useEffect } from "react";
import { Input, Button, Alert } from "@heroui/react";
import Sidebar from "../components/Sidebar";

const CompanyInfo = () => {
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyURI, setCompanyURI] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/auth/company-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompanyName(data.companyName || "");
        setPhoneNumber(data.phoneNumber || "");
        setCompanyURI(data.companyURI || "");
        setCompanyDescription(data.companyDescription || "");
      })
      .catch((err) => console.error("Error fetching company info:", err));
  }, []);

  const handlePhoneNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // Allow only digits
    setPhoneNumber(e.currentTarget.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    fetch("http://localhost:5000/auth/company-info", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        companyName,
        phoneNumber,
        companyURI,
        companyDescription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) throw new Error("Update failed");
        setMessage("Company information updated successfully.");
        setTimeout(() => {
            setMessage("");
          }, 3000);
      })
      .catch((err) => {
        setError("Failed to update company information.");
        console.error(err);
        setTimeout(() => {
            setError("");
          }, 3000);
      });
  };

  return (
    <div className="h-screen w-full flex bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4 p-10">
        <h1 className="text-3xl font-bold mb-4" style={{userSelect: "none"}}>Edit Company Information</h1>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-600 mb-6"></div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Company Name */}
          <Input
            label="Company Name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onInput={handlePhoneNumberInput}
            required
          />

          {/* MongoDB URI */}
          <Input
            label="MongoDB URI"
            type="url"
            value={companyURI}
            onChange={(e) => setCompanyURI(e.target.value)}
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
              rows={5}
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            variant="solid"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all mt-4"
            type="submit"
            style={{userSelect: "none"}}
          >
            Save Changes
          </Button>

          <Alert className="fixed top-4 right-4 max-w-md w-full shadow-md"
          style={{userSelect: "none"}}
          color="success"
          description={"Company information updated successfully."}
          isVisible={message ? true : false}
          title={"Success!"}
          variant="faded"
          onClose={() => setMessage("")}
        />

        <Alert className="fixed top-4 right-4 max-w-md w-full shadow-md"
          style={{userSelect: "none"}}
          color="danger"
          description={"Failed to update company information."}
          isVisible={error ? true : false}
          title={"Error!"}
          variant="faded"
          onClose={() => setMessage("")}
        />
        </form>
      </div>
    </div>
  );
};

export default CompanyInfo;
