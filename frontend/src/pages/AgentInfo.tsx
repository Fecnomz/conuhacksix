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
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode

  useEffect(() => {
    fetch(`http://localhost:5000/auth/agents/${id}`)
      .then((res) => res.json())
      .then((data: AgentDetails) => setAgent(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated agent details:", agent);

    // TODO: Add an API call to update the agent's information.
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

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-20 h-20 rounded-full"
            />
            <Input
              label="Avatar URL"
              type="url"
              value={agent.avatar}
              onChange={(e) => setAgent({ ...agent, avatar: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          {/* Name */}
          <Input
            label="Name"
            type="text"
            value={agent.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
            disabled={!isEditing}
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={agent.phoneNumber}
            onChange={(e) => setAgent({ ...agent, phoneNumber: e.target.value })}
            disabled={!isEditing}
          />

          {/* Description */}
          <Input
            label="Description"
            type="text"
            value={agent.description}
            onChange={(e) => setAgent({ ...agent, description: e.target.value })}
            disabled={!isEditing}
          />

          {/* Prompt */}
          <Input
            label="Prompt"
            type="text"
            value={agent.prompt}
            onChange={(e) => setAgent({ ...agent, prompt: e.target.value })}
            disabled={!isEditing}
          />

          {/* Initial Response */}
          <Input
            label="Initial Response"
            type="text"
            value={agent.initialResponse}
            onChange={(e) =>
              setAgent({ ...agent, initialResponse: e.target.value })
            }
            disabled={!isEditing}
          />

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={agent.status}
              onChange={(e) =>
                setAgent({ ...agent, status: e.target.checked })
              }
              disabled={!isEditing}
            />
            <label htmlFor="status" className="text-sm font-medium">
              Active Status
            </label>
          </div>

          {/* Edit and Submit Buttons */}
          <div className="flex gap-4">
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
        </form>
      </div>
    </div>
  );
};

export default AgentInfo;
