"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, LogOut, ChevronLeft } from "lucide-react"
import Image from "next/image"
import type React from "react"

export default function NewDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
    } else {
      setAuthenticated(true)
      try {
        const decoded = JSON.parse(atob(token))
        setUsername(decoded.username)
        localStorage.setItem("currentUser", decoded.username)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const DashboardBox = ({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) => (
    <Link
      href={href}
      className="relative flex flex-col items-center justify-center p-6 backdrop-blur-md bg-white bg-opacity-50 rounded-3xl shadow-lg hover:bg-opacity-60 transition-all duration-300 border border-[#97a683]/30 group"
    >
      <div className="mb-4 text-[#2f2226] w-12 h-12 relative z-10">{icon}</div>
      <h2 className="text-xl font-mono font-thin text-[#2f2226] z-10">{title}</h2>
      <div className="absolute inset-0 bg-[#5a7247] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl transform translate-x-1 translate-y-1"></div>
    </Link>
  )

  return authenticated ? (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgdash-tkWpfFocEsJwQggAqCUMtkz0e47UQo.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="flex justify-between items-center fixed top-6 left-6 right-6 z-10">
        <Link
          href="/"
          className="flex items-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-mono font-thin text-[#2f2226] mb-12 text-center">Welcome, {username}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 w-full max-w-4xl">
          <DashboardBox
            title="Meal Planner"
            icon={
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carrot-KfqyYUcVLNCEUk5Hm7pdcTErGFD10r.png"
                alt="Meal Planner"
                fill
                className="object-contain"
              />
            }
            href="/diet"
          />
          <DashboardBox
            title="Fitness Planner"
            icon={
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbell-Rl0jCNTeAK7unQr1jLNjvUqpKKcekT.png"
                alt="Fitness Planner"
                fill
                className="object-contain"
              />
            }
            href="/workout"
          />
          <DashboardBox
            title="Symptom Tracker"
            icon={
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/notebook-h42318KitlAVpEFWTBDPevtwQnGnsR.png"
                alt="Symptom Tracker"
                fill
                className="object-contain"
              />
            }
            href="/calendar"
          />
        </div>
        <Link
          href="/profile"
          className="mt-8 bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300 flex items-center"
        >
          <User className="mr-2" size={20} />
          My Profile
        </Link>
      </main>
    </div>
  ) : null
}