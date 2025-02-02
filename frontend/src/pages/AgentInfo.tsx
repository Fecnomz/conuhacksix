import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button } from "@heroui/react";
import Sidebar from "../components/Sidebar";

interface AgentDetails {
  id: string;
  avatar: string;
  name: string;
  phoneNumber: string;
  description: string;
  prompt: string;
  initialResponse: string;
  status: boolean;
}

const AgentInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agentId = id ? parseInt(id, 10) : null;
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();

  useEffect(() => {
    if (agentId !== null && !isNaN(agentId)) {
      fetch(`http://localhost:5000/auth/agents/${agentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: AgentDetails) => {
          setAgent(data);
          setAvatarPreview(data.avatar);
        })
        .catch((err) => console.error("Error fetching agent:", err));
    }
  }, [agentId]);  

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setAgent((prevAgent) => prevAgent && { ...prevAgent, avatar: imageUrl });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated agent details:", agent);
    // TODO: Add an API call to upload the file and update the agent's information.
  };

  if (!agent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full flex bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Sidebar />
      <div className="w-3/4 p-10">
        <h1 className="text-3xl font-bold mb-4">Edit Agent Information</h1>
        <div className="border-t border-gray-300 dark:border-gray-600 mb-6"></div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          {/* Avatar and Edit Controls Section */}
          <div className="flex flex-wrap items-start justify-between">
            {/* Avatar Preview and Upload */}
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview}
                alt={agent.name}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium mb-1">
                  Upload Avatar
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={!isEditing}
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Edit, Save, and Status Controls */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3">
                <Button
                  variant="solid"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  type="button"
                  onPress={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? "Cancel Edit" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    variant="solid"
                    className="bg-green-600 text-white hover:bg-green-700 transition-all"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={agent.status}
                  onChange={(e) => setAgent({ ...agent, status: e.target.checked })}
                  disabled={!isEditing}
                />
                <label htmlFor="status" className="text-sm font-medium">
                  Active Status
                </label>
              </div>
            </div>
          </div>

          {/* Name and Phone Number Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              type="text"
              value={agent.name}
              onChange={(e) => setAgent({ ...agent, name: e.target.value })}
              placeholder="Enter agent name"
              disabled={!isEditing}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={agent.phoneNumber}
              onChange={(e) => setAgent({ ...agent, phoneNumber: e.target.value })}
              placeholder="Enter phone number"
              disabled={!isEditing}
              required
            />
          </div>

          {/* Description */}
          <Input
            label="Description"
            type="text"
            value={agent.description}
            onChange={(e) => setAgent({ ...agent, description: e.target.value })}
            placeholder="Enter description"
            disabled={!isEditing}
            required
          />

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={agent.prompt}
              onChange={(e) => setAgent({ ...agent, prompt: e.target.value })}
              disabled={!isEditing}
              placeholder="Enter prompt"
              rows={5}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            ></textarea>
          </div>

          {/* Initial Response */}
          <Input
            label="Initial Response"
            type="text"
            value={agent.initialResponse}
            onChange={(e) =>
              setAgent({ ...agent, initialResponse: e.target.value })
            }
            placeholder="Enter initial response"
            disabled={!isEditing}
            required
          />
        </form>
      </div>
    </div>
  );
};

export default AgentInfo;
