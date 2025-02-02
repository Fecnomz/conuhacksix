import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CardComponent from "../components/Card"
import Sidebar from "../components/Sidebar"

interface Agent {
  id: string
  avatar: string
  name: string
  description: string
  prompt: string
  initialResponse: string
  status: boolean
}

interface User {
  _id: string
  companyName: string
  email: string
  phoneNumber: string
  agents: Agent[]
  companyURI?: string
  companyDescription?: string
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [activeAgents, setActiveAgents] = useState<Agent[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }
    fetch("http://localhost:5000/auth/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then((data: { user: User }) => {
        if (data.user) {
          setUser(data.user)
          if (Array.isArray(data.user.agents)) {
            const filteredAgents = data.user.agents.filter(agent => agent.status === true)
            setActiveAgents(filteredAgents)
          }
        }
      })
      .catch(err => console.error(err))
  }, [navigate])

  return (
    <div className="h-screen w-full flex bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Sidebar />
      <div className="w-3/4 p-10">
        <h1 className="text-4xl font-extrabold mb-3">
          Welcome {user ? user.companyName : "Loading..."}
        </h1>
        <hr className="mb-4" />
        <p className="mb-8">
          {user && user.companyDescription
            ? user.companyDescription
            : "Here is your company overview and key resources to get started."}
        </p>
        <div className="grid grid-cols-3 gap-8">
          {activeAgents.map(agent => (
            <CardComponent
              key={agent.id}
              imageSrc={agent.avatar}
              imageAlt={agent.name}
              title={agent.name}
              subtitle={agent.prompt}
              description={agent.description}
              badgeColorClass="bg-green-500"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
